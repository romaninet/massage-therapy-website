import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE, SERVICES, BUSINESS, absoluteUrl } from '@/lib/config';
import { servicesJsonLd, type Locale } from '@/lib/jsonld';
import Link from 'next/link';
import { Clock, Banknote, CreditCard, FileText } from 'lucide-react';
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
      ? 'Transparent pricing for massage therapy in Gatineau. Swedish, deep tissue, relaxation & children\'s massage from $95 CAD. Direct insurance billing available.'
      : 'Tarifs transparents pour la massothérapie à Gatineau. Massages suédois, en profondeur, relaxation et pour enfants à partir de 95 $ CAD. Facturation directe disponible.',
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
  const isEn = locale === 'en';
  const lang: Locale = isEn ? 'en' : 'fr';

  // Flat list used only for JSON-LD structured data
  const servicesFlat = SERVICES.flatMap((s) =>
    s.tiers.map((tier) => ({
      name: s.title[lang],
      duration: tier.duration,
      price: isEn ? `$${tier.price}` : `${tier.price} $`,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd(servicesFlat, lang)) }}
      />
      {/* Hero */}
      <section className="bg-forest pt-36 pb-8 lg:pb-20 relative overflow-hidden">
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
      <section className="bg-off-white py-5 md:py-16 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-3 lg:mb-14">
            <BotanicalDivider className="w-64 mx-auto text-sage/50" />
          </div>

          <div className="space-y-4">
            {SERVICES.map((service) => (
              <div
                key={service.key}
                id={service.key}
                className="scroll-mt-32 bg-white rounded-lg border border-forest/8 overflow-hidden"
              >
                {/* Service name row with action links */}
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-8 py-4 bg-pale-sage/60 border-b border-forest/8">
                  <h3 className="font-heading text-forest text-lg font-semibold">
                    {service.title[lang]}
                  </h3>
                  <div className="flex flex-col gap-1.5 flex-shrink-0 items-start">
                    <Link
                      href={`/${locale}/services#${service.key}`}
                      className="text-sage hover:text-forest text-xs tracking-wider uppercase font-medium transition-colors"
                    >
                      {t('learnMore')} →
                    </Link>
                    <Link
                      href={`/${locale}/contact?type=${service.key}`}
                      className="text-sage hover:text-forest text-xs tracking-wider uppercase font-medium transition-colors"
                    >
                      {t('bookSession')} →
                    </Link>
                  </div>
                </div>
                {/* Tier rows */}
                {service.tiers.map((tier) => (
                  <div
                    key={tier.duration}
                    className="group flex items-center justify-between gap-4 px-8 py-5 border-b border-forest/5 last:border-0 hover:bg-pale-sage/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-sage/70">
                      <Clock size={14} />
                      <span className="text-sm font-medium text-forest/50">{tier.duration}</span>
                    </div>
                    <span className="font-heading text-forest text-2xl font-semibold group-hover:text-sage transition-colors">
                      {isEn ? `$${tier.price}` : `${tier.price} $`}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pricing + Payment combined */}
            <div className="bg-pale-sage rounded-lg p-6 border border-sage/20 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sage">
                  <Banknote size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-forest/50">{t('notePricingLabel')}</span>
                </div>
                <ul className="space-y-2">
                  {[t('notePricing1'), t('notePricing2')].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-forest/70 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-sage/20 pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sage">
                  <CreditCard size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-forest/50">{t('notePaymentLabel')}</span>
                </div>
                <ul className="space-y-2">
                  {BUSINESS.paymentAccepted.map((method) => (
                    <li key={method} className="flex items-center gap-2 text-forest/70 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Insurance */}
            <div className="bg-pale-sage rounded-lg p-6 border border-sage/20 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sage">
                <FileText size={18} />
                <span className="text-xs font-semibold uppercase tracking-widest text-forest/50">{t('noteInsuranceLabel')}</span>
              </div>
              <p className="text-forest/70 text-sm leading-relaxed">{t('noteInsurance')}</p>
            </div>
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
