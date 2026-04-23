import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE, absoluteUrl } from '@/lib/config';
import { localBusinessJsonLd, type Locale } from '@/lib/jsonld';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutPreviewSection from '@/components/sections/AboutPreviewSection';
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
        ? 'Massage Therapy in Gatineau | Olha Shelest — Serving Ottawa & the NCR'
        : 'Massothérapie à Gatineau | Olha Shelest — Au service d\'Ottawa et de la RCN',
    },
    description: isEn
      ? 'Professional Massage Therapist in Gatineau, QC — serving the Ottawa–Gatineau region. Swedish, deep tissue, relaxation & children\'s massage. Book with Olha Shelest — AMQ member.'
      : 'Massothérapeute Professionnelle à Gatineau, QC — au service de la région Ottawa–Gatineau. Massages suédois, en profondeur, de relaxation et pour enfants. Réservez avec Olha Shelest — membre AMQ.',
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: { en: absoluteUrl('/en'), fr: absoluteUrl('/fr'), 'x-default': absoluteUrl('/en') },
    },
    openGraph: {
      type: 'website',
      siteName: isEn ? SITE.siteNames.en : SITE.siteNames.fr,
      locale: isEn ? 'en_CA' : 'fr_CA',
      alternateLocale: isEn ? ['fr_CA'] : ['en_CA'],
      url: absoluteUrl(`/${locale}`),
      images: [
        {
          url: absoluteUrl(SITE.ogImage),
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Professional massage therapy in Gatineau, QC'
            : 'Massothérapie professionnelle à Gatineau, QC',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [absoluteUrl(SITE.ogImage)],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale as Locale)) }}
      />
      <HeroSection />
      <ServicesSection />
      <AboutPreviewSection />
      <CTASection />
    </>
  );
}
