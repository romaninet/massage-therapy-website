import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localBusinessJsonLd, breadcrumbJsonLd, faqJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import AreaPageTemplate from '@/components/sections/AreaPageTemplate';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/massage-outaouais',
    titles: {
      en: 'Massage Therapy in the Outaouais | Olha Shelest — Hull–Gatineau',
      fr: 'Massothérapie en Outaouais | Olha Shelest — Hull–Gatineau',
    },
    descriptions: {
      en: 'Bilingual, AMQ-registered massage therapy serving the entire Outaouais region — Hull, Aylmer, Gatineau, Chelsea, Wakefield, and beyond. Insurance receipts provided.',
      fr: 'Massothérapie bilingue membre AMQ au service de toute la région de l\'Outaouais — Hull, Aylmer, Gatineau, Chelsea, Wakefield et au-delà. Reçus d\'assurance fournis.',
    },
    ogImageAlt: {
      en: 'Massage therapy serving the Outaouais region, QC',
      fr: 'Massothérapie au service de la région de l\'Outaouais, QC',
    },
  });
}

export default async function MassageOutaouaisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'areas.outaouais' });
  const faqItems = t.raw('faq.items') as { question: string; answer: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(lang)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lang, [{ name: t('title'), path: `/${locale}/massage-outaouais` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }} />
      <AreaPageTemplate
        locale={locale}
        preTitle={t('preTitle')}
        title={t('title')}
        subtitle={t('subtitle')}
        paragraphs={t.raw('paragraphs') as string[]}
        gettingHereTitle={t('gettingHere.title')}
        gettingHereBody={t('gettingHere.body')}
        servicesTitle={t('servicesTitle')}
        faqPreTitle={t('faq.preTitle')}
        faqTitle={t('faq.title')}
        faqItems={faqItems}
      />
    </>
  );
}
