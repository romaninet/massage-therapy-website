import { google } from 'googleapis'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  colorId?: string
  description?: string
}

export interface CreateEventParams {
  title: string
  start: Date
  end: Date
  colorId?: string
  description?: string
}

const TIMEZONE = 'America/Toronto'
const SLOW_MS = 2000
const EVENT_FIELDS = 'items(id,summary,start/dateTime,end/dateTime,colorId,description),nextPageToken'

function gcalLog(_fn: string, _msg: string, _extra?: Record<string, unknown>) {}

function gcalWarn(fn: string, msg: string, extra?: Record<string, unknown>) {
  const parts = [`[gcal][WARN] ${fn}: ${msg}`]
  if (extra) parts.push(JSON.stringify(extra))
  console.warn(parts.join(' '))
}

function gcalError(fn: string, msg: string, err: unknown) {
  const e = err as { status?: unknown; code?: unknown; message?: unknown }
  console.error(`[gcal][ERROR] ${fn}: ${msg}`, {
    status: e.status,
    code: e.code,
    message: e.message,
  })
}

function elapsed(start: number): number {
  return Math.round(Date.now() - start)
}

function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_PRIVATE_KEY
  const calendarId = process.env.GOOGLE_CALENDAR_ID ?? 'primary'

  if (!email) {
    throw new Error('Missing Google Calendar env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL')
  }
  if (!rawKey) {
    throw new Error('Missing Google Calendar env vars: GOOGLE_PRIVATE_KEY')
  }

  const privateKey = rawKey.replace(/\\n/g, '\n')

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  const calendar = google.calendar({ version: 'v3', auth })

  return { calendar, calendarId }
}

function toCalendarEvent(event: {
  id?: string | null
  summary?: string | null
  start?: { dateTime?: string | null } | null
  end?: { dateTime?: string | null } | null
  colorId?: string | null
  description?: string | null
}): CalendarEvent {
  return {
    id: event.id ?? '',
    title: event.summary ?? '',
    start: new Date(event.start?.dateTime ?? ''),
    end: new Date(event.end?.dateTime ?? ''),
    colorId: event.colorId ?? undefined,
    description: event.description ?? undefined,
  }
}

/** Returns the UTC Date corresponding to midnight on `dateStr` in Toronto time. */
function torontoMidnightUTC(dateStr: string): Date {
  // Probe noon UTC — always falls on the same Toronto calendar day (Toronto is UTC-4/UTC-5).
  const probeUTC = new Date(`${dateStr}T12:00:00Z`)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(probeUTC)
  const hours = parseInt(parts.find((p) => p.type === 'hour')!.value, 10)
  const minutes = parseInt(parts.find((p) => p.type === 'minute')!.value, 10)
  // noon UTC minus (hours:minutes past midnight in Toronto) = Toronto midnight in UTC
  return new Date(probeUTC.getTime() - (hours * 60 + minutes) * 60_000)
}

export async function listEventsForDate(date: string): Promise<CalendarEvent[]> {
  const { calendar, calendarId } = getCalendarClient()
  const t0 = Date.now()

  const timeMin = torontoMidnightUTC(date).toISOString()
  const [y, m, d] = date.split('-').map(Number)
  const nextDate = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10)
  const timeMax = torontoMidnightUTC(nextDate).toISOString()

  gcalLog('listEventsForDate', 'calling events.list', { date, timeMin, timeMax })

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      timeZone: TIMEZONE,
      singleEvents: true,
      orderBy: 'startTime',
      fields: EVENT_FIELDS,
    })

    const ms = elapsed(t0)
    const items = response.data.items ?? []

    if (ms > SLOW_MS) gcalWarn('listEventsForDate', `slow response ${ms}ms`, { date, count: items.length })
    else gcalLog('listEventsForDate', `done in ${ms}ms`, { date, count: items.length })

    return items.map(toCalendarEvent)
  } catch (err) {
    gcalError('listEventsForDate', `failed after ${elapsed(t0)}ms`, err)
    throw err
  }
}

export async function createEvent(params: CreateEventParams): Promise<string> {
  const { calendar, calendarId } = getCalendarClient()
  const t0 = Date.now()

  gcalLog('createEvent', 'calling events.insert', {
    title: params.title,
    start: params.start.toISOString(),
    end: params.end.toISOString(),
  })

  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: params.title,
        start: { dateTime: params.start.toISOString(), timeZone: TIMEZONE },
        end: { dateTime: params.end.toISOString(), timeZone: TIMEZONE },
        colorId: params.colorId,
        description: params.description,
      },
    })

    const ms = elapsed(t0)
    const id = response.data.id ?? ''

    if (ms > SLOW_MS) gcalWarn('createEvent', `slow response ${ms}ms`, { id, title: params.title })
    else gcalLog('createEvent', `done in ${ms}ms`, { id, title: params.title })

    return id
  } catch (err) {
    gcalError('createEvent', `failed after ${elapsed(t0)}ms`, err)
    throw err
  }
}

