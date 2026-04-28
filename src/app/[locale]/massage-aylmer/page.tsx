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
    path: '/massage-aylmer',
    titles: {
      en: 'Massage in Aylmer, Gatineau | Olha Shelest — AMQ Registered',
      fr: 'Massage à Aylmer, Gatineau | Olha Shelest — Membre AMQ',
    },
    descriptions: {
      en: 'Professional massage therapy for Aylmer residents — 15 minutes east along Boulevard des Allumettières in Hull–Gatineau. Therapeutic, deep tissue, relaxation & more. Insurance receipts provided.',
      fr: 'Massothérapie professionnelle pour les résidents d\'Aylmer — 15 minutes vers l\'est sur le boulevard des Allumettières à Hull–Gatineau. Thérapeutique, profond, relaxation et plus. Reçus d\'assurance fournis.',
    },
    ogImageAlt: {
      en: 'Massage therapy for Aylmer residents in Gatineau, QC',
      fr: 'Massothérapie pour les résidents d\'Aylmer à Gatineau, QC',
    },
  });
}

export default async function MassageAylmerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'areas.aylmer' });
  const faqItems = t.raw('faq.items') as { question: string; answer: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(lang)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lang, [{ name: t('title'), path: `/${locale}/massage-aylmer` }])) }} />
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
