import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { BotanicalCornerTL, BotanicalCornerBR } from '@/components/BotanicalDecor';

export default function CTASection() {
  const t = useTranslations('cta');
  const locale = useLocale();

  return (
    <section className="bg-forest py-24 lg:py-32 relative overflow-hidden">
      <BotanicalCornerTL className="absolute top-0 left-0 w-56 h-56 text-white/10 pointer-events-none" />
      <BotanicalCornerBR className="absolute bottom-0 right-0 w-56 h-56 text-white/10 pointer-events-none" />

      {/* Subtle centered lotus watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <svg viewBox="0 0 300 240" className="w-96 h-72" fill="none">
          <path d="M150 220 Q150 120 150 30 Q150 120 150 220Z" stroke="white" strokeWidth="3" fill="none" />
          <path d="M150 220 Q90 170 60 90 Q115 160 150 220Z" stroke="white" strokeWidth="3" fill="none" />
          <path d="M150 220 Q40 185 20 100 Q90 165 150 220Z" stroke="white" strokeWidth="2" fill="none" />
          <path d="M150 220 Q210 170 240 90 Q185 160 150 220Z" stroke="white" strokeWidth="3" fill="none" />
          <path d="M150 220 Q260 185 280 100 Q210 165 150 220Z" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-6">
          {t('preTitle')}
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-6">
          {t('title')}
        </h2>
        <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          {t('subtitle')}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-3 px-10 py-4 bg-white text-forest font-medium tracking-wider uppercase text-sm rounded transition-all hover:bg-off-white hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
        >
          {t('button')}
        </Link>
      </div>
    </section>
  );
}
