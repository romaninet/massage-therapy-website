import { setRequestLocale } from 'next-intl/server';
import { localBusinessJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutPreviewSection from '@/components/sections/AboutPreviewSection';
import CTASection from '@/components/sections/CTASection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '',
    titles: {
      en: 'Massage Therapy in Gatineau | Olha Shelest — Serving Ottawa & the NCR',
      fr: 'Massothérapie à Gatineau | Olha Shelest — Au service d\'Ottawa et de la RCN',
    },
    descriptions: {
      en: 'Professional Massage Therapist in Gatineau, QC — serving the Ottawa–Gatineau region. Swedish, deep tissue, relaxation & children\'s massage. Book with Olha Shelest — AMQ member.',
      fr: 'Massothérapeute Professionnelle à Gatineau, QC — au service de la région Ottawa–Gatineau. Massages suédois, en profondeur, de relaxation et pour enfants. Réservez avec Olha Shelest — membre AMQ.',
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
      <CTASection />
    </>
  );
}
