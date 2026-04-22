import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { BotanicalCornerTL, BotanicalDivider } from '@/components/BotanicalDecor';

export default function AboutPreviewSection() {
  const t = useTranslations('about.preview');
  const locale = useLocale();

  return (
    <section className="bg-off-white py-12 md:py-16 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: text */}
          <div className="flex flex-col">
            <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-4">
              {t('preTitle')}
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl text-forest font-semibold leading-tight mb-4">
              {t('title')}
            </h2>
            <p className="font-heading text-sage/70 italic text-xl mb-6">{t('subtitle')}</p>
            <BotanicalDivider className="w-56 text-sage/40 mb-8" />
            <p className="text-forest/70 text-lg leading-relaxed mb-10">
              {t('bio')}
            </p>
            <Link
              href={`/${locale}/about`}
              className="self-start inline-flex items-center gap-3 px-8 py-4 bg-forest text-white font-medium tracking-wider uppercase text-sm rounded transition-all hover:bg-forest-dark hover:shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5"
            >
              {t('cta')}
            </Link>
          </div>

          {/* Right: decorative forest panel */}
          <div className="hidden lg:flex relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-forest items-center justify-center">
            <BotanicalCornerTL className="absolute top-0 left-0 w-36 h-36 text-white/15 pointer-events-none" />

            {/* Decorative botanical pattern */}
            <div className="relative z-10 text-center px-8">
              <div className="mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Olha Shelest logo"
                  width={400}
                  height={400}
                  className="mx-auto opacity-60 mix-blend-screen"
                  style={{ filter: 'invert(1) brightness(3)' }}
                />
              </div>
            </div>

            {/* Bottom botanical corner */}
            <div className="absolute bottom-0 right-0 w-32 h-32 text-sage/25">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                <path d="M110 10 Q100 50 60 70 Q80 40 110 10Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <path d="M115 30 Q90 60 50 80" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
