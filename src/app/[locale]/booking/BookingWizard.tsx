'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { SERVICES } from '@/lib/config';
import { CheckCircle, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Step = 1 | 2 | 3 | 4;

interface Selection {
  serviceKey: string;
  duration: number;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
}

interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface TimeSlot {
  time: string;   // HH:MM
  available: boolean;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'slot_taken';

// Format HH:MM to "2:00 PM" in America/Toronto
function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const date = new Date(2000, 0, 1, h, m);
  return date.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Toronto',
  });
}

// Add N days to today (YYYY-MM-DD)
function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface StepIndicatorProps {
  current: Step;
}
function StepIndicator({ current }: StepIndicatorProps) {
  const steps: Step[] = [1, 2, 3, 4];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              s === current
                ? 'bg-[#2D6A4F] text-white'
                : s < current
                ? 'bg-[#52B788] text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {s < current ? <CheckCircle className="w-4 h-4" /> : s}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 ${
                s < current ? 'bg-[#52B788]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BookingWizard({ locale }: { locale: string }) {
  const t = useTranslations('booking');
  const searchParams = useSearchParams();

  const preselectedService = searchParams.get('service') ?? '';

  const [step, setStep] = useState<Step>(1);
  const [selection, setSelection] = useState<Partial<Selection>>({
    serviceKey: SERVICES.some((s) => s.key === preselectedService) ? preselectedService : undefined,
  });
  const [expandedService, setExpandedService] = useState<string | null>(
    SERVICES.some((s) => s.key === preselectedService) ? preselectedService : null
  );
  const [contact, setContact] = useState<ContactDetails>({ name: '', email: '', phone: '', notes: '' });
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactDetails, string>>>({});

  // Step 2: available dates (set of YYYY-MM-DD strings)
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loadingDates, setLoadingDates] = useState(false);

  // Step 3: time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Step 4: submission
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  // Fetch available dates for next 30 days when entering step 2
  const fetchAvailableDates = useCallback(async () => {
    if (!selection.serviceKey || !selection.duration) return;
    setLoadingDates(true);
    try {
      const today = new Date();
      const dates: string[] = [];
      for (let i = 0; i < 30; i++) {
        dates.push(addDays(today, i));
      }
      const results = await Promise.all(
        dates.map((date) =>
          fetch(
            `/api/booking/slots?date=${date}&service=${selection.serviceKey}&duration=${selection.duration}`
          ).then((r) => r.json() as Promise<{ slots?: TimeSlot[] }>)
        )
      );
      const available = new Set<string>();
      results.forEach((data, idx) => {
        if (data.slots && data.slots.some((s) => s.available)) {
          available.add(dates[idx]);
        }
      });
      setAvailableDates(available);
    } catch {
      // silently ignore fetch errors — user can still pick any date
    } finally {
      setLoadingDates(false);
    }
  }, [selection.serviceKey, selection.duration]);

  // Fetch time slots for selected date (step 3)
  const fetchTimeSlots = useCallback(async () => {
    if (!selection.serviceKey || !selection.duration || !selection.date) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/booking/slots?date=${selection.date}&service=${selection.serviceKey}&duration=${selection.duration}`
      );
      const data: { slots?: TimeSlot[] } = await res.json();
      setTimeSlots(data.slots ?? []);
    } catch {
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selection.serviceKey, selection.duration, selection.date]);

  useEffect(() => {
    if (step === 2) fetchAvailableDates();
  }, [step, fetchAvailableDates]);

  useEffect(() => {
    if (step === 3) fetchTimeSlots();
  }, [step, fetchTimeSlots]);

  // --- Step 1 handlers ---
  function handleServiceClick(key: string) {
    setExpandedService((prev) => (prev === key ? null : key));
    setSelection((prev) => ({ ...prev, serviceKey: key, duration: undefined }));
  }

  function handleDurationSelect(key: string, duration: number) {
    setSelection({ serviceKey: key, duration });
    setStep(2);
  }

  // --- Step 2 handler ---
  function handleDateSelect(date: string) {
    setSelection((prev) => ({ ...prev, date, time: undefined }));
    setStep(3);
  }

  // --- Step 3 handler ---
  function handleTimeSelect(time: string) {
    setSelection((prev) => ({ ...prev, time }));
    setStep(4);
  }

  // --- Step 4 handler ---
  function validateContact(): boolean {
    const errs: Partial<Record<keyof ContactDetails, string>> = {};
    if (!contact.name.trim()) errs.name = 'required';
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errs.email = 'required';
    if (!contact.phone.trim()) errs.phone = 'required';
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateContact()) return;
    setSubmitState('submitting');
    try {
      const res = await fetch('/api/booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: selection.serviceKey,
          duration: selection.duration,
          date: selection.date,
          time: selection.time,
          locale,
          ...contact,
        }),
      });
      if (res.status === 409) {
        const data: { code?: string } = await res.json();
        if (data.code === 'slot_taken') {
          setSubmitState('slot_taken');
          return;
        }
      }
      if (!res.ok) throw new Error('server error');
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  }

  // --- Render helpers ---
  function goBack() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  const service = SERVICES.find((s) => s.key === selection.serviceKey);

  // --- Success screen ---
  if (submitState === 'success') {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <CheckCircle className="w-16 h-16 text-[#2D6A4F] mx-auto mb-6" />
          <h2 className="font-heading text-2xl text-[#2D6A4F] font-semibold mb-3">{t('successTitle')}</h2>
          <p className="text-gray-600">{t('successMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="font-heading text-3xl lg:text-4xl text-[#2D6A4F] font-semibold text-center mb-2">
          {t('title')}
        </h1>
        <div className="w-12 h-0.5 bg-[#52B788] mx-auto mb-8" />

        <StepIndicator current={step} />

        {/* Back button (steps 2–4) */}
        {step > 1 && submitState !== 'success' && (
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm text-[#52B788] hover:text-[#2D6A4F] mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('back')}
          </button>
        )}

        {/* ── STEP 1: Service & Duration ── */}
        {step === 1 && (
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#2D6A4F] mb-6 text-center">
              {t('step1Title')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SERVICES.map((svc) => {
                const isExpanded = expandedService === svc.key;
                const isSelected = selection.serviceKey === svc.key;
                return (
                  <div
                    key={svc.key}
                    className={`rounded-xl border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'border-[#2D6A4F] bg-white shadow-md'
                        : 'border-gray-200 bg-white hover:border-[#52B788] hover:shadow-sm'
                    }`}
                  >
                    <button
                      className="w-full text-left px-5 py-4 flex items-center justify-between"
                      onClick={() => handleServiceClick(svc.key)}
                      data-testid={`service-card-${svc.key}`}
                    >
                      <div>
                        <div className="font-semibold text-[#2D6A4F]">
                          {svc.title[locale as 'en' | 'fr'] ?? svc.title.en}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {svc.tiers.length > 1
                            ? `${svc.tiers[0].price}$ – ${svc.tiers[svc.tiers.length - 1].price}$`
                            : `${svc.tiers[0].price}$`}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                          isSelected ? 'border-[#2D6A4F] bg-[#2D6A4F]' : 'border-gray-300'
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-4 pt-0 border-t border-gray-100 bg-[#F0F7F4]/40">
                        <p className="text-xs text-gray-500 mb-3 pt-3">
                          {t('step1Title')} — {svc.title[locale as 'en' | 'fr'] ?? svc.title.en}
                        </p>
                        <div className="flex flex-wrap gap-2" data-testid={`duration-options-${svc.key}`}>
                          {svc.tiers.map((tier) => {
                            const mins = typeof tier.duration === 'string'
                              ? parseInt(tier.duration, 10)
                              : tier.duration;
                            return (
                              <button
                                key={tier.duration}
                                className="px-4 py-2 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] text-sm font-medium hover:bg-[#2D6A4F] hover:text-white transition-colors"
                                onClick={() => handleDurationSelect(svc.key, mins)}
                                data-testid={`duration-btn-${svc.key}-${mins}`}
                              >
                                {mins} {t('min')} — {tier.price}$
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Pick a Date ── */}
        {step === 2 && (
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#2D6A4F] mb-6 text-center">
              {t('step2Title')}
            </h2>
            {loadingDates && (
              <div className="flex justify-center mb-4">
                <Loader2 className="w-6 h-6 text-[#52B788] animate-spin" />
              </div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                max={addDays(new Date(), 90)}
                className="w-full text-center text-lg text-[#2D6A4F] border-b-2 border-[#52B788] pb-2 outline-none bg-transparent cursor-pointer"
                data-testid="date-picker"
                onChange={(e) => {
                  if (e.target.value) handleDateSelect(e.target.value);
                }}
              />
              {!loadingDates && availableDates.size > 0 && (
                <p className="text-xs text-center text-[#52B788] mt-4">
                  {availableDates.size} dates available in the next 30 days
                </p>
              )}
            </div>
            <p className="text-xs text-center text-gray-400 mt-4">
              {service?.title[locale as 'en' | 'fr'] ?? ''} · {selection.duration} {t('min')}
            </p>
          </div>
        )}

        {/* ── STEP 3: Pick a Time ── */}
        {step === 3 && (
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#2D6A4F] mb-2 text-center">
              {t('step3Title')}
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              {selection.date}
            </p>
            {loadingSlots ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#52B788] animate-spin" />
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No available slots for this date.</div>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center" data-testid="time-slots">
                {timeSlots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-colors ${
                        selection.time === slot.time
                          ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                          : 'border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white'
                      }`}
                      data-testid={`time-slot-${slot.time}`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Contact Details ── */}
        {step === 4 && (
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#2D6A4F] mb-6 text-center">
              {t('step4Title')}
            </h2>

            {submitState === 'slot_taken' && (
              <div className="flex items-start gap-3 p-4 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{t('slotTaken')}</span>
              </div>
            )}
            {submitState === 'error' && (
              <div className="flex items-start gap-3 p-4 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>An error occurred. Please try again.</span>
              </div>
            )}

            {/* Booking summary */}
            <div className="bg-[#F0F7F4] rounded-xl p-4 mb-6 text-sm text-[#2D6A4F]">
              <div className="font-semibold mb-1">
                {service?.title[locale as 'en' | 'fr'] ?? ''} · {selection.duration} {t('min')}
              </div>
              <div className="text-gray-600">
                {selection.date} at {selection.time ? formatTime(selection.time) : ''}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2D6A4F] mb-1">{t('name')}</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:ring-2 focus:ring-[#52B788]/30 focus:border-[#52B788] ${
                    contactErrors.name ? 'border-red-400' : 'border-gray-300'
                  }`}
                  data-testid="input-name"
                />
                {contactErrors.name && <p className="text-xs text-red-500 mt-1">{t('name')} is required.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D6A4F] mb-1">{t('email')}</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:ring-2 focus:ring-[#52B788]/30 focus:border-[#52B788] ${
                    contactErrors.email ? 'border-red-400' : 'border-gray-300'
                  }`}
                  data-testid="input-email"
                />
                {contactErrors.email && <p className="text-xs text-red-500 mt-1">{t('email')} is required.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D6A4F] mb-1">{t('phone')}</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:ring-2 focus:ring-[#52B788]/30 focus:border-[#52B788] ${
                    contactErrors.phone ? 'border-red-400' : 'border-gray-300'
                  }`}
                  data-testid="input-phone"
                />
                {contactErrors.phone && <p className="text-xs text-red-500 mt-1">{t('phone')} is required.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D6A4F] mb-1">{t('notes')}</label>
                <textarea
                  value={contact.notes}
                  onChange={(e) => setContact((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:ring-2 focus:ring-[#52B788]/30 focus:border-[#52B788] resize-none"
                  data-testid="input-notes"
                />
              </div>

              <Button
                type="submit"
                disabled={submitState === 'submitting'}
                className="w-full bg-[#2D6A4F] hover:bg-[#245c44] text-white py-6 text-sm font-medium tracking-wider uppercase transition-all hover:shadow-lg disabled:opacity-60"
              >
                {submitState === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('submit')}
                  </span>
                ) : (
                  t('submit')
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
