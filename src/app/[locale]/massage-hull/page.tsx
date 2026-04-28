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
    path: '/massage-hull',
    titles: {
      en: 'Massage in Hull–Gatineau | Steps from Place du Portage | Olha Shelest',
      fr: 'Massage à Hull–Gatineau | À deux pas de la Place du Portage | Olha Shelest',
    },
    descriptions: {
      en: 'Professional massage therapy in Hull–Gatineau, steps from Place du Portage. Serving Hull residents and Ottawa federal workers. AMQ-registered. Insurance receipts provided.',
      fr: 'Massothérapie professionnelle à Hull–Gatineau, à deux pas de la Place du Portage. Au service des résidents de Hull et des employés fédéraux d\'Ottawa. Membre AMQ. Reçus d\'assurance fournis.',
    },
    ogImageAlt: {
      en: 'Massage therapy in Hull–Gatineau, QC',
      fr: 'Massothérapie à Hull–Gatineau, QC',
    },
  });
}

export default async function MassageHullPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'areas.hull' });
  const faqItems = t.raw('faq.items') as { question: string; answer: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(lang)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lang, [{ name: t('title'), path: `/${locale}/massage-hull` }])) }} />
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
