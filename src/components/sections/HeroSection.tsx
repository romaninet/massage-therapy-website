import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, BUSINESS } from '@/lib/config';
import { BotanicalCornerTL, BotanicalCornerBR } from '@/components/BotanicalDecor';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Full-bleed background image */}
      <Image
        src={SITE.heroBgImage}
        alt={t('imageAlt')}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />

      {/* Overlay layer 1 — darkening gradient, heavier at top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65 pointer-events-none" />
      {/* Overlay layer 2 — subtle edge vignette on desktop */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none hidden lg:block" />

      {/* Botanical corner accents */}
      <BotanicalCornerTL className="absolute top-0 left-0 w-56 h-56 text-white/15 pointer-events-none z-10" />
      <BotanicalCornerBR className="absolute bottom-0 right-0 w-48 h-48 text-white/10 pointer-events-none z-10" />

      {/* Mobile credential — pinned just below header */}
      <p className="lg:hidden absolute top-28 left-0 right-0 text-center text-white/70 font-medium tracking-[0.25em] uppercase text-xs z-20">
        {t('credential')}
      </p>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col lg:justify-end z-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28 text-center w-full flex-1 flex flex-col lg:block">

          {/* Text block — centered on mobile, inline on desktop */}
          <div className="flex-1 flex flex-col items-center justify-center lg:block">
            <p className="hidden lg:block text-white/70 font-medium tracking-[0.25em] uppercase text-xs mb-5">
              {t('credential')}
            </p>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-semibold text-white leading-[1.05] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              {t('tagline').split('. ').map((part, i, arr) => (
                <span key={i}>
                  {part}{i < arr.length - 1 ? '.' : ''}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>

          </div>

          {/* Subtitle + buttons — grouped at bottom on mobile */}
          <p className="text-white/90 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto mb-6 lg:mb-10 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-forest font-medium tracking-wider uppercase text-sm rounded transition-all hover:bg-off-white hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center justify-center px-8 py-4 border border-white/70 bg-forest/30 text-white font-medium tracking-wider uppercase text-sm rounded transition-all hover:border-white hover:bg-white/10 backdrop-blur-sm"
            >
              {t('meetOlha')}
            </Link>
          </div>

          {/* Location strip */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-white/30" />
            <p className="text-white/50 text-xs tracking-widest uppercase">
              {t('locationLabel')} {BUSINESS.cityName}, {BUSINESS.province}
            </p>
            <div className="h-px w-10 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-white/40 text-[10px] tracking-widest uppercase">{t('scroll')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-float" />
      </div>
    </section>
  );
}
