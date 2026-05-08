---
title: Testing
focus: quality
last_mapped: 2026-05-07
---

# Testing

## Framework

**Vitest 4.x** with `jsdom` environment — configured in `vitest.config.ts`

Run with: `npm test` (executes `vitest run` — single pass, no watch mode)

## Current Coverage

**111 tests across 13 files**

| File | Tests | What it covers |
|------|-------|----------------|
| `src/lib/validation.test.ts` | 19 | Input validators and text filters |
| `src/lib/bookingSlots.test.ts` | ~20 | Slot availability algorithm — availability windows, blocking events, edge cases |
| `src/lib/bookingTokens.test.ts` | ~10 | HMAC sign/verify, token expiry (7-day TTL), malformed tokens |
| `src/lib/bookingEmails.test.ts` | ~10 | Email template rendering for all 4 email types + bot alert |
| `src/app/api/booking/slots/route.test.ts` | ~8 | GET /api/booking/slots — disabled flag, calendar lookups |
| `src/app/api/booking/request/route.test.ts` | ~15 | POST /api/booking/request — honeypot, timing, max-pending, slot validation |
| `src/app/api/booking/confirm/route.test.ts` | ~10 | GET /api/booking/confirm — HMAC verify, conflict check, state transitions |
| `src/app/api/booking/decline/route.test.ts` | ~8 | GET /api/booking/decline — HMAC verify, delete, email |
| `src/app/api/admin/bookings/route.test.ts` | ~5 | GET /api/admin/bookings — auth, listing |
| `src/app/api/admin/cancel/route.test.ts` | ~7 | POST /api/admin/cancel — guard, delete + break event, cancellation email |
| `src/app/api/admin/decline/route.test.ts` | ~6 | POST /api/admin/decline — guard, CSRF, delete, decline email |
| `src/app/[locale]/booking/BookingWizard.test.tsx` | ~9 | Booking wizard — step navigation, API calls |
| `src/app/admin/AdminDashboard.test.tsx` | ~7 | Dashboard — tabs, booking cards, Decline/Cancel actions |

## Shared Test Utilities

### `src/test/mockConfig.ts`
Shared mock for `vi.mock('@/lib/config')` — used by all booking API route tests via async factory:
```ts
vi.mock('@/lib/config', async () => {
  const { MOCK_BOOKING_BASE, MOCK_SERVICES } = await import('@/test/mockConfig')
  return {
    get BOOKING() { return { ...MOCK_BOOKING_BASE, showBookingsService } },
    SERVICES: MOCK_SERVICES,
  }
})
```

### `src/test/fixtures.ts`
Shared test data for admin route tests:
- `ADMIN_SESSION` — mock NextAuth session object
- `MOCK_BOOKING_DESCRIPTION` — JSON string matching the shape stored in Calendar event descriptions
- `BOOKING_SESSION_START`, `BOOKING_SESSION_END`, `BOOKING_BREAK_END` — canonical test timestamps

## Mocking Patterns

API route tests mock the entire `@/lib/config`, `@/lib/googleCalendar`, `@/lib/bookingEmails`, and `@/lib/bookingTokens` modules with `vi.mock`. Feature flags (`showBookingsService`, `showBookingsAdmin`) are mutable `let` variables closed over in the mock factory so individual tests can flip them.

Admin route tests also mock `next-auth` (`getServerSession`) to control session state.

Component tests (BookingWizard, AdminDashboard) use `@testing-library/react` with `jsdom`.

## Test Dependencies

```json
"vitest": "^4.1.5",
"@testing-library/react": "...",
"@testing-library/jest-dom": "..."
```

Setup file: `src/test-setup.ts` — imports `@testing-library/jest-dom` matchers.

## What Is NOT Tested

- **E2E flows** — no Playwright or Cypress
- **i18n** — no tests for translation completeness
- **SEO** — no automated meta tag verification
- **Coverage enforcement** — no coverage thresholds configured
- **Rate limiting** — not yet implemented; no tests
