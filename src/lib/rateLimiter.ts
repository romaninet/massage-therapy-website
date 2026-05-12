import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { RATE_LIMITING } from '@/lib/config'

let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(RATE_LIMITING.bookingRequestsPerIpPerHour, '1 h'),
      prefix: 'booking_request',
    })
  }
  return ratelimit
}

export async function checkBookingRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!RATE_LIMITING.ipLimitEnabled) return { allowed: true }

  const { success, reset } = await getRatelimit().limit(ip)
  if (success) return { allowed: true }
  return { allowed: false, retryAfter: Math.ceil((reset - Date.now()) / 1000) }
}
