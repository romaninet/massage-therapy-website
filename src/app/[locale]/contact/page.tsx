import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localBusinessJsonLd } from '@/lib/jsonld';
import { Phone, Mail, MapPin } from 'lucide-react';
import { BotanicalCornerTL, BotanicalCornerBR, BotanicalDivider } from '@/components/BotanicalDecor';
import ContactForm from '@/components/ContactForm';
import { BUSINESS, SITE, absoluteUrl } from '@/lib/config';

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
        ? 'Contact Olha Shelest | Book a Massage in Gatineau'
        : 'Contacter Olha Shelest | Réserver un massage à Gatineau',
    },
    description: isEn
      ? `Book a massage therapy appointment with Olha Shelest in Gatineau, QC. Call ${BUSINESS.phone} or send a message online. Located at ${BUSINESS.address}.`
      : `Réservez un rendez-vous de massothérapie avec Olha Shelest à Gatineau, QC. Appelez le ${BUSINESS.phone} ou envoyez un message en ligne. ${BUSINESS.address}.`,
    alternates: {
      canonical: absoluteUrl(`/${locale}/contact`),
      languages: { en: absoluteUrl('/en/contact'), fr: absoluteUrl('/fr/contact'), 'x-default': absoluteUrl('/en/contact') },
    },
    openGraph: {
      type: 'website',
      siteName: isEn ? SITE.siteNames.en : SITE.siteNames.fr,
      locale: isEn ? 'en_CA' : 'fr_CA',
      alternateLocale: isEn ? ['fr_CA'] : ['en_CA'],
      url: absoluteUrl(`/${locale}/contact`),
      images: [
        {
          url: absoluteUrl(SITE.ogImage),
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Contact Olha Shelest — massage therapy in Gatineau, QC'
            : 'Contacter Olha Shelest — massothérapie à Gatineau, QC',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [absoluteUrl(SITE.ogImage)],
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale)) }}
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

      {/* Contact content */}
      <section className="bg-off-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <BotanicalDivider className="w-64 mx-auto text-sage/50" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: contact info */}
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="font-heading text-3xl text-forest font-semibold mb-8">
                  {t('infoTitle')}
                </h2>

                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-pale-sage flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-sage" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-forest/40 mb-1">
                        {t('phone')}
                      </p>
                      <a
                        href={`tel:${BUSINESS.phoneTel}`}
                        className="font-medium text-forest text-lg hover:text-sage transition-colors"
                      >
                        {BUSINESS.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-pale-sage flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-sage" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-forest/40 mb-1">
                        {t('email')}
                      </p>
                      <a
                        href={`mailto:${BUSINESS.email}`}
                        className="font-medium text-forest text-lg hover:text-sage transition-colors break-all"
                      >
                        {BUSINESS.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-pale-sage flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-sage" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-forest/40 mb-1">
                        {t('address')}
                      </p>
                      <p className="font-medium text-forest text-lg leading-snug">
                        {BUSINESS.address}<br />
                        {BUSINESS.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-pale-sage border border-sage/20">
                <iframe
                  title="Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={BUSINESS.mapsUrl}
                />
              </div>
            </div>

            {/* Right: contact form */}
            <div className="bg-white rounded-lg p-8 lg:p-10 border border-forest/8 shadow-sm relative overflow-hidden">
              <BotanicalCornerBR className="absolute bottom-0 right-0 w-32 h-32 text-pale-sage pointer-events-none" />
              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
