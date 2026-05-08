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

/**
 * List all events for a specific date (midnight-to-midnight in America/Toronto timezone).
 * @param date - Format: 'YYYY-MM-DD'
 */
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

  // Use exact Toronto midnight-to-midnight bounds (accounts for EDT/EST automatically).
  const [y, m, d] = date.split('-').map(Number)
  const nextDate = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10)

  const response = await calendar.events.list({
    calendarId,
    timeMin: torontoMidnightUTC(date).toISOString(),
    timeMax: torontoMidnightUTC(nextDate).toISOString(),
    timeZone: TIMEZONE,
    singleEvents: true,
    orderBy: 'startTime',
  })

  const items = response.data.items ?? []
  return items.map(toCalendarEvent)
}

/**
 * Create a new calendar event.
 * @returns The created event's ID.
 */
export async function createEvent(params: CreateEventParams): Promise<string> {
  const { calendar, calendarId } = getCalendarClient()

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: params.title,
      start: {
        dateTime: params.start.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: params.end.toISOString(),
        timeZone: TIMEZONE,
      },
      colorId: params.colorId,
      description: params.description,
    },
  })

  return response.data.id ?? ''
}

/**
 * Update an existing event (patch — partial update).
 */
export async function updateEvent(
  eventId: string,
  params: Partial<CreateEventParams>
): Promise<void> {
  const { calendar, calendarId } = getCalendarClient()

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
}

/**
 * Delete an event by ID.
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const { calendar, calendarId } = getCalendarClient()

  await calendar.events.delete({
    calendarId,
    eventId,
  })
}

/**
 * List all events between two Date objects (handles pagination).
 */
export async function listEventsInRange(timeMin: Date, timeMax: Date): Promise<CalendarEvent[]> {
  const { calendar, calendarId } = getCalendarClient()

  const allItems: Array<Parameters<typeof toCalendarEvent>[0]> = []
  let pageToken: string | undefined

  do {
    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIMEZONE,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
      pageToken,
    })
    allItems.push(...(response.data.items ?? []))
    pageToken = response.data.nextPageToken ?? undefined
  } while (pageToken)

  return allItems.map(toCalendarEvent)
}

/**
 * Get a single event by ID. Returns null if not found.
 */
export async function getEvent(eventId: string): Promise<CalendarEvent | null> {
  const { calendar, calendarId } = getCalendarClient()

  try {
    const response = await calendar.events.get({
      calendarId,
      eventId,
    })
    return toCalendarEvent(response.data)
  } catch (err: unknown) {
    const status = (err as { code?: number })?.code
    if (status === 404) return null
    throw err
  }
}
