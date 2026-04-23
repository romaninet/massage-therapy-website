import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { SITE, SERVICES, absoluteUrl } from '@/lib/config';
import { servicesPageJsonLd, type Locale } from '@/lib/jsonld';
import { BotanicalCornerTL, BotanicalCornerBR, BotanicalDivider } from '@/components/BotanicalDecor';
import CTASection from '@/components/sections/CTASection';

const SERVICE_ICONS = {
  swedish: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <path d="M16 24 Q20 16 24 14 Q28 16 32 24 Q28 32 24 34 Q20 32 16 24Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  deepTissue: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
      <path d="M12 36 Q18 28 24 24 Q30 20 36 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 30 Q18 24 24 20 Q30 16 36 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M16 40 Q22 32 28 28 Q34 24 40 16" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  relaxation: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
      <path d="M24 38 Q16 30 14 22 Q12 14 24 10 Q36 14 34 22 Q32 30 24 38Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M24 10 Q24 20 24 38" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M14 22 Q24 22 34 22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  children: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
      <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 28 Q16 40 24 40 Q32 40 32 28 Q32 22 24 22 Q16 22 16 28Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 30 Q12 28 11 32 Q10 36 14 37" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M32 30 Q36 28 37 32 Q38 36 34 37" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
    </svg>
  ),
} as const;

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
        ? 'Massage Services | Swedish, Deep Tissue & More | Olha Shelest, Gatineau'
        : 'Services de massage | Suédois, profondeur et plus | Olha Shelest, Gatineau',
    },
    description: isEn
      ? 'Explore professional massage services in Gatineau: Swedish, Deep Tissue, Relaxation, and Children\'s massage. Personalized therapeutic care by Olha Shelest, AMQ member.'
      : 'Découvrez les services de massage professionnels à Gatineau : massage suédois, en profondeur, de relaxation et pour enfants. Soins thérapeutiques personnalisés par Olha Shelest, membre AMQ.',
    alternates: {
      canonical: absoluteUrl(`/${locale}/services`),
      languages: {
        en: absoluteUrl('/en/services'),
        fr: absoluteUrl('/fr/services'),
        'x-default': absoluteUrl('/en/services'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: isEn ? SITE.siteNames.en : SITE.siteNames.fr,
      locale: isEn ? 'en_CA' : 'fr_CA',
      alternateLocale: isEn ? ['fr_CA'] : ['en_CA'],
      url: absoluteUrl(`/${locale}/services`),
      images: [
        {
          url: absoluteUrl(SITE.ogImage),
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Massage therapy services in Gatineau, QC'
            : 'Services de massothérapie à Gatineau, QC',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [absoluteUrl(SITE.ogImage)],
    },
  };
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

      {/* Page header — compact dark header, same style as About / Fees */}
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

      {/* Divider */}
      <div className="bg-off-white py-6 lg:py-10 flex justify-center">
        <BotanicalDivider className="w-48 lg:w-72 text-sage/40" />
      </div>

      {/* Service sections — alternating layout */}
      {SERVICES.map((service, index) => {
        const isReversed = index % 2 === 1;
        const serviceT = t.raw(`services.${service.key}`) as {
          longDescription: string;
          benefits: string[];
          whoFor: string;
        };
        const startingPrice = service.tiers[0].price;
        const priceDisplay = lang === 'fr' ? `${startingPrice} $` : `$${startingPrice}`;

        return (
          <section
            key={service.key}
            id={service.key}
            className={`scroll-mt-24 ${index % 2 === 0 ? 'bg-off-white' : 'bg-pale-sage'} py-12 lg:py-24 relative overflow-hidden`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-20 items-center`}>

                {/* Text column — order flips on desktop for odd indices */}
                <div className={isReversed ? 'lg:order-2' : ''}>
                  <div className="text-sage mb-5">
                    {SERVICE_ICONS[service.key as keyof typeof SERVICE_ICONS]}
                  </div>
                  <h2 className="font-heading text-4xl lg:text-5xl text-forest font-semibold mb-5">
                    {service.title[lang]}
                  </h2>
                  <BotanicalDivider className="w-40 text-sage/40 mb-6" />
                  <p className="text-forest/75 text-lg leading-relaxed mb-7">
                    {serviceT.longDescription}
                  </p>

                  {/* Benefits */}
                  <div className="mb-7">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
                      {t('benefitsLabel')}
                    </p>
                    <ul className="space-y-2">
                      {serviceT.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-forest/65 text-sm leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0 mt-[7px]" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Who it's for */}
                  <div className="mb-8 p-4 rounded-lg bg-forest/5 border-l-2 border-sage">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-1">
                      {t('whoForLabel')}
                    </p>
                    <p className="text-forest/65 text-sm leading-relaxed">{serviceT.whoFor}</p>
                  </div>

                  {/* Price + CTAs */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-forest/40 mb-0.5">
                        {t('startingFrom')}
                      </p>
                      <p className="font-heading text-forest text-3xl font-semibold">{priceDisplay}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center ml-2">
                      <Link
                        href={`/${locale}/contact?type=${service.key}`}
                        className="px-6 py-3 bg-forest text-white text-sm tracking-wider uppercase font-medium rounded transition-all hover:bg-forest/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-forest/20"
                      >
                        {t('bookSession')}
                      </Link>
                      <Link
                        href={`/${locale}/fees#${service.key}`}
                        className="text-forest/60 text-sm hover:text-forest transition-colors flex items-center gap-1 font-medium"
                      >
                        {t('seeFullPricing')} →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Image column — hidden on mobile, order flips for odd indices */}
                <div className={`hidden lg:block relative ${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl shadow-forest/15">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt[lang]}
                      fill
                      sizes="(max-width: 1024px) 0vw, 50vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-forest/10" />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-sage" />
                  </div>
                </div>

              </div>
            </div>
          </section>
        );
      })}

      <CTASection />
    </>
  );
}
