import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localBusinessJsonLd, breadcrumbJsonLd, type Locale } from '@/lib/jsonld';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { BotanicalCornerBR, BotanicalDivider } from '@/components/BotanicalDecor';
import PageHeaderSection from '@/components/sections/PageHeaderSection';
import ContactForm from '@/components/ContactForm';
import { BUSINESS } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/contact',
    titles: {
      en: 'Contact Olha Shelest | Book a Massage in Hull, Gatineau — Near Ottawa',
      fr: 'Contacter Olha Shelest | Réserver un massage à Hull, Gatineau — Près d\'Ottawa',
    },
    descriptions: {
      en: `Book a massage in Hull–Gatineau with Olha Shelest — 5 min from Ottawa. Back pain, stress & more. Call ${BUSINESS.phone} or message online.`,
      fr: `Réservez un massage à Hull–Gatineau avec Olha Shelest — à 5 min d'Ottawa. Maux de dos, stress et plus. Appelez le ${BUSINESS.phone} ou écrivez-nous.`,
    },
    ogImageAlt: {
      en: 'Contact Olha Shelest — massage therapy in Gatineau, QC',
      fr: 'Contacter Olha Shelest — massothérapie à Gatineau, QC',
    },
  });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });
  const lang: Locale = locale as Locale;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale as Locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lang, [{ name: t('title'), path: `/${locale}/contact` }])) }}
      />
      <PageHeaderSection preTitle={t('preTitle')} title={t('title')} subtitle={t('subtitle')} pb="pb-4 lg:pb-20" />

      {/* Contact content */}
      <section className="bg-off-white py-3 md:py-16 lg:py-28">
        <div className="container-wide">
          <div className="text-center mb-2 lg:mb-14">
            <BotanicalDivider className="w-64 mx-auto text-sage/50" />
          </div>

          <div className="grid lg:grid-cols-2 lg:grid-rows-[auto_auto] gap-16 lg:gap-x-24 lg:gap-y-10 items-start">

            {/* 1 — Form (mobile: first · desktop: right col, row 1) */}
            <div className="order-1 lg:col-start-2 lg:row-start-1 bg-white rounded-lg p-8 lg:p-10 border border-forest/8 shadow-sm relative overflow-hidden">
              <BotanicalCornerBR className="absolute bottom-0 right-0 w-32 h-32 text-pale-sage pointer-events-none" />
              <div className="relative z-10">
                <ContactForm initialType={type ?? ''} />
              </div>
            </div>

            {/* 2 — Contact info (mobile: second · desktop: left col, row 1) */}
            <div className="order-2 lg:col-start-1 lg:row-start-1">
              <h2 className="font-heading text-3xl text-forest font-semibold mb-8">
                {t('infoTitle')}
              </h2>
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-5">
                  <div className="icon-badge">
                    <Phone size={18} className="text-sage" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-forest/40 mb-1">{t('phone')}</p>
                    <a href={`tel:${BUSINESS.phoneTel}`} className="font-medium text-forest text-lg hover:text-sage transition-colors">
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="icon-badge">
                    <Mail size={18} className="text-sage" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-forest/40 mb-1">{t('email')}</p>
                    <a href={`mailto:${BUSINESS.email}`} className="font-medium text-forest text-lg hover:text-sage transition-colors break-all">
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="icon-badge">
                    <MapPin size={18} className="text-sage" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-forest/40 mb-1">{t('address')}</p>
                    <p className="font-medium text-forest text-lg leading-snug">
                      {BUSINESS.address}, {BUSINESS.city}
                    </p>
                    <p className="text-forest/50 text-sm mt-1">
                      {lang === 'en' ? '5 min from downtown Ottawa' : '5 min du centre-ville d\'Ottawa'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 — Opening hours (mobile: third · desktop: left col, row 2) */}
            <div className="order-3 lg:col-start-1 lg:row-start-2 flex items-start gap-5">
              <div className="icon-badge">
                <Clock size={18} className="text-sage" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium tracking-widest uppercase text-forest/40 mb-3">{t('hours')}</p>
                <div className="flex flex-col divide-y divide-forest/6">
                  {BUSINESS.openingHours.map((hour) => (
                    <div key={hour.schemaDay} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <span className="text-forest/70 text-sm">{hour.days[lang]}</span>
                      {hour.open ? (
                        <span className="text-forest font-medium text-sm tabular-nums">{hour.open} – {hour.close}</span>
                      ) : (
                        <span className="text-forest/35 text-sm italic">{t('closed')}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 — Map (mobile: fourth · desktop: right col, row 2) */}
            <div className="order-4 lg:col-start-2 lg:row-start-2 relative w-full h-64 rounded-lg overflow-hidden bg-pale-sage border border-sage/20">
              <iframe
                title={t('mapTitle')}
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                allowFullScreen
                src={BUSINESS.mapsUrl}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
