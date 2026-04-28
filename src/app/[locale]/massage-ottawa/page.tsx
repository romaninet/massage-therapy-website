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
    path: '/massage-ottawa',
    titles: {
      en: 'Massage Near Ottawa | 5 Min from Downtown via Portage Bridge | Olha Shelest',
      fr: 'Massage près d\'Ottawa | 5 min du centre-ville via le pont Portage | Olha Shelest',
    },
    descriptions: {
      en: 'Bilingual massage therapy 5 minutes from downtown Ottawa via the Portage bridge. Serving Ottawa residents and federal workers. AMQ-registered, insurance receipts provided.',
      fr: 'Massothérapie bilingue à 5 minutes du centre-ville d\'Ottawa via le pont Portage. Au service des résidents d\'Ottawa et des employés fédéraux. Membre AMQ, reçus d\'assurance fournis.',
    },
    ogImageAlt: {
      en: 'Massage therapy near Ottawa, across the Portage bridge',
      fr: 'Massothérapie près d\'Ottawa, de l\'autre côté du pont Portage',
    },
  });
}

export default async function MassageOttawaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'areas.ottawa' });
  const faqItems = t.raw('faq.items') as { question: string; answer: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(lang)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lang, [{ name: t('title'), path: `/${locale}/massage-ottawa` }])) }} />
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