export async function updateEvent(
  eventId: string,
  params: Partial<CreateEventParams>
): Promise<void> {
  const { calendar, calendarId } = getCalendarClient()
  const t0 = Date.now()

  gcalLog('updateEvent', 'calling events.patch', {
    eventId,
    title: params.title,
    colorId: params.colorId,
  })

  try {
    await calendar.events.patch({
      calendarId,
      eventId,
      requestBody: {
        ...(params.title !== undefined && { summary: params.title }),
        ...(params.start !== undefined && {
          start: { dateTime: params.start.toISOString(), timeZone: TIMEZONE },
        }),
        ...(params.end !== undefined && {
          end: { dateTime: params.end.toISOString(), timeZone: TIMEZONE },
        }),
        ...(params.colorId !== undefined && { colorId: params.colorId }),
        ...(params.description !== undefined && { description: params.description }),
      },
    })

    const ms = elapsed(t0)
    if (ms > SLOW_MS) gcalWarn('updateEvent', `slow response ${ms}ms`, { eventId })
    else gcalLog('updateEvent', `done in ${ms}ms`, { eventId })
  } catch (err) {
    gcalError('updateEvent', `failed after ${elapsed(t0)}ms`, err)
    throw err
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const { calendar, calendarId } = getCalendarClient()
  const t0 = Date.now()

  gcalLog('deleteEvent', 'calling events.delete', { eventId })

  try {
    await calendar.events.delete({ calendarId, eventId })

    const ms = elapsed(t0)
    if (ms > SLOW_MS) gcalWarn('deleteEvent', `slow response ${ms}ms`, { eventId })
    else gcalLog('deleteEvent', `done in ${ms}ms`, { eventId })
  } catch (err) {
    gcalError('deleteEvent', `failed after ${elapsed(t0)}ms`, err)
    throw err
  }
}

export async function listEventsInRange(timeMin: Date, timeMax: Date, q?: string): Promise<CalendarEvent[]> {
  const { calendar, calendarId } = getCalendarClient()
  const t0 = Date.now()

  gcalLog('listEventsInRange', 'calling events.list', {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    ...(q ? { q } : {}),
  })

  try {
    const allItems: Array<Parameters<typeof toCalendarEvent>[0]> = []
    let pageToken: string | undefined
    let page = 0

    do {
      page++
      const response = await calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        timeZone: TIMEZONE,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250,
        fields: EVENT_FIELDS,
        ...(q ? { q } : {}),
        pageToken,
      })
      allItems.push(...(response.data.items ?? []))
      pageToken = response.data.nextPageToken ?? undefined
      if (pageToken) gcalLog('listEventsInRange', `fetched page ${page}, continuing (nextPageToken present)`)
    } while (pageToken)

    const ms = elapsed(t0)
    if (ms > SLOW_MS) gcalWarn('listEventsInRange', `slow response ${ms}ms`, { pages: page, count: allItems.length })
    else gcalLog('listEventsInRange', `done in ${ms}ms`, { pages: page, count: allItems.length })

    return allItems.map(toCalendarEvent)
  } catch (err) {
    gcalError('listEventsInRange', `failed after ${elapsed(t0)}ms`, err)
    throw err
  }
}

/** Get a single event by ID. Returns null if not found. */
export async function getEvent(eventId: string): Promise<CalendarEvent | null> {
  const { calendar, calendarId } = getCalendarClient()
  const t0 = Date.now()

  gcalLog('getEvent', 'calling events.get', { eventId })

  try {
    const response = await calendar.events.get({ calendarId, eventId })

    const ms = elapsed(t0)
    const ev = toCalendarEvent(response.data)

    if (ms > SLOW_MS) gcalWarn('getEvent', `slow response ${ms}ms`, { eventId, title: ev.title })
    else gcalLog('getEvent', `done in ${ms}ms`, { eventId, title: ev.title })

    return ev
  } catch (err: unknown) {
    const e = err as { code?: unknown; status?: unknown }
    if (e.status === 404 || e.code === 404 || e.code === '404') {
      gcalLog('getEvent', `event not found`, { eventId })
      return null
    }
    gcalError('getEvent', `failed after ${elapsed(t0)}ms`, err)
    throw err
  }
}
