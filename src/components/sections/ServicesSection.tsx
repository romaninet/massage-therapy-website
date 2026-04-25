import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import { SERVICES } from '@/lib/config';
import ServiceIcon from '@/components/ServiceIcon';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.key}
              className="group bg-white rounded-lg p-8 border border-forest/8 hover:border-sage/40 hover:shadow-xl hover:shadow-forest/8 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5"
            >
              <div className="text-forest/50 group-hover:text-sage transition-colors duration-300">
                <ServiceIcon serviceKey={service.key} className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-forest text-xl font-semibold mb-3">
                  {service.title[locale]}
                </h3>
                <p className="text-forest/60 text-sm leading-relaxed">
                  {service.description[locale]}
                </p>
              </div>
              <Link
                href={`/${locale}/services#${service.key}`}
                className="inline-flex items-center gap-1 text-sage hover:text-forest text-xs tracking-wider uppercase font-medium transition-colors"
              >
                {t('learnMore')}
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="text-center mt-8 lg:mt-14 flex flex-wrap justify-center gap-6">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-forest border-b border-sage pb-0.5 hover:border-forest text-sm tracking-wider uppercase font-medium transition-colors"
          >
            {t('exploreAll')}
            <span>→</span>
          </Link>
          <Link
            href={`/${locale}/fees`}
            className="inline-flex items-center gap-2 text-forest/50 border-b border-forest/20 pb-0.5 hover:text-forest hover:border-forest text-sm tracking-wider uppercase font-medium transition-colors"
          >
            {t('viewFees')}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
