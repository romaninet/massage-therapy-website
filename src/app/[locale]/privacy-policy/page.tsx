import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE } from '@/lib/config';
import { BotanicalCornerTL, BotanicalCornerBR, BotanicalDivider } from '@/components/BotanicalDecor';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn
      ? 'Privacy Policy | Olha Shelest Massage Therapy'
      : 'Politique de confidentialité | Massothérapie Olha Shelest',
    description: isEn
      ? 'Privacy policy for Olha Shelest massage therapy practice in Gatineau, QC. Compliant with Quebec Law 25 and PIPEDA.'
      : 'Politique de confidentialité de la pratique de massothérapie d\'Olha Shelest à Gatineau, QC. Conforme à la Loi 25 du Québec et à la LPRPDE.',
    alternates: {
      canonical: `/${locale}/privacy-policy`,
      languages: {
        en: '/en/privacy-policy',
        fr: '/fr/privacy-policy',
        'x-default': '/en/privacy-policy',
      },
    },
    openGraph: {
      url: `/${locale}/privacy-policy`,
      images: [
        {
          url: SITE.ogImage,
          alt: isEn
            ? 'Olha Shelest Massage Therapy — Gatineau, QC'
            : 'Massothérapie Olha Shelest — Gatineau, QC',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [SITE.ogImage],
    },
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'privacy' });
  const sections = t.raw('sections') as { title: string; content: string }[];

  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-36 pb-20 relative overflow-hidden">
        <BotanicalCornerTL className="absolute top-0 left-0 w-48 h-48 text-white/10 pointer-events-none" />
        <BotanicalCornerBR className="absolute bottom-0 right-0 w-48 h-48 text-white/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-5">
            {locale === 'en' ? 'Legal' : 'Juridique'}
          </p>
          <h1 className="font-heading text-5xl lg:text-6xl text-white font-semibold mb-4">
            {t('title')}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

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
