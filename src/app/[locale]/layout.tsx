import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/config';
import { playfair, dmSans, geistMono } from '@/lib/fonts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: {
      template: '%s | Olha Shelest',
      default: isEn
        ? 'Massage Therapy in Gatineau | Olha Shelest, Professional Massage Therapist, Gatineau'
        : 'Massothérapie à Gatineau | Olha Shelest, Massothérapeute Professionnelle, membre de l\'AMQ',
    },
    openGraph: {
      type: 'website',
      siteName: isEn
        ? 'Olha Shelest — Massage Therapy Gatineau'
        : 'Olha Shelest — Massothérapie Gatineau',
      locale: isEn ? 'en_CA' : 'fr_CA',
      images: [
        {
          url: SITE.ogImage,
          alt: isEn
            ? 'Professional massage therapy in Gatineau, QC'
            : 'Massothérapie professionnelle à Gatineau, QC',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${dmSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
