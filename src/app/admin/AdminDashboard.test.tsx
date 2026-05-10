import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from './AdminDashboard'

const { mockSignOut } = vi.hoisted(() => ({ mockSignOut: vi.fn() }))
vi.mock('next-auth/react', () => ({ signOut: mockSignOut }))

const pendingBooking = {
  eventId: 'evt-pending-1',
  status: 'pending' as const,
  clientName: 'Alice Martin',
  clientEmail: 'alice@example.com',
  clientPhone: '819-555-0001',
  serviceName: 'Deep Tissue Massage',
  durationMinutes: 60,
  sessionStart: '2030-06-15T10:00:00.000Z',
  sessionEnd: '2030-06-15T11:00:00.000Z',
  breakEnd: '2030-06-15T11:15:00.000Z',
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

/** URL-aware fetch mock: routes responses by URL prefix. */
function makeUrlFetch(
  bookings = [pendingBooking, confirmedBooking] as unknown[],
  availabilityBlocks: unknown[] = [],
) {
  return vi.fn().mockImplementation((url: string) => {
    if (typeof url === 'string' && url.includes('/api/admin/availability')) {
      return Promise.resolve({
        ok: true, status: 200,
        json: async () => ({ blocks: availabilityBlocks, bookedDates: [] }),
      })
    }
    if (typeof url === 'string' && url.includes('/api/admin/bookings')) {
      return Promise.resolve({
        ok: true, status: 200,
        json: async () => ({ bookings }),
      })
    }
    // Action endpoints (accept, decline, cancel)
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) })
  })
}

beforeEach(() => {
  global.fetch = makeUrlFetch()
  mockSignOut.mockReset()
  localStorage.setItem('adminLocale', 'en')
})

afterEach(() => {
  localStorage.removeItem('adminLocale')
  vi.restoreAllMocks()
})

