export const MOCK_BOOKING_BASE = {
  breakAfterSession: 30,
  slotInterval: 30,
  calendarColors: { pending: '5', confirmed: '10', break: '3', availability: '2' },
  availabilityEventTitle: 'open',
  adminEmail: 'admin@example.com',
  eventTitles: {
    pending:   '[PENDING]',
    confirmed: '[CONFIRMED]',
    break:     '[BREAK]',
  },
} as const

export const MOCK_SERVICES = [
  {
    key: 'therapeutic',
    title: { en: 'Therapeutic Massage', fr: 'Massage thérapeutique' },
    tiers: [
      { duration: '60 min', price: 110 },
      { duration: '90 min', price: 150 },
    ],
  },
]
