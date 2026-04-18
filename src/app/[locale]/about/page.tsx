import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { personJsonLd } from '@/lib/jsonld';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Award, Heart, BookOpen } from 'lucide-react';
import { BotanicalCornerTL, BotanicalCornerBR, BotanicalDivider } from '@/components/BotanicalDecor';
import CTASection from '@/components/sections/CTASection';
import { BUSINESS, SITE } from '@/lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn
      ? 'About Olha Shelest | Professional Massage Therapist, Gatineau'
      : 'À propos d\'Olha Shelest | Massothérapeute professionnelle, Gatineau',
    description: isEn
      ? 'Meet Olha Shelest, Professional Massage Therapist and AMQ member based in Gatineau, QC. Personalized therapeutic massage tailored to your needs.'
      : 'Découvrez Olha Shelest, massothérapeute professionnelle et membre AMQ à Gatineau, QC. Des soins thérapeutiques personnalisés adaptés à vos besoins.',
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: '/en/about', fr: '/fr/about', 'x-default': '/en/about' },
    },
    openGraph: {
      url: `/${locale}/about`,
      images: [
        {
          url: SITE.portraitImage,
          alt: isEn
            ? 'Olha Shelest — Professional Massage Therapist'
            : 'Olha Shelest — Massothérapeute professionnelle',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [SITE.portraitImage],
    },
  };
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
      />
      {/* Hero */}
      <section className="bg-forest pt-36 pb-20 relative overflow-hidden">
        <BotanicalCornerTL className="absolute top-0 left-0 w-48 h-48 text-white/10 pointer-events-none" />
        <BotanicalCornerBR className="absolute bottom-0 right-0 w-48 h-48 text-white/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-5">
            {locale === 'en' ? 'Our Therapist' : 'Notre thérapeute'}
          </p>
          <h1 className="font-heading text-5xl lg:text-6xl text-white font-semibold mb-4">
            {t('title')}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Main bio section */}
      <section className="bg-off-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Photo */}
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-forest/15">
                <Image
                  src={SITE.portraitImage}
                  alt="Olha Shelest — Professional Massage Therapist"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-sage" />
              </div>
              <div className="absolute -bottom-6 -right-4 bg-white rounded-lg shadow-xl shadow-forest/15 px-6 py-4 border border-pale-sage">
                <p className="text-forest font-heading font-semibold text-sm">AMQ Registered</p>
                <p className="text-forest/50 text-xs mt-0.5">{BUSINESS.amqNumber}</p>
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
      <section className="bg-pale-sage py-20 lg:py-28 relative overflow-hidden">
        <BotanicalCornerTL className="absolute top-0 left-0 w-40 h-40 text-sage/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl lg:text-5xl text-forest font-semibold mb-4">
              {t('valuesTitle')}
            </h2>
            <BotanicalDivider className="w-64 mx-auto text-sage/50 mt-6" />
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
