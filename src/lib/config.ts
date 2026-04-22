export const SITE = {
  url: 'https://www.shelestwellness.ca',
  lastUpdated: new Date('2026-04-22'),
  heroImage: '/images/image1.jpg',
  heroBgImage: '/images/image1.jpg',
  ogImage: '/images/media-opengraph.jpg',
  portraitImage: '/images/olya-pic.jpg',
  siteNames: {
    en: 'Olha Shelest — Massage Therapy Gatineau',
    fr: 'Olha Shelest — Massothérapie Gatineau',
  },
  description: 'Professional Massage Therapist in Gatineau, QC',
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
  { key: 'fees', href: '/fees' },
  { key: 'contact', href: '/contact' },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]['key'];

export const BUSINESS = {
  name: 'Olha Shelest',
  email: 'massage@shelestwellness.ca',
  phone: '(819) 815-5603',
  phoneTel: '+18198155603',
  address: '148 Rue Eddy',
  city: 'Gatineau, QC J8X 2W8',
  cityName: 'Gatineau',
  province: 'QC',
  postalCode: 'J8X 2W8',
  country: 'CA',
  amqNumber: 'M-24-4471',
  amqUrl: 'https://membres.rmqmasso.ca/en/find-member/details/M-24-4471',
  mapsUrl: 'https://maps.google.com/maps?q=148+Rue+Eddy,+Gatineau,+QC+J8X+2W8&output=embed',
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
