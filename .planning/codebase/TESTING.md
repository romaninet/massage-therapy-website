---
title: Testing
focus: quality
last_mapped: 2026-05-05
---

# Testing

## Framework

**Vitest 4.x** — configured in `vitest.config.ts`

Run with: `npm test` (executes `vitest run` — single pass, no watch mode)

## Current Coverage

### Active Test Files

| File | Tests | Coverage |
|------|-------|---------|
| `src/lib/validation.test.ts` | 19 | Input validators and text filters |

### Test Structure

```ts
// Pattern: describe / it / expect — pure function tests, no mocking
describe('validator name', () => {
  it('should do X when Y', () => {
    expect(fn(input)).toBe(expected);
  });
});
```

**3 describe blocks** in validation.test.ts covering all validators and text filters in `src/lib/validation.ts`.

## What Is NOT Tested

- **React components** — no component tests (no Testing Library setup)
- **API routes** — no integration tests for `src/app/api/contact/route.ts`
- **E2E flows** — no Playwright or Cypress
- **i18n** — no tests for translation completeness
- **SEO** — no automated meta tag verification
- **Coverage enforcement** — no coverage thresholds configured

## Gaps & Recommendations

1. **Contact form API** — highest risk; handles user data and external Resend API calls; worth an integration test
2. **i18n key coverage** — a script to diff `en.json` vs `fr.json` keys would catch missing translations early
3. **Component smoke tests** — Testing Library + jest-dom setup for critical components (HeroSection, ContactForm)
4. **No CI test gate** — tests are not currently enforced in a CI pipeline

## Test Dependencies

```json
"vitest": "^4.1.5"
```

No additional test utilities currently installed (no `@testing-library/react`, no `@testing-library/jest-dom`, no Playwright).
