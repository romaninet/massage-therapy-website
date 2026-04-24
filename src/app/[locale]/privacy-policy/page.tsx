import { getTranslations, setRequestLocale } from 'next-intl/server';
import { breadcrumbJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import PageHeaderSection from '@/components/sections/PageHeaderSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/privacy-policy',
    titles: {
      en: 'Privacy Policy | Olha Shelest Massage Therapy',
      fr: 'Politique de confidentialité | Massothérapie Olha Shelest',
    },
    descriptions: {
      en: 'Privacy policy for Olha Shelest massage therapy practice in Gatineau, QC. Compliant with Quebec Law 25 and PIPEDA.',
      fr: 'Politique de confidentialité de la pratique de massothérapie d\'Olha Shelest à Gatineau, QC. Conforme à la Loi 25 du Québec et à la LPRPDE.',
    },
  });
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'privacy' });
  const sections = t.raw('sections') as { title: string; content: string }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(locale as Locale, [{ name: t('title'), path: `/${locale}/privacy-policy` }])) }}
      />
      <PageHeaderSection preTitle={t('preTitle')} title={t('title')} subtitle={t('subtitle')} />

      {/* Content */}
      <section className="bg-off-white py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <BotanicalDivider className="w-64 mx-auto text-sage/50" />
            <p className="text-forest/40 text-sm mt-6 tracking-wide">{t('lastUpdated')}</p>
          </div>

          <div className="flex flex-col gap-10">
            {sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-3">
                <h2 className="font-heading text-forest text-xl font-semibold">
                  {section.title}
                </h2>
                <p className="text-forest/65 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
