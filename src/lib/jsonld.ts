import { BUSINESS, SITE } from './config';

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: BUSINESS.address,
  addressLocality: BUSINESS.cityName,
  addressRegion: BUSINESS.province,
  postalCode: BUSINESS.postalCode,
  addressCountry: BUSINESS.country,
};

const businessEntity = {
  '@type': 'HealthAndBeautyBusiness',
  '@id': SITE.url,
  name: BUSINESS.name,
  url: SITE.url,
  description: 'Professional Massage Therapist in Gatineau, QC offering Swedish, deep tissue, relaxation and prenatal massage. AMQ registered member.',
  telephone: BUSINESS.phoneTel,
  email: BUSINESS.email,
  address: postalAddress,
  image: `${SITE.url}${SITE.portraitImage}`,
  hasMap: BUSINESS.mapsUrl.replace('&output=embed', ''),
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.geo.latitude,
    longitude: BUSINESS.geo.longitude,
  },
  openingHours: BUSINESS.openingHours,
  areaServed: [
    { '@type': 'City', name: 'Gatineau' },
    { '@type': 'AdministrativeArea', name: 'Outaouais' },
  ],
  priceRange: '$$',
  currenciesAccepted: 'CAD',
  paymentAccepted: BUSINESS.paymentAccepted.join(', '),
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: BUSINESS.phoneTel,
    email: BUSINESS.email,
    contactType: 'customer service',
    availableLanguage: ['English', 'French'],
  },
  sameAs: [BUSINESS.amqUrl],
};

export function localBusinessJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    ...businessEntity,
    url: `${SITE.url}/${locale}`,
  };
}

export function personJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: BUSINESS.name,
    jobTitle: locale === 'fr' ? 'Massothérapeute Professionnelle' : 'Professional Massage Therapist',
    url: `${SITE.url}/${locale}/about`,
    image: `${SITE.url}${SITE.portraitImage}`,
    worksFor: {
      '@type': 'HealthAndBeautyBusiness',
      '@id': SITE.url,
      name: BUSINESS.name,
    },
    memberOf: {
      '@type': 'Organization',
      name: 'Association de Massothérapie du Québec (AMQ)',
      url: BUSINESS.amqUrl,
    },
  };
}

export function servicesJsonLd(
  services: { name: string; duration: string; price: string }[],
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'fr' ? 'Services de massothérapie' : 'Massage Therapy Services',
    url: `${SITE.url}/${locale}/fees`,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Offer',
        name: s.name,
        description: s.duration,
        price: s.price.replace(/[^0-9]/g, ''),
        priceCurrency: 'CAD',
        seller: {
          '@type': 'HealthAndBeautyBusiness',
          name: BUSINESS.name,
        },
      },
    })),
  };
}
