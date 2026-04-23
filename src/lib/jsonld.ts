import { BUSINESS, SERVICES, SITE } from './config';

export type Locale = 'en' | 'fr';

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: BUSINESS.address,
  addressLocality: BUSINESS.cityName,
  addressRegion: BUSINESS.province,
  postalCode: BUSINESS.postalCode,
  addressCountry: BUSINESS.country,
};

const locationPlace = {
  '@type': 'Place',
  name: `${BUSINESS.neighborhood}, ${BUSINESS.cityName}`,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.geo.latitude,
    longitude: BUSINESS.geo.longitude,
  },
};

const businessEntity = {
  '@type': 'HealthAndBeautyBusiness',
  '@id': SITE.url,
  name: BUSINESS.name,
  url: SITE.url,
  description: `Professional Massage Therapist in Gatineau, QC — serving Gatineau and Ottawa in the National Capital Region. Offering ${SERVICES.map((s) => s.title.en).join(', ')}. AMQ registered member.`,
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
  openingHours: BUSINESS.openingHours
    .filter((h) => h.open !== null)
    .map((h) => `${h.schemaDay} ${h.open}-${h.close}`),
  areaServed: [
    { '@type': 'City', name: 'Gatineau' },
    { '@type': 'City', name: 'Ottawa' },
    { '@type': 'AdministrativeArea', name: 'Outaouais' },
    { '@type': 'AdministrativeArea', name: 'National Capital Region' },
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
  location: locationPlace,
  sameAs: [BUSINESS.amqUrl],
};

export function localBusinessJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    ...businessEntity,
    url: `${SITE.url}/${locale}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'fr' ? 'Services de massothérapie' : 'Massage Therapy Services',
      url: `${SITE.url}/${locale}/services`,
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.title[locale],
            url: `${SITE.url}/${locale}/services#${s.key}`,
          },
        },
      })),
    },
  };
}

export function personJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
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
      name: 'Association des Massothérapeutes du Québec (AMQ)',
      url: BUSINESS.amqUrl,
    },
  };
}

export function servicesPageJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'fr' ? 'Services de massothérapie' : 'Massage Therapy Services',
    url: `${SITE.url}/${locale}/services`,
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title[locale],
        description: s.description[locale],
        url: `${SITE.url}/${locale}/services#${s.key}`,
        areaServed: [
          { '@type': 'City', name: 'Gatineau' },
          { '@type': 'City', name: 'Ottawa' },
        ],
        provider: {
          '@type': 'HealthAndBeautyBusiness',
          '@id': SITE.url,
          name: BUSINESS.name,
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'CAD',
          lowPrice: Math.min(...s.tiers.map((t) => t.price)),
          highPrice: Math.max(...s.tiers.map((t) => t.price)),
        },
      },
    })),
  };
}

export function servicesJsonLd(
  services: { name: string; duration: string; price: string }[],
  locale: Locale
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
