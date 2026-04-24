import { getTranslations, setRequestLocale } from 'next-intl/server';
import { personJsonLd, breadcrumbJsonLd, type Locale } from '@/lib/jsonld';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Award, Heart, BookOpen } from 'lucide-react';
import { BotanicalCornerTL, BotanicalCornerBR, BotanicalDivider } from '@/components/BotanicalDecor';
import CTASection from '@/components/sections/CTASection';
import PageHeaderSection from '@/components/sections/PageHeaderSection';
import { BUSINESS, SITE } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/about',
    titles: {
      en: 'About Olha Shelest | Professional Massage Therapist, Gatineau',
      fr: 'À propos d\'Olha Shelest | Massothérapeute Professionnelle, Gatineau',
    },
    descriptions: {
      en: 'Meet Olha Shelest, AMQ-registered massage therapist in Hull–Gatineau, QC. Specializing in back pain, stress relief & sports recovery — serving Ottawa & Outaouais.',
      fr: 'Rencontrez Olha Shelest, massothérapeute membre AMQ à Hull–Gatineau, QC. Spécialisée en maux de dos, stress et récupération sportive — service Ottawa et Outaouais.',
    },
    ogImage: SITE.portraitImage,
    ogImageAlt: {
      en: 'Olha Shelest — Professional Massage Therapist',
      fr: 'Olha Shelest — Massothérapeute Professionnelle',
    },
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about.page' });
  const values = t.raw('values') as { title: string; description: string }[];
  const valueIcons = [Heart, BookOpen, Award];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale as Locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(locale as Locale, [{ name: t('title'), path: `/${locale}/about` }])) }}
      />
      <PageHeaderSection preTitle={t('preTitle')} title={t('title')} subtitle={t('subtitle')} />

      {/* Main bio section */}
      <section className="bg-off-white py-10 md:py-16 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-start">
            {/* Photo */}
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-forest/15">
                <Image
                  src={SITE.portraitImage}
                  alt={t('profileAlt')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-sage" />
              </div>
              <div className="absolute -bottom-6 -right-4 bg-white rounded-lg shadow-xl shadow-forest/15 px-6 py-4 border border-pale-sage">
                <a href={BUSINESS.amqUrl} target="_blank" rel="noopener noreferrer" className="text-forest font-heading font-semibold text-sm hover:text-sage transition-colors">{t('amqTitle')}</a>
              </div>
              <BotanicalCornerTL className="absolute -top-4 -left-4 w-24 h-24 text-sage/40" />
            </div>

            {/* Bio text */}
            <div className="flex flex-col gap-6 pt-4">
              <BotanicalDivider className="w-56 text-sage/40 mb-2" />
              <p className="text-forest/80 text-lg leading-relaxed">{t('bio1')}</p>
              <p className="text-forest/70 text-base leading-relaxed">{t('bio2')}</p>
              <p className="text-forest/70 text-base leading-relaxed">{t('bio3')}</p>
              <p className="text-forest/70 text-base leading-relaxed">{t('bio4')}</p>

              {/* AMQ badge */}
              <div className="mt-4 p-6 bg-pale-sage rounded-lg border border-sage/20 relative overflow-hidden">
                <BotanicalCornerBR className="absolute bottom-0 right-0 w-20 h-20 text-sage/20 pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                  <Award size={24} className="text-sage mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-heading text-forest font-semibold text-lg mb-2">
                      {t('amqTitle')}
                    </h3>
                    <p className="text-forest/65 text-sm leading-relaxed mb-4">{t('amqText')}</p>
                    <Link
                      href={BUSINESS.amqUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sage hover:text-forest text-sm font-medium tracking-wide transition-colors"
                    >
                      {t('amqLink')}
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Approach section */}
      <section className="bg-pale-sage py-10 md:py-16 lg:py-28 relative overflow-hidden">
        <BotanicalCornerTL className="absolute top-0 left-0 w-40 h-40 text-sage/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-4 lg:mb-14">
            <h2 className="font-heading text-4xl lg:text-5xl text-forest font-semibold mb-4">
              {t('valuesTitle')}
            </h2>
            <BotanicalDivider className="w-48 lg:w-64 mx-auto text-sage/50 mt-2 lg:mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <div key={i} className="bg-white rounded-lg p-8 border border-forest/8 shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-full bg-pale-sage flex items-center justify-center">
                    <Icon size={22} className="text-sage" />
                  </div>
                  <h3 className="font-heading text-forest text-xl font-semibold">{value.title}</h3>
                  <p className="text-forest/60 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
