import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE, absoluteUrl } from '@/lib/config';
import { localBusinessJsonLd } from '@/lib/jsonld';
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
        ? 'Massage Therapy in Gatineau | Olha Shelest, Professional Massage Therapist'
        : 'Massothérapie à Gatineau | Olha Shelest, Massothérapeute Professionnelle',
    },
    description: isEn
      ? 'Professional Massage Therapist in Gatineau, QC. Swedish, deep tissue, relaxation & prenatal massage. Book your session with Olha Shelest — AMQ member.'
      : 'Massothérapeute Professionnelle à Gatineau, QC. Massages suédois, en profondeur, de relaxation et prénatal. Réservez votre séance avec Olha Shelest — membre AMQ.',
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: { en: absoluteUrl('/en'), fr: absoluteUrl('/fr'), 'x-default': absoluteUrl('/en') },
    },
    openGraph: {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale)) }}
      />
      <HeroSection />
      <ServicesSection />
      <AboutPreviewSection />
      <CTASection />
    </>
  );
}
