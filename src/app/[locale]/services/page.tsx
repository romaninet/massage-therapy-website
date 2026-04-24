import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { SERVICES } from '@/lib/config';
import { servicesPageJsonLd, breadcrumbJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import CTASection from '@/components/sections/CTASection';
import PageHeaderSection from '@/components/sections/PageHeaderSection';
import ServiceIcon from '@/components/ServiceIcon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/services',
    titles: {
      en: 'Massage Services in Gatineau | Swedish, Deep Tissue & More | Serving Ottawa',
      fr: 'Services de massage à Gatineau | Suédois, profondeur et plus | Service Ottawa',
    },
    descriptions: {
      en: 'Professional massage services in Gatineau, QC — near Ottawa. Swedish, Deep Tissue, Relaxation, and Children\'s massage. Personalized therapeutic care by Olha Shelest, AMQ member.',
      fr: 'Services de massage professionnels à Gatineau, QC — près d\'Ottawa. Massage suédois, en profondeur, de relaxation et pour enfants. Soins personnalisés par Olha Shelest, membre AMQ.',
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
                    <ServiceIcon serviceKey={service.key} className="w-12 h-12" />
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

                {/* Image — full-width on mobile (above text), side column on desktop */}
                <div className={`relative order-first aspect-[4/3] lg:aspect-[4/5] rounded-lg overflow-hidden shadow-lg lg:shadow-2xl shadow-forest/15 ${isReversed ? 'lg:order-1' : 'lg:order-none'}`}>
                  <Image
                    src={service.image.src}
                    alt={service.image.alt[lang]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-forest/10" />
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-sage" />
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
