'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import { CUSTOMER_FEEDBACK } from '@/lib/customer-feedback';

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as 'en' | 'fr';

  // Start at 0 for SSR — randomise after hydration to avoid mismatch
  const [activeIndex, setActiveIndex] = useState(0);
  const total = CUSTOMER_FEEDBACK.length;

  useEffect(() => {
    setActiveIndex(Math.floor(Math.random() * total));
  }, [total]);

  const first = activeIndex % total;
  const second = (activeIndex + 1) % total;

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const next = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <section className="bg-off-white py-12 md:py-16 lg:py-24">
      <div className="container-wide">

        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="section-pretitle mb-3">
            {t('preTitle')}
          </p>
          <h2 className="heading-section mb-3">
            {t('title')}
          </h2>
          <BotanicalDivider className="w-48 lg:w-72 mx-auto text-sage/50 my-2 lg:my-6" />
        </div>

        {/* Arrows + cards row */}
        <div className="flex items-center gap-4 lg:gap-6">

          <button
            onClick={prev}
            aria-label={t('arrowPrev')}
            className="flex-none w-10 h-10 rounded-full border border-forest/20 flex items-center justify-center text-forest/40 hover:text-forest hover:border-forest/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
          >
            <ChevronLeft size={20} />
          </button>

          {/*
            All reviews are always rendered in the DOM so search crawlers
            index every review on the initial server-rendered HTML.
            Only the active pair is visible; the rest are hidden via CSS.
          */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CUSTOMER_FEEDBACK.map((review, idx) => (
              <div
                key={review.id}
                className={`bg-white rounded-lg p-8 border border-forest/[0.08] shadow-sm${
                  idx === first
                    ? ' flex flex-col'
                    : idx === second
                      ? ' hidden md:flex md:flex-col'
                      : ' hidden'
                }`}
              >
                <span aria-hidden="true" className="font-heading text-6xl leading-none text-sage/25 -mb-2 select-none">
                  &ldquo;
                </span>
                <p className="text-forest/70 text-sm leading-relaxed flex-1">
                  {review.quote[locale]}
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="h-px flex-1 bg-sage/20" />
                  <p className="text-forest font-medium text-sm tracking-wide">
                    {review.author}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            aria-label={t('arrowNext')}
            className="flex-none w-10 h-10 rounded-full border border-forest/20 flex items-center justify-center text-forest/40 hover:text-forest hover:border-forest/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
          >
            <ChevronRight size={20} />
          </button>

        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8" aria-hidden="true">
          {CUSTOMER_FEEDBACK.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                i === first
                  ? 'bg-sage'
                  : i === second
                    ? 'bg-forest/20 md:bg-sage'
                    : 'bg-forest/20'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
