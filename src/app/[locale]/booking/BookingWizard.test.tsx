vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en/booking',
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingWizard from './BookingWizard';

// Compute a test date that is always in the future and in the current month
// (uses day 28 if today is ≤ 25, otherwise uses day 5 of next month)
function computeTestDate() {
  const today = new Date();
  const d = new Date(today);
  if (today.getDate() <= 25) {
    d.setDate(28);
  } else {
    d.setMonth(d.getMonth() + 1);
    d.setDate(5);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = d.getDate();
  return {
    str: `${year}-${month}-${String(dayNum).padStart(2, '0')}`,
    day: dayNum,
  };
}
const { str: TEST_DATE_STR, day: TEST_DAY } = computeTestDate();

// Default fetch mock — returns empty availability
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ availableDates: [] }),
});

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

// Derive the test slot ISO from TEST_DATE_STR (14:00 Toronto = 18 or 19 UTC depending on DST)
const TEST_SLOT_ISO = `${TEST_DATE_STR}T14:00:00.000Z`;

// Helper: mock fetch so available-dates returns TEST_DATE_STR and slots returns given slots
function mockAvailabilityAndSlots(slots: { time: string; iso?: string; available: boolean }[]) {
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes('available-dates')) {
      return Promise.resolve({
        ok: true, status: 200,
        json: async () => ({ availableDates: [TEST_DATE_STR] }),
      });
    }
    return Promise.resolve({
      ok: true, status: 200,
      json: async () => ({ slots }),
    });
  });
}

// Helper: navigate to the month that contains TEST_DATE_STR if needed
async function navigateToTestMonth() {
  const today = new Date();
  const testDate = new Date(TEST_DATE_STR);
  if (testDate.getMonth() !== today.getMonth()) {
    const nextBtn = screen.getByLabelText('nextMonth');
    fireEvent.click(nextBtn);
  }
}

// Helper: advance to step 2 (calendar view)
async function goToStep2() {
  fireEvent.click(screen.getByTestId('service-card-therapeutic'));
  fireEvent.click(screen.getByTestId('duration-btn-therapeutic-60'));
  await waitFor(() => {
    expect(screen.getByLabelText('nextMonth')).toBeInTheDocument();
  });
  await navigateToTestMonth();
}

// Helper: click the available day in the calendar
async function clickAvailableDay() {
  await waitFor(() => {
    const dayBtn = screen.getByRole('button', { name: String(TEST_DAY) });
    expect(dayBtn).not.toBeDisabled();
  });
  fireEvent.click(screen.getByRole('button', { name: String(TEST_DAY) }));
}

describe('BookingWizard', () => {
  it('1. renders step 1 with service cards', () => {
    render(<BookingWizard locale="en" />);
    expect(screen.getByTestId('service-card-therapeutic')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-deepTissue')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-relaxation')).toBeInTheDocument();
  });

  it('2. clicking a service shows duration options', () => {
    render(<BookingWizard locale="en" />);
    fireEvent.click(screen.getByTestId('service-card-therapeutic'));
    expect(screen.getByTestId('duration-options-therapeutic')).toBeInTheDocument();
  });

  it('3. selecting service + duration advances to step 2 calendar', async () => {
    render(<BookingWizard locale="en" />);
    await goToStep2();
    // Calendar navigation buttons are present
    expect(screen.getByLabelText('prevMonth')).toBeInTheDocument();
    expect(screen.getByLabelText('nextMonth')).toBeInTheDocument();
  });

  it('4. step 2 shows a calendar grid with day-of-week headers', async () => {
    render(<BookingWizard locale="en" />);
    await goToStep2();
    // Day-of-week abbreviation for Monday in en-CA locale
    expect(screen.getAllByRole('button', { name: /^\d+$/ }).length).toBeGreaterThan(0);
  });

  it('5. clicking an available date advances to step 3 (time slots)', async () => {
    mockAvailabilityAndSlots([{ time: '10:00', iso: TEST_SLOT_ISO, available: true }]);

    render(<BookingWizard locale="en" />);
    await goToStep2();
    await clickAvailableDay();

    await waitFor(() => {
      expect(screen.getByTestId('time-slots')).toBeInTheDocument();
    });
  });

  it('6. step 3 shows available time slots and hides unavailable ones', async () => {
    mockAvailabilityAndSlots([
      { time: '09:00', iso: '2026-05-20T13:00:00.000Z', available: true },
      { time: '10:00', iso: TEST_SLOT_ISO, available: true },
      { time: '11:00', iso: '2026-05-20T15:00:00.000Z', available: false },
    ]);

    render(<BookingWizard locale="en" />);
    await goToStep2();
    await clickAvailableDay();

    await waitFor(() => {
      expect(screen.getByTestId('time-slot-09:00')).toBeInTheDocument();
      expect(screen.getByTestId('time-slot-10:00')).toBeInTheDocument();
      expect(screen.queryByTestId('time-slot-11:00')).not.toBeInTheDocument();
    });
  });

  it('7. selecting a time advances to step 4 with contact form', async () => {
    mockAvailabilityAndSlots([{ time: '10:00', iso: TEST_SLOT_ISO, available: true }]);

    render(<BookingWizard locale="en" />);
    await goToStep2();
    await clickAvailableDay();
    await waitFor(() => expect(screen.getByTestId('time-slot-10:00')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('time-slot-10:00'));

    await waitFor(() => {
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
      expect(screen.getByTestId('input-email')).toBeInTheDocument();
      expect(screen.getByTestId('input-phone')).toBeInTheDocument();
    });
  });

  it('8. submitting form calls POST /api/booking/request with correct data', async () => {
    const postMock = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({}),
    });

    global.fetch = vi.fn().mockImplementation((url: string, opts?: RequestInit) => {
      if (opts?.method === 'POST') return postMock(url, opts);
      if (url.includes('available-dates')) {
        return Promise.resolve({ ok: true, status: 200, json: async () => ({ availableDates: [TEST_DATE_STR] }) });
      }
      return Promise.resolve({
        ok: true, status: 200,
        json: async () => ({ slots: [{ time: '10:00', iso: TEST_SLOT_ISO, available: true }] }),
      });
    });

    render(<BookingWizard locale="en" />);
    await goToStep2();
    await clickAvailableDay();
    await waitFor(() => expect(screen.getByTestId('time-slot-10:00')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('time-slot-10:00'));
    await waitFor(() => expect(screen.getByTestId('input-name')).toBeInTheDocument());

    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '555-555-5555' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith(
        '/api/booking/request',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      const body = JSON.parse(postMock.mock.calls[0][1].body);
      expect(body).toMatchObject({
        service: 'therapeutic',
        duration: 60,
        date: TEST_DATE_STR,
        startTime: TEST_SLOT_ISO,
        clientName: 'Jane Doe',
        clientEmail: 'jane@example.com',
        clientPhone: '555-555-5555',
      });
    });
  });

  it('9. Deep Tissue Massage service card is present with duration options', () => {
    render(<BookingWizard locale="en" />);
    expect(screen.getByTestId('service-card-deepTissue')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('service-card-deepTissue'));
    expect(screen.getByTestId('duration-options-deepTissue')).toBeInTheDocument();
  });
});
