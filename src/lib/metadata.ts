import type { Metadata } from 'next';
import { SITE, absoluteUrl } from './config';

interface PageMetadataOptions {
  locale: string;
  path: string;
  titles: { en: string; fr: string };
  descriptions: { en: string; fr: string };
  ogImage?: string;
  ogImageAlt?: { en: string; fr: string };
}

const defaultOgAlt = {
  en: 'Olha Shelest — Massage Therapy Gatineau',
  fr: 'Olha Shelest — Massothérapie Gatineau',
};

export function generatePageMetadata({
  locale,
  path,
  titles,
  descriptions,
  ogImage,
  ogImageAlt,
}: PageMetadataOptions): Metadata {
  const isEn = locale === 'en';
  const image = ogImage ?? SITE.ogImage;
  const alt = ogImageAlt ?? defaultOgAlt;
  const fullPath = `/${locale}${path}`;
  const enPath = `/en${path}`;
  const frPath = `/fr${path}`;

  return {
    title: { absolute: isEn ? titles.en : titles.fr },
    description: isEn ? descriptions.en : descriptions.fr,
    alternates: {
      canonical: absoluteUrl(fullPath),
      languages: {
        en: absoluteUrl(enPath),
        fr: absoluteUrl(frPath),
        'x-default': absoluteUrl(enPath),
      },
    },
    openGraph: {
      type: 'website',
      siteName: isEn ? SITE.siteNames.en : SITE.siteNames.fr,
      locale: isEn ? 'en_CA' : 'fr_CA',
      alternateLocale: isEn ? ['fr_CA'] : ['en_CA'],
      url: absoluteUrl(fullPath),
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: isEn ? alt.en : alt.fr }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [absoluteUrl(image)],
    },
  };
}
