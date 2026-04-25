import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SERVICES } from '@/lib/config';
import { servicesPageJsonLd, breadcrumbJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import CTASection from '@/components/sections/CTASection';
import PageHeaderSection from '@/components/sections/PageHeaderSection';
import ServiceCard from '@/components/sections/ServiceCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/services',
    titles: {
      en: 'Massage Services in Hull–Gatineau | Therapeutic, Deep Tissue, Lymphatic & More | Near Ottawa',
      fr: 'Services de massage à Hull–Gatineau | Thérapeutique, profondeur, lymphatique et plus | Près d\'Ottawa',
    },
    descriptions: {
      en: 'Massage therapy in Hull–Gatineau for back pain, tension headaches & sports recovery. Therapeutic, deep tissue, relaxation, lymphatic drainage & couples massage. Serving Ottawa & Outaouais.',
      fr: 'Massothérapie à Hull–Gatineau pour maux de dos, céphalées et récupération sportive. Massage thérapeutique, profond, relaxation, drainage lymphatique et duo. Service Ottawa et Outaouais.',
    },
    ogImageAlt: {
      en: 'Massage therapy services in Gatineau, QC',
      fr: 'Services de massothérapie à Gatineau, QC',
    },
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'servicesPage' });
  const lang = locale as Locale;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageJsonLd(lang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lang, [{ name: t('title'), path: `/${locale}/services` }])) }}
      />

      <PageHeaderSection preTitle={t('preTitle')} title={t('title')} subtitle={t('subtitle')} pb="pb-8 lg:pb-20" />

      {/* Divider */}
      <div className="bg-off-white py-6 lg:py-10 flex justify-center">
        <BotanicalDivider className="w-48 lg:w-72 text-sage/40" />
      </div>

      {/* Service sections — alternating layout */}
      {SERVICES.map((service, index) => (
        <ServiceCard
          key={service.key}
          service={service}
          index={index}
          locale={locale}
          lang={lang}
          content={t.raw(`services.${service.key}`) as { longDescription: string; whoFor: string }}
          labels={{
            whoForLabel: t('whoForLabel'),
            startingFrom: t('startingFrom'),
            bookSession: t('bookSession'),
            seeFullPricing: t('seeFullPricing'),
          }}
        />
      ))}

      <CTASection />
    </>
  );
}
