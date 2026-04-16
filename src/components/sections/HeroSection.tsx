import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { BotanicalCornerTL, BotanicalCornerBR, LotusIcon } from '@/components/BotanicalDecor';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-off-white pt-24">
      {/* Subtle botanical corner accents on the off-white side */}
      <BotanicalCornerTL className="absolute top-20 left-0 w-52 h-52 text-sage/20 pointer-events-none z-10" />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 items-center gap-0 min-h-[calc(100vh-5rem)]">
        {/* Left: text content */}
        <div className="relative z-10 py-20 lg:py-0 flex flex-col justify-center">
          <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-6">
            {t('credential')}
          </p>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold text-forest leading-[1.1] mb-8">
            {t('tagline').split('. ').map((part, i, arr) => (
              <span key={i}>
                {part}{i < arr.length - 1 ? '.' : ''}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p className="text-forest/70 text-lg leading-relaxed max-w-md mb-10">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-8 py-4 bg-forest text-white font-medium tracking-wider uppercase text-sm rounded transition-all hover:bg-forest-dark hover:shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center justify-center px-8 py-4 border border-forest/30 text-forest font-medium tracking-wider uppercase text-sm rounded transition-all hover:border-forest hover:bg-forest/5"
            >
              {locale === 'en' ? 'Meet Olha' : 'Rencontrer Olha'}
            </Link>
          </div>

          {/* Small decorative divider */}
          <div className="flex items-center gap-4 mt-14">
            <div className="h-px w-12 bg-sage/40" />
            <p className="text-forest/40 text-xs tracking-widest uppercase">
              Gatineau, QC
            </p>
          </div>
        </div>

        {/* Right: forest green decorative panel */}
        <div className="relative lg:flex hidden items-center justify-center min-h-screen bg-forest">
          {/* Corner botanical accents in sage */}
          <BotanicalCornerBR className="absolute bottom-0 right-0 w-48 h-48 text-sage/30 pointer-events-none" />
          <BotanicalCornerTL className="absolute top-0 left-0 w-48 h-48 text-white/10 pointer-events-none" />

          {/* Large lotus illustration */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <LotusIcon className="w-72 h-56 text-white/20 animate-float" />
            <div className="text-center">
              <p className="font-heading text-white/40 text-lg italic tracking-wide">
                Olha Shelest
              </p>
              <p className="text-white/25 text-xs tracking-[0.3em] uppercase mt-1">
                {locale === 'en' ? 'Massage Therapy' : 'Massothérapie'}
              </p>
            </div>
          </div>

          {/* Decorative botanical lines on the panel */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              viewBox="0 0 500 800"
              className="absolute inset-0 w-full h-full opacity-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M50 750 Q100 600 200 500 Q280 420 350 300 Q420 180 450 50" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M150 750 Q180 620 250 520 Q330 420 380 300 Q440 160 460 20" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M200 750 Q200 550 180 400 Q160 250 200 100" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" />
              <ellipse cx="200" cy="500" rx="120" ry="80" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
              <ellipse cx="300" cy="300" rx="90" ry="60" stroke="white" strokeWidth="0.5" fill="none" opacity="0.2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile background hint */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <BotanicalCornerBR className="absolute bottom-0 right-0 w-40 h-40 text-forest/10" />
      </div>
    </section>
  );
}