describe('AdminDashboard', () => {
  it('renders all four tabs', async () => {
    render(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByTestId('tab-pending')).toBeInTheDocument()
      expect(screen.getByTestId('tab-confirmed')).toBeInTheDocument()
      expect(screen.getByTestId('tab-past')).toBeInTheDocument()
      expect(screen.getByTestId('tab-availability')).toBeInTheDocument()
    })
  })

  it('shows Pending and Confirmed tab buttons', async () => {
    render(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByTestId('tab-pending')).toBeInTheDocument()
      expect(screen.getByTestId('tab-confirmed')).toBeInTheDocument()
    })
  })

  it('Past tab is visible and has month/year selects', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    await user.click(screen.getByTestId('tab-past'))
    await waitFor(() => {
      expect(screen.getByText('Period:')).toBeInTheDocument()
      const selects = document.querySelectorAll('select')
      expect(selects.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('pending card shows client name, service, and Decline button', async () => {
    render(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText('Alice Martin')).toBeInTheDocument()
    })
    expect(screen.getByText('Deep Tissue Massage · 60 min')).toBeInTheDocument()
    expect(screen.getByText('Decline')).toBeInTheDocument()
  })

  it('confirmed card shows client name, service, and Cancel Booking button', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    await user.click(screen.getByTestId('tab-confirmed'))
    await waitFor(() => {
      expect(screen.getByText('Bob Tremblay')).toBeInTheDocument()
    })
    expect(screen.getByText('Relaxation Massage · 90 min')).toBeInTheDocument()
    expect(screen.getByText('Cancel Booking')).toBeInTheDocument()
  })

  it('clicking Decline shows confirmation dialog then calls /api/admin/decline and removes the card', async () => {
    const user = userEvent.setup()
    global.fetch = makeUrlFetch([pendingBooking, confirmedBooking])

    render(<AdminDashboard />)
    await waitFor(() => expect(screen.getByText('Alice Martin')).toBeInTheDocument())

    await user.click(screen.getByText('Decline'))

    await waitFor(() => {
      expect(screen.getByText('Decline booking?')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('confirm-decline'))

    await waitFor(() => {
      expect(screen.queryByText('Alice Martin')).not.toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/admin/decline', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-pending-1' }),
    }))
  })

  it('renders Sign out button and calls signOut when clicked', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard email="olha@example.com" />)
    const btn = screen.getByText('Sign out')
    expect(btn).toBeInTheDocument()
    await user.click(btn)
    expect(mockSignOut).toHaveBeenCalledOnce()
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' })
  })

  it('displays the email address passed as prop', async () => {
    render(<AdminDashboard email="olha@example.com" />)
    await waitFor(() => {
      expect(screen.getByText('olha@example.com')).toBeInTheDocument()
    })
  })

  it('clicking Cancel Booking shows dialog then calls /api/admin/cancel on confirm', async () => {
    const user = userEvent.setup()
    global.fetch = makeUrlFetch([confirmedBooking])

    render(<AdminDashboard />)
    await user.click(screen.getByTestId('tab-confirmed'))
    await waitFor(() => expect(screen.getByText('Bob Tremblay')).toBeInTheDocument())

    await user.click(screen.getByText('Cancel Booking'))
    await waitFor(() => {
      expect(screen.getByText('Cancel this booking?')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('confirm-cancel'))

    await waitFor(() => {
      expect(screen.queryByText('Bob Tremblay')).not.toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/admin/cancel', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed-1' }),
    }))
  })

  describe('Pending tab — pagination', () => {
    // Page size is 3 (BOOKING.pendingPageSize in config.ts)
    const PAGE_SIZE = 3

    function makeFuturePending(i: number) {
      const day = String(i).padStart(2, '0')
      return {
        eventId: `evt-pending-${i}`,
        status: 'pending' as const,
        clientName: `Client ${i}`,
        clientEmail: `client${i}@example.com`,
        clientPhone: `819-555-${String(i).padStart(4, '0')}`,
        serviceName: 'Deep Tissue Massage',
        durationMinutes: 60,
        sessionStart: `2030-06-${day}T10:00:00.000Z`,
        sessionEnd:   `2030-06-${day}T11:00:00.000Z`,
        breakEnd:     `2030-06-${day}T11:15:00.000Z`,
      }
    }

    it('shows all pending when count does not exceed page size', async () => {
      const bookings = Array.from({ length: PAGE_SIZE }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByText('Client 1')).toBeInTheDocument())
      for (let i = 1; i <= PAGE_SIZE; i++) {
        expect(screen.getByText(`Client ${i}`)).toBeInTheDocument()
      }
      expect(screen.queryByTestId('pending-prev')).not.toBeInTheDocument()
      expect(screen.queryByTestId('pending-next')).not.toBeInTheDocument()
    })

    it('shows pagination controls when count exceeds page size', async () => {
      const bookings = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByText('Client 1')).toBeInTheDocument())
      expect(screen.getByTestId('pending-prev')).toBeInTheDocument()
      expect(screen.getByTestId('pending-next')).toBeInTheDocument()
      expect(screen.getByTestId('pending-page-label')).toHaveTextContent('Page 1 of 2')
    })

    it('shows total pending count', async () => {
      const bookings = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByText(`${PAGE_SIZE + 1} pending requests in the next 365 days`)).toBeInTheDocument())
    })

    it('first page shows only first page of items', async () => {
      const bookings = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByText('Client 1')).toBeInTheDocument())
      for (let i = 1; i <= PAGE_SIZE; i++) {
        expect(screen.getByText(`Client ${i}`)).toBeInTheDocument()
      }
      expect(screen.queryByText(`Client ${PAGE_SIZE + 1}`)).not.toBeInTheDocument()
    })

    it('Prev is disabled on first page', async () => {
      const bookings = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByTestId('pending-prev')).toBeInTheDocument())
      expect(screen.getByTestId('pending-prev')).toBeDisabled()
      expect(screen.getByTestId('pending-next')).not.toBeDisabled()
    })

    it('clicking Next shows second page', async () => {
      const user = userEvent.setup()
      const bookings = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByTestId('pending-next')).toBeInTheDocument())
      await user.click(screen.getByTestId('pending-next'))

      await waitFor(() => expect(screen.getByText(`Client ${PAGE_SIZE + 1}`)).toBeInTheDocument())
      expect(screen.queryByText('Client 1')).not.toBeInTheDocument()
      expect(screen.getByTestId('pending-page-label')).toHaveTextContent('Page 2 of 2')
    })

    it('Next is disabled on last page', async () => {
      const user = userEvent.setup()
      const bookings = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByTestId('pending-next')).toBeInTheDocument())
      await user.click(screen.getByTestId('pending-next'))

      await waitFor(() => expect(screen.getByTestId('pending-page-label')).toHaveTextContent('Page 2 of 2'))
      expect(screen.getByTestId('pending-next')).toBeDisabled()
      expect(screen.getByTestId('pending-prev')).not.toBeDisabled()
    })

    it('clicking Prev goes back to first page', async () => {
      const user = userEvent.setup()
      const bookings = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => makeFuturePending(i + 1))
      global.fetch = makeUrlFetch(bookings)

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByTestId('pending-next')).toBeInTheDocument())
      await user.click(screen.getByTestId('pending-next'))
      await waitFor(() => expect(screen.getByTestId('pending-page-label')).toHaveTextContent('Page 2 of 2'))

      await user.click(screen.getByTestId('pending-prev'))

      await waitFor(() => expect(screen.getByTestId('pending-page-label')).toHaveTextContent('Page 1 of 2'))
      expect(screen.getByText('Client 1')).toBeInTheDocument()
      expect(screen.queryByText(`Client ${PAGE_SIZE + 1}`)).not.toBeInTheDocument()
    })

    it('filters out pending bookings with sessionStart in the past', async () => {
      const pastPending = {
        eventId: 'evt-past-pending',
        status: 'pending' as const,
        clientName: 'Past Client',
        clientEmail: 'past@example.com',
        clientPhone: '819-000-0000',
        serviceName: 'Relaxation Massage',
        durationMinutes: 60,
        sessionStart: '2020-01-01T10:00:00.000Z',
        sessionEnd:   '2020-01-01T11:00:00.000Z',
        breakEnd:     '2020-01-01T11:15:00.000Z',
      }
      global.fetch = makeUrlFetch([pastPending, makeFuturePending(1)])

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByText('Client 1')).toBeInTheDocument())
      expect(screen.queryByText('Past Client')).not.toBeInTheDocument()
    })

    it('shows singular "pending request" when count is 1', async () => {
      global.fetch = makeUrlFetch([makeFuturePending(1)])

      render(<AdminDashboard />)

      await waitFor(() => expect(screen.getByText('1 pending request in the next 365 days')).toBeInTheDocument())
    })
  })

  describe('Availability tab — add-block form validation', () => {
    async function openAddFormOnFutureDay(user: ReturnType<typeof userEvent.setup>) {
      // Switch to Availability tab, go to next month (all days are future)
      await user.click(screen.getByTestId('tab-availability'))
      await user.click(screen.getByText('Next →'))
      // Wait for the calendar to render, then click day 15
      await waitFor(() => expect(screen.getAllByText('15')[0]).toBeInTheDocument())
      await user.click(screen.getAllByText('15')[0])
      await waitFor(() => expect(screen.getByText(/Add availability/)).toBeInTheDocument())
    }

    it('shows error when end time is less than 1 hour after start', async () => {
      const user = userEvent.setup()
      render(<AdminDashboard />)
      await openAddFormOnFutureDay(user)

      // Set end to 09:30 — only 30 min after default start 09:00
      await user.selectOptions(screen.getByLabelText('End'), '09:30')
      await user.click(screen.getByText('Add block'))

      expect(screen.getByText('End time must be at least 1 hour after start time')).toBeInTheDocument()
    })

    it('does not show error when end time is exactly 1 hour after start', async () => {
      const user = userEvent.setup()
      render(<AdminDashboard />)
      await openAddFormOnFutureDay(user)

      // Set end to 10:00 — exactly 1 hour after default start 09:00
      await user.selectOptions(screen.getByLabelText('End'), '10:00')
      await user.click(screen.getByText('Add block'))

      expect(screen.queryByText('End time must be at least 1 hour after start time')).not.toBeInTheDocument()
    })

    it('shows error when new block overlaps an existing availability block', async () => {
      const user = userEvent.setup()

      // Compute day-15 of next month for the block date (matches openAddFormOnFutureDay)
      const now = new Date()
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const dateStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-15`

      // Existing block 08:00–10:00 overlaps with default form values 09:00–18:00
      global.fetch = makeUrlFetch([], [{ id: 'existing-1', date: dateStr, startTime: '08:00', endTime: '10:00' }])

      render(<AdminDashboard />)
      await openAddFormOnFutureDay(user)

      // Default start=09:00, end=18:00 — overlaps with existing 08:00–10:00
      await user.click(screen.getByText('Add block'))

      expect(screen.getByText('This time range overlaps with an existing availability block')).toBeInTheDocument()
    })

    it('does not show overlap error when blocks are adjacent', async () => {
      const user = userEvent.setup()

      const now = new Date()
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const dateStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-15`

      // Existing block ends at 09:00; new block default starts at 09:00 — adjacent, no overlap
      global.fetch = makeUrlFetch([], [{ id: 'existing-1', date: dateStr, startTime: '07:00', endTime: '09:00' }])

      render(<AdminDashboard />)
      await openAddFormOnFutureDay(user)

      // Default start=09:00, end=18:00 — adjacent to existing block, not overlapping
      await user.click(screen.getByText('Add block'))

      expect(screen.queryByText('This time range overlaps with an existing availability block')).not.toBeInTheDocument()
    })
  })

  describe('Availability tab — delete block', () => {
    function nextMonthDay15(): string {
      const now = new Date()
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-15`
    }

    async function openDayWithBlock(user: ReturnType<typeof userEvent.setup>) {
      await user.click(screen.getByTestId('tab-availability'))
      await user.click(screen.getByText('Next →'))
      await waitFor(() => expect(screen.getAllByText('15')[0]).toBeInTheDocument())
      await user.click(screen.getAllByText('15')[0])
      await waitFor(() => expect(screen.getByText(/Add availability/)).toBeInTheDocument())
      // Verify existing block list rendered
      await waitFor(() => expect(screen.getByText('Existing blocks on this day')).toBeInTheDocument())
    }

    it('shows existing blocks list with Delete button when day has blocks', async () => {
      const user = userEvent.setup()
      const dateStr = nextMonthDay15()
      global.fetch = makeUrlFetch([], [{ id: 'block-1', date: dateStr, startTime: '09:00', endTime: '17:00' }])

      render(<AdminDashboard />)
      await openDayWithBlock(user)

      expect(screen.getByText('09:00 – 17:00')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('clicking Delete shows confirmation dialog with block times', async () => {
      const user = userEvent.setup()
      const dateStr = nextMonthDay15()
      global.fetch = makeUrlFetch([], [{ id: 'block-1', date: dateStr, startTime: '09:00', endTime: '17:00' }])

      render(<AdminDashboard />)
      await openDayWithBlock(user)

      await user.click(screen.getByText('Delete'))

      await waitFor(() => {
        expect(screen.getByText('Are you sure you want to delete 09:00 – 17:00 block?')).toBeInTheDocument()
      })
      expect(screen.getByTestId('confirm-delete')).toBeInTheDocument()
    })

    it('clicking Cancel in dialog closes it without calling DELETE', async () => {
      const user = userEvent.setup()
      const dateStr = nextMonthDay15()
      global.fetch = makeUrlFetch([], [{ id: 'block-1', date: dateStr, startTime: '09:00', endTime: '17:00' }])

      render(<AdminDashboard />)
      await openDayWithBlock(user)
      await user.click(screen.getByText('Delete'))
      await waitFor(() => expect(screen.getByText(/Are you sure/)).toBeInTheDocument())

      await user.click(screen.getByTestId('cancel-delete'))

      await waitFor(() => {
        expect(screen.queryByText(/Are you sure/)).not.toBeInTheDocument()
      })
      expect(global.fetch).not.toHaveBeenCalledWith(
        '/api/admin/availability',
        expect.objectContaining({ method: 'DELETE' }),
      )
    })

    it('confirming delete calls DELETE API with the block id and closes dialog', async () => {
      const user = userEvent.setup()
      const dateStr = nextMonthDay15()
      global.fetch = makeUrlFetch([], [{ id: 'block-1', date: dateStr, startTime: '09:00', endTime: '17:00' }])

      render(<AdminDashboard />)
      await openDayWithBlock(user)
      await user.click(screen.getByText('Delete'))
      await waitFor(() => expect(screen.getByTestId('confirm-delete')).toBeInTheDocument())

      await user.click(screen.getByTestId('confirm-delete'))

      await waitFor(() => {
        expect(screen.queryByText(/Are you sure/)).not.toBeInTheDocument()
      })
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/availability',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ id: 'block-1' }),
        }),
      )
    })
  })
})
