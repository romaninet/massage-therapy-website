import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutPreviewSection from '@/components/sections/AboutPreviewSection';
import CTASection from '@/components/sections/CTASection';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutPreviewSection />
      <CTASection />
    </>
  );
}
