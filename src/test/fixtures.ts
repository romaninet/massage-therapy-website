export const ADMIN_SESSION = { user: { email: 'shelestwellness@gmail.com' }, expires: '' }

export const BOOKING_SESSION_START = new Date('2026-05-10T14:00:00.000Z')
export const BOOKING_SESSION_END = new Date('2026-05-10T15:00:00.000Z')
export const BOOKING_BREAK_END = new Date('2026-05-10T15:30:00.000Z')

export const MOCK_BOOKING_DESCRIPTION = JSON.stringify({
  clientName: 'Jane Doe',
  clientEmail: 'jane@example.com',
  clientPhone: '613-555-1234',
  serviceKey: 'deepTissue',
  serviceName: 'Deep Tissue Massage',
  durationMinutes: 60,
  sessionStart: '2026-05-10T14:00:00.000Z',
  sessionEnd: '2026-05-10T15:00:00.000Z',
  breakStart: '2026-05-10T15:00:00.000Z',
  breakEnd: '2026-05-10T15:30:00.000Z',
})
