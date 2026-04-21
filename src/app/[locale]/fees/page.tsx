import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE, absoluteUrl } from '@/lib/config';
import { servicesJsonLd } from '@/lib/jsonld';
import Link from 'next/link';
import { Clock, Info } from 'lucide-react';
import { BotanicalCornerTL, BotanicalCornerBR, BotanicalDivider } from '@/components/BotanicalDecor';
import CTASection from '@/components/sections/CTASection';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: {
      absolute: isEn
        ? 'Massage Therapy Fees & Services | Olha Shelest, Gatineau'
        : 'Tarifs et services de massothérapie | Olha Shelest, Gatineau',
    },
    description: isEn
      ? 'Transparent pricing for massage therapy in Gatineau. Swedish, deep tissue, relaxation & children\'s massage from $65 CAD. Direct insurance billing available.'
      : 'Tarifs transparents pour la massothérapie à Gatineau. Massages suédois, en profondeur, relaxation et pour enfants à partir de 65 $ CAD. Facturation directe disponible.',
    alternates: {
      canonical: absoluteUrl(`/${locale}/fees`),
      languages: { en: absoluteUrl('/en/fees'), fr: absoluteUrl('/fr/fees'), 'x-default': absoluteUrl('/en/fees') },
    },
    openGraph: {
      type: 'website',
      siteName: isEn ? SITE.siteNames.en : SITE.siteNames.fr,
      locale: isEn ? 'en_CA' : 'fr_CA',
      alternateLocale: isEn ? ['fr_CA'] : ['en_CA'],
      url: absoluteUrl(`/${locale}/fees`),
      images: [
        {
          url: absoluteUrl(SITE.ogImage),
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Massage therapy fees and services in Gatineau, QC'
            : 'Tarifs et services de massothérapie à Gatineau, QC',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [absoluteUrl(SITE.ogImage)],
    },
  };
}

export default async function FeesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'fees' });
  const services = t.raw('services') as { duration: string; name: string; price: string }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd(services, locale)) }}
      />
      {/* Hero */}
      <section className="bg-forest pt-36 pb-20 relative overflow-hidden">
        <BotanicalCornerTL className="absolute top-0 left-0 w-48 h-48 text-white/10 pointer-events-none" />
        <BotanicalCornerBR className="absolute bottom-0 right-0 w-48 h-48 text-white/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-5">
            {t('preTitle')}
          </p>
          <h1 className="font-heading text-5xl lg:text-6xl text-white font-semibold mb-4">
            {t('title')}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Pricing table */}
      <section className="bg-off-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <BotanicalDivider className="w-64 mx-auto text-sage/50" />
          </div>

          <div className="space-y-3">
            {services.map((service, i) => (
              <div
                key={i}
                className="group flex items-center justify-between gap-4 bg-white rounded-lg px-8 py-6 border border-forest/8 hover:border-sage/40 hover:shadow-lg hover:shadow-forest/8 transition-all duration-300"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-sage/70 flex-shrink-0">
                    <Clock size={14} />
                    <span className="text-sm font-medium text-forest/50 w-14">{service.duration}</span>
                  </div>
                  <div className="h-8 w-px bg-forest/10" />
                  <h3 className="font-heading text-forest text-lg font-medium truncate">
                    {service.name}
                  </h3>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-heading text-forest text-2xl font-semibold group-hover:text-sage transition-colors">
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="mt-10 flex items-start gap-4 bg-pale-sage rounded-lg p-6 border border-sage/20 relative overflow-hidden">
            <BotanicalCornerBR className="absolute bottom-0 right-0 w-20 h-20 text-sage/20 pointer-events-none" />
            <Info size={18} className="text-sage mt-0.5 flex-shrink-0" />
            <p className="text-forest/65 text-sm leading-relaxed relative z-10">
              {t('note')}
            </p>
          </div>

          {/* CTA card */}
          <div className="mt-16 text-center p-12 bg-forest rounded-lg relative overflow-hidden">
            <BotanicalCornerTL className="absolute top-0 left-0 w-32 h-32 text-white/10 pointer-events-none" />
            <BotanicalCornerBR className="absolute bottom-0 right-0 w-32 h-32 text-white/10 pointer-events-none" />
            <h2 className="font-heading text-3xl text-white font-semibold mb-3 relative z-10">
              {t('ctaTitle')}
            </h2>
            <p className="text-white/60 mb-8 relative z-10">{t('ctaText')}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest font-medium tracking-wider uppercase text-sm rounded transition-all hover:bg-off-white hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 relative z-10"
            >
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
