import { setRequestLocale } from 'next-intl/server';
import { localBusinessJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutPreviewSection from '@/components/sections/AboutPreviewSection';
import CTASection from '@/components/sections/CTASection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '',
    titles: {
      en: 'Massage Therapy in Hull–Gatineau | Olha Shelest — Ottawa & Outaouais',
      fr: 'Massothérapie à Hull–Gatineau | Olha Shelest — Ottawa et Outaouais',
    },
    descriptions: {
      en: 'Massage therapist in Hull–Gatineau, QC — serving Ottawa & the Outaouais. Back pain, stress relief & sports recovery. Book with Olha Shelest, AMQ member.',
      fr: 'Massothérapeute à Hull–Gatineau, QC — au service d\'Ottawa et de l\'Outaouais. Maux de dos, stress et récupération sportive. Réservez avec Olha Shelest, membre AMQ.',
    },
    ogImageAlt: {
      en: 'Professional massage therapy in Gatineau, QC',
      fr: 'Massothérapie professionnelle à Gatineau, QC',
    },
  });
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
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
