import { BUSINESS, SERVICES, SITE } from './config';
import { CUSTOMER_FEEDBACK } from './customer-feedback';

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

const DIRECTORY_URLS = [
  BUSINESS.amqUrl,
  BUSINESS.googleMapsUrl,
  'https://www.yelp.ca/biz/olha-shelest-massoth%C3%A9rapeute-gatineau',
  'https://www.cylex-canada.ca/company/olha-shelest--massoth%c3%a9rapeute-25186483.html',
  'https://shelestwellness.setmore.com/',
  'https://www.ratemds.com/clinic/ca-qc-gatineau-olha-shelest/',
  'https://www.yellowpages.ca/bus/Quebec/Gatineau/Olha-Shelest/105279173.html',
];

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
  hasMap: BUSINESS.googleMapsUrl,
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
  sameAs: DIRECTORY_URLS,
};

export function localBusinessJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    ...businessEntity,
    url: `${SITE.url}/${locale}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: CUSTOMER_FEEDBACK.reduce((sum, r) => sum + r.rating, 0) / CUSTOMER_FEEDBACK.length,
      bestRating: 5,
      reviewCount: CUSTOMER_FEEDBACK.length,
    },
    review: CUSTOMER_FEEDBACK.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewBody: r.quote[locale],
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
    })),
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
  const isFr = locale === 'fr';
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: BUSINESS.name,
    jobTitle: isFr ? 'Massothérapeute Professionnelle' : 'Professional Massage Therapist',
    url: `${SITE.url}/${locale}/about`,
    image: `${SITE.url}${SITE.portraitImage}`,
    sameAs: DIRECTORY_URLS,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: isFr ? 'Massothérapeute Professionnelle' : 'Registered Massage Therapist',
      credentialCategory: isFr ? 'Certification professionnelle' : 'Professional Certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Association des Massothérapeutes du Québec (AMQ)',
        url: BUSINESS.amqUrl,
      },
    },
    knowsAbout: isFr
      ? ['Massage thérapeutique', 'Massage en profondeur', 'Massage de relaxation', 'Drainage lymphatique',
         'Massage pour enfants', 'Massage en duo', 'Récupération sportive', 'Gestion du stress',
         'Guérison holistique', 'Thérapie des tissus mous']
      : ['Therapeutic massage', 'Deep tissue massage', 'Relaxation massage', 'Lymphatic drainage',
         "Children's massage", 'Couples massage', 'Sports recovery', 'Stress management',
         'Holistic healing', 'Soft tissue therapy'],
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

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  trail: { name: string; path: string }[]
) {
  const homeLabel = locale === 'fr' ? 'Accueil' : 'Home';
  const items = [
    { name: homeLabel, path: `/${locale}` },
    ...trail,
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
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
