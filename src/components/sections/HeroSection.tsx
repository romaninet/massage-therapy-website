import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, BUSINESS } from '@/lib/config';
import { BotanicalCornerTL, BotanicalCornerBR } from '@/components/BotanicalDecor';

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
              {t('meetOlha')}
            </Link>
          </div>

          {/* Small decorative divider */}
          <div className="flex items-center gap-4 mt-14">
            <div className="h-px w-12 bg-sage/40" />
            <p className="text-forest/40 text-xs tracking-widest uppercase">
              {BUSINESS.cityName}, {BUSINESS.province}
            </p>
          </div>
        </div>

        {/* Right: hero image panel */}
        <div className="relative lg:block hidden min-h-[calc(100vh-8px)] mt-2 overflow-hidden rounded-3xl">
          {/* Photo */}
          <Image
            src={SITE.heroImage}
            alt={t('imageAlt')}
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />

          {/* Left edge: dissolves into off-white background */}
          <div className="absolute inset-0 bg-gradient-to-r from-off-white/60 via-transparent to-transparent" />
          {/* Top edge: subtle fade */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(250,249,245,0.62) 0%, transparent 22%)' }} />
          {/* Bottom: forest tint anchors the credential tag */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />

          {/* Bottom-left credential tag */}
          <div className="absolute bottom-10 left-8 z-10">
            <p className="font-heading text-white text-base italic tracking-wide drop-shadow-md">
              Olha Shelest
            </p>
            <p className="text-white/70 text-xs tracking-[0.25em] uppercase mt-0.5 drop-shadow-sm">
              {t('massageTherapy')}
            </p>
          </div>

          {/* Subtle botanical corner accent */}
          <BotanicalCornerBR className="absolute bottom-0 right-0 w-40 h-40 text-white/15 pointer-events-none z-10" />
        </div>
      </div>

      {/* Mobile background hint */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <BotanicalCornerBR className="absolute bottom-0 right-0 w-40 h-40 text-forest/10" />
      </div>
    </section>
  );
}
