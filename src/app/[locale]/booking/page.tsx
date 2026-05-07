import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { BOOKING } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';
import BookingWizard from './BookingWizard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/booking',
    titles: {
      en: 'Book an Appointment | Olha Shelest Massage Therapy — Gatineau',
      fr: 'Réserver un rendez-vous | Massothérapie Olha Shelest — Gatineau',
    },
    descriptions: {
      en: 'Book your massage appointment online with Olha Shelest in Gatineau, QC. Choose your service, date and time in minutes.',
      fr: 'Réservez votre rendez-vous de massage en ligne avec Olha Shelest à Gatineau, QC. Choisissez votre service, date et heure en quelques minutes.',
    },
    ogImageAlt: {
      en: 'Book a massage appointment — Olha Shelest, Gatineau',
      fr: 'Réserver un rendez-vous de massage — Olha Shelest, Gatineau',
    },
  });
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  if (!BOOKING.showBookingsService) {
    notFound();
  }

  const { locale } = await params;
  const { t } = await searchParams;
  setRequestLocale(locale);

  return (
    <Suspense key={t} fallback={<div className="min-h-screen bg-[#FAF9F5]" />}>
      <BookingWizard locale={locale} />
    </Suspense>
  );
}
