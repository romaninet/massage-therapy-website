import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from './AdminDashboard'

const pendingBooking = {
  eventId: 'evt-pending-1',
  status: 'pending' as const,
  clientName: 'Alice Martin',
  clientEmail: 'alice@example.com',
  clientPhone: '819-555-0001',
  serviceName: 'Deep Tissue Massage',
  durationMinutes: 60,
  sessionStart: '2026-05-10T10:00:00.000Z',
  sessionEnd: '2026-05-10T11:00:00.000Z',
  breakEnd: '2026-05-10T11:15:00.000Z',
  clientNotes: 'Please focus on the back',
}

const confirmedBooking = {
  eventId: 'evt-confirmed-1',
  status: 'confirmed' as const,
  clientName: 'Bob Tremblay',
  clientEmail: 'bob@example.com',
  clientPhone: '613-555-0002',
  serviceName: 'Relaxation Massage',
  durationMinutes: 90,
  sessionStart: '2026-05-11T14:00:00.000Z',
  sessionEnd: '2026-05-11T15:30:00.000Z',
  breakEnd: '2026-05-11T15:45:00.000Z',
}

function makeFetch(data: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: async () => data,
  })
}

beforeEach(() => {
  global.fetch = makeFetch([pendingBooking, confirmedBooking])
})

afterEach(() => {
  vi.restoreAllMocks()
})

// Test 1: renders Upcoming and Past tabs
describe('AdminDashboard', () => {
  it('renders Upcoming and Past tabs', async () => {
    render(<AdminDashboard />)
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText('Past')).toBeInTheDocument()
  })

  // Test 2: Future tab shows Pending Requests and Confirmed Bookings sections
  it('shows Pending Requests and Confirmed Bookings sections on Upcoming tab', async () => {
    render(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText('Pending Requests')).toBeInTheDocument()
      expect(screen.getByText('Confirmed Bookings')).toBeInTheDocument()
    })
  })

  // Test 3: Past tab has a date input
  it('Past tab is visible and has a date input', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    await user.click(screen.getByText('Past'))
    await waitFor(() => {
      const dateInput = document.querySelector('input[type="date"]')
      expect(dateInput).toBeInTheDocument()
    })
  })

  // Test 4: Pending booking card shows client name, service, and Decline button
  it('pending card shows client name, service, and Decline button', async () => {
    render(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText('Alice Martin')).toBeInTheDocument()
    })
    expect(screen.getByText('Deep Tissue Massage · 60 min')).toBeInTheDocument()
    expect(screen.getByText('Decline')).toBeInTheDocument()
  })

  // Test 5: Confirmed booking card shows client name, service, and Cancel Booking button
  it('confirmed card shows client name, service, and Cancel Booking button', async () => {
    render(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText('Bob Tremblay')).toBeInTheDocument()
    })
    expect(screen.getByText('Relaxation Massage · 90 min')).toBeInTheDocument()
    expect(screen.getByText('Cancel Booking')).toBeInTheDocument()
  })

  // Test 6: Clicking Decline calls correct API and removes card
  it('clicking Decline calls /api/admin/decline and removes the card', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [pendingBooking, confirmedBooking] })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })
    global.fetch = mockFetch

    render(<AdminDashboard />)
    await waitFor(() => expect(screen.getByText('Alice Martin')).toBeInTheDocument())

    await user.click(screen.getByText('Decline'))

    await waitFor(() => {
      expect(screen.queryByText('Alice Martin')).not.toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/admin/decline', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-pending-1' }),
    }))
  })

  // Test 7: Clicking Cancel Booking shows confirmation dialog, then calls API on confirm
  it('clicking Cancel Booking shows dialog then calls /api/admin/cancel on confirm', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [confirmedBooking] })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })
    global.fetch = mockFetch

    render(<AdminDashboard />)
    await waitFor(() => expect(screen.getByText('Bob Tremblay')).toBeInTheDocument())

    // Click Cancel Booking — should show confirmation dialog
    await user.click(screen.getByText('Cancel Booking'))
    await waitFor(() => {
      expect(screen.getByText('Cancel this booking?')).toBeInTheDocument()
    })

    // Click Yes, Cancel in the dialog
    await user.click(screen.getByTestId('confirm-cancel'))

    await waitFor(() => {
      expect(screen.queryByText('Bob Tremblay')).not.toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/admin/cancel', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed-1' }),
    }))
  })
})
