import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingWizard from './BookingWizard';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en/booking',
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

// Default fetch mock: return no slots
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ slots: [] }),
});

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

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

  it('3. selecting service + duration advances to step 2', async () => {
    render(<BookingWizard locale="en" />);
    fireEvent.click(screen.getByTestId('service-card-therapeutic'));
    fireEvent.click(screen.getByTestId('duration-btn-therapeutic-60'));
    await waitFor(() => {
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });
  });

  it('4. step 2 shows date picker', async () => {
    render(<BookingWizard locale="en" />);
    fireEvent.click(screen.getByTestId('service-card-therapeutic'));
    fireEvent.click(screen.getByTestId('duration-btn-therapeutic-60'));
    await waitFor(() => {
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });
  });

  it('5. selecting a date advances to step 3 (mock fetch returning a slot)', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ slots: [{ time: '10:00', available: true }] }),
    });

    render(<BookingWizard locale="en" />);
    // Go to step 2
    fireEvent.click(screen.getByTestId('service-card-therapeutic'));
    fireEvent.click(screen.getByTestId('duration-btn-therapeutic-60'));
    await waitFor(() => expect(screen.getByTestId('date-picker')).toBeInTheDocument());

    // Select a date
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2026-06-01' } });

    await waitFor(() => {
      expect(screen.getByTestId('time-slots')).toBeInTheDocument();
    });
  });

  it('6. step 3 shows time slots from API response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        slots: [
          { time: '09:00', available: true },
          { time: '10:00', available: true },
          { time: '11:00', available: false },
        ],
      }),
    });

    render(<BookingWizard locale="en" />);
    fireEvent.click(screen.getByTestId('service-card-therapeutic'));
    fireEvent.click(screen.getByTestId('duration-btn-therapeutic-60'));
    await waitFor(() => expect(screen.getByTestId('date-picker')).toBeInTheDocument());
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2026-06-01' } });

    await waitFor(() => {
      expect(screen.getByTestId('time-slot-09:00')).toBeInTheDocument();
      expect(screen.getByTestId('time-slot-10:00')).toBeInTheDocument();
      // unavailable slot should not be rendered
      expect(screen.queryByTestId('time-slot-11:00')).not.toBeInTheDocument();
    });
  });

  it('7. selecting a time advances to step 4 with contact form', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ slots: [{ time: '10:00', available: true }] }),
    });

    render(<BookingWizard locale="en" />);
    fireEvent.click(screen.getByTestId('service-card-therapeutic'));
    fireEvent.click(screen.getByTestId('duration-btn-therapeutic-60'));
    await waitFor(() => expect(screen.getByTestId('date-picker')).toBeInTheDocument());
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2026-06-01' } });
    await waitFor(() => expect(screen.getByTestId('time-slot-10:00')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('time-slot-10:00'));

    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-phone')).toBeInTheDocument();
  });

  it('8. submitting form calls POST /api/booking/request with correct data', async () => {
    // Step through to step 4
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ slots: [{ time: '10:00', available: true }] }) })
      // 30 days of date-checking fetches — return empty
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({ slots: [] }) });

    const postMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    render(<BookingWizard locale="en" />);
    fireEvent.click(screen.getByTestId('service-card-therapeutic'));
    fireEvent.click(screen.getByTestId('duration-btn-therapeutic-60'));
    await waitFor(() => expect(screen.getByTestId('date-picker')).toBeInTheDocument());

    // Override fetch for time slots and post
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ slots: [{ time: '10:00', available: true }] }) })
      .mockImplementationOnce(postMock);

    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2026-06-01' } });
    await waitFor(() => expect(screen.getByTestId('time-slot-10:00')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('time-slot-10:00'));

    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '555-555-5555' } });

    global.fetch = postMock;
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

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
        serviceKey: 'therapeutic',
        duration: 60,
        date: '2026-06-01',
        time: '10:00',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '555-555-5555',
      });
    });
  });

  it('9. ?service=deepTissue query param pre-selects Deep Tissue Massage service', () => {
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams('service=deepTissue'),
      useRouter: () => ({ push: vi.fn() }),
    }));

    // Re-import after mock update — for simplicity, verify expandedService logic
    // by checking that the deepTissue card is rendered (pre-selection logic is exercised)
    render(<BookingWizard locale="en" />);
    // The deep tissue card should exist and service-card be present
    expect(screen.getByTestId('service-card-deepTissue')).toBeInTheDocument();
    // Duration options should be visible because preselectedService sets expandedService
    expect(screen.getByTestId('duration-options-deepTissue')).toBeInTheDocument();
  });
});
