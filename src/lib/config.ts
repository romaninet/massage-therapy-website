export const SITE = {
  url: 'https://www.shelestwellness.ca',
  lastUpdated: new Date('2026-04-23'),
  heroBgImage: '/images/image1.jpg',
  ogImage: '/images/media-opengraph.jpg',
  portraitImage: '/images/olya-pic.jpg',
  aboutPreviewImage: {
    src: '/images/image2b.jpg',
    alt: {
      en: 'Olha Shelest, massage therapist in Gatineau',
      fr: 'Olha Shelest, massothérapeute à Gatineau',
    },
  },
  siteNames: {
    en: 'Olha Shelest — Massage Therapy Gatineau–Ottawa',
    fr: 'Olha Shelest — Massothérapie Gatineau–Ottawa',
  },
  description: 'Professional Massage Therapist in Gatineau, QC — serving Ottawa–Gatineau',
} as const;

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export const SERVICES = [
  {
    key: 'swedish',
    title: { en: 'Swedish Massage', fr: 'Massage suédois' },
    description: {
      en: 'A gentle, flowing full-body massage that promotes circulation, eases muscle tension, and induces deep, restorative relaxation.',
      fr: 'Un massage doux et fluide de tout le corps qui favorise la circulation, soulage les tensions musculaires et induit une relaxation profonde et réparatrice.',
    },
    image: {
      src: '/images/service-swedish.jpg',
      alt: {
        en: 'Swedish massage therapy session in Gatineau',
        fr: 'Séance de massage suédois à Gatineau',
      },
    },
    tiers: [
      { duration: '45 min', price: 95 },
      { duration: '60 min', price: 120 },
      { duration: '90 min', price: 165 },
    ],
  },
  {
    key: 'deepTissue',
    title: { en: 'Deep Tissue Massage', fr: 'Massage en profondeur' },
    description: {
      en: 'Targeting deeper layers of muscle and connective tissue to release chronic tension, address pain patterns, and restore mobility.',
      fr: 'Ciblant les couches profondes des muscles et des tissus conjonctifs pour relâcher les tensions chroniques, traiter les douleurs et restaurer la mobilité.',
    },
    image: {
      src: '/images/service-deep-tissue.jpg',
      alt: {
        en: 'Deep tissue massage therapy in Gatineau',
        fr: 'Massage en profondeur à Gatineau',
      },
    },
    tiers: [
      { duration: '45 min', price: 95 },
      { duration: '60 min', price: 120 },
      { duration: '90 min', price: 165 },
    ],
  },
  {
    key: 'relaxation',
    title: { en: 'Relaxation Massage', fr: 'Massage de relaxation' },
    description: {
      en: 'A calming, nurturing treatment designed to soothe the nervous system, quiet the mind, and melt away the stress of everyday life.',
      fr: 'Un soin apaisant et bienveillant conçu pour calmer le système nerveux, apaiser l\'esprit et faire fondre le stress du quotidien.',
    },
    image: {
      src: '/images/service-relaxation.jpg',
      alt: {
        en: 'Relaxation massage session in Gatineau',
        fr: 'Séance de massage de relaxation à Gatineau',
      },
    },
    tiers: [
      { duration: '45 min', price: 95 },
      { duration: '60 min', price: 120 },
      { duration: '90 min', price: 165 },
    ],
  },
  {
    key: 'children',
    title: { en: "Children's Massage", fr: 'Massage pour enfants' },
    description: {
      en: "Our kids deserve attentive care from the very start. Massage for kids as young as a few months old, my sessions are designed to be fun, safe, and relaxing — using gentle, age-appropriate techniques to ease tension, support restful sleep, and nurture healthy development.",
      fr: "Nos enfants méritent des soins attentifs dès le plus jeune âge. Le massage pour enfants dès quelques mois, mes séances sont conçues pour être agréables, sécuritaires et relaxantes — avec des techniques douces et adaptées pour soulager les tensions, favoriser le sommeil et accompagner un développement sain.",
    },
    image: {
      src: '/images/service-children.jpg',
      alt: {
        en: "Children's massage therapy session in Gatineau",
        fr: 'Séance de massage pour enfants à Gatineau',
      },
    },
    tiers: [
      { duration: '45 min', price: 95 },
      { duration: '60 min', price: 120 },
      { duration: '90 min', price: 165 },
    ],
  },
] as const;

export type ServiceKey = (typeof SERVICES)[number]['key'];

export const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'fees', href: '/fees' },
  { key: 'contact', href: '/contact' },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]['key'];

export const BUSINESS = {
  name: 'Olha Shelest',
  email: 'massage@shelestwellness.ca',
  phone: '(819) 815-5603',
  phoneTel: '+18198155603',
  address: '148 Rue Eddy, Unit 2',
  city: 'Gatineau, QC J8X 2W8',
  cityName: 'Gatineau',
  neighborhood: 'Hull',
  province: 'QC',
  postalCode: 'J8X 2W8',
  country: 'CA',
  amqNumber: 'M-24-4471',
  amqUrl: 'https://membres.rmqmasso.ca/en/find-member/details/M-24-4471',
  placeId: 'ChIJdWEcfCQFzkwRs-6HVpA9BB0',
  googleMapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJdWEcfCQFzkwRs-6HVpA9BB0',
  mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.9763869298104!2d-75.72264832380549!3d45.42997733572155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce05247c1c6175%3A0x1d043d905687eeb3!2sOlha%20Shelest!5e0!3m2!1sen!2sca!4v1776975313510!5m2!1sen!2sca',
  paymentAccepted: ['Cash', 'Interac e-Transfer'],
  openingHours: [
    { days: { en: 'Monday',    fr: 'Lundi'    }, schemaDay: 'Mo', open: '17:00', close: '20:00' },
    { days: { en: 'Tuesday',   fr: 'Mardi'    }, schemaDay: 'Tu', open: '17:00', close: '20:00' },
    { days: { en: 'Wednesday', fr: 'Mercredi' }, schemaDay: 'We', open: '17:00', close: '20:00' },
    { days: { en: 'Thursday',  fr: 'Jeudi'    }, schemaDay: 'Th', open: '17:00', close: '20:00' },
    { days: { en: 'Friday',    fr: 'Vendredi' }, schemaDay: 'Fr', open: '17:00', close: '20:00' },
    { days: { en: 'Saturday',  fr: 'Samedi'   }, schemaDay: 'Sa', open: null,    close: null    },
    { days: { en: 'Sunday',    fr: 'Dimanche' }, schemaDay: 'Su', open: null,    close: null    },
  ],
  geo: { latitude: 45.42998533558253, longitude: -75.72007407363735 },
} as const;
