import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import { SERVICES } from '@/lib/config';

const SERVICE_ICONS = {
  swedish: (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <path d="M16 24 Q20 16 24 14 Q28 16 32 24 Q28 32 24 34 Q20 32 16 24Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  deepTissue: (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
      <path d="M12 36 Q18 28 24 24 Q30 20 36 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 30 Q18 24 24 20 Q30 16 36 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M16 40 Q22 32 28 28 Q34 24 40 16" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  relaxation: (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
      <path d="M24 38 Q16 30 14 22 Q12 14 24 10 Q36 14 34 22 Q32 30 24 38Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M24 10 Q24 20 24 38" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M14 22 Q24 22 34 22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  children: (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 28 Q16 40 24 40 Q32 40 32 28 Q32 22 24 22 Q16 22 16 28Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 30 Q12 28 11 32 Q10 36 14 37" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M32 30 Q36 28 37 32 Q38 36 34 37" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
    </svg>
  ),
};

export default function ServicesSection() {
  const t = useTranslations('services');
  const locale = useLocale() as 'en' | 'fr';

  return (
    <section className="bg-pale-sage py-6 md:py-16 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-16">
          <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-3 lg:mb-4">
            {t('preTitle')}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl text-forest font-semibold mb-3 lg:mb-6">
            {t('title')}
          </h2>
          <BotanicalDivider className="w-48 lg:w-72 mx-auto text-sage/50 my-2 lg:my-6" />
          <p className="text-forest/60 text-lg max-w-xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.key}
              className="group bg-white rounded-lg p-8 border border-forest/8 hover:border-sage/40 hover:shadow-xl hover:shadow-forest/8 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5"
            >
              <div className="text-forest/50 group-hover:text-sage transition-colors duration-300">
                {SERVICE_ICONS[service.key]}
              </div>
              <div>
                <h3 className="font-heading text-forest text-xl font-semibold mb-3">
                  {service.title[locale]}
                </h3>
                <p className="text-forest/60 text-sm leading-relaxed">
                  {service.description[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 lg:mt-14">
          <Link
            href={`/${locale}/fees`}
            className="inline-flex items-center gap-2 text-forest border-b border-sage pb-0.5 hover:border-forest text-sm tracking-wider uppercase font-medium transition-colors"
          >
            {t('viewFees')}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
