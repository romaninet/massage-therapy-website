export const SITE = {
  url: 'https://www.shelestwellness.ca',
  lastUpdated: new Date('2026-04-25'),
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
    key: 'therapeutic',
    title: { en: 'Therapeutic Massage', fr: 'Massage thérapeutique' },
    description: {
      en: 'A clinical, goal-oriented massage that combines targeted techniques to address specific conditions, reduce pain, restore function, and support your body\'s natural healing process.',
      fr: 'Un massage clinique et ciblé qui combine des techniques variées pour traiter des conditions spécifiques, réduire la douleur, restaurer la fonction et soutenir le processus naturel de guérison du corps.',
    },
    image: {
      src: '/images/service-therapeutic.jpg',
      alt: {
        en: 'Therapeutic massage session in Gatineau',
        fr: 'Séance de massage thérapeutique à Gatineau',
      },
    },
    tiers: [
      { duration: '60 min', price: 110 },
      { duration: '90 min', price: 150 },
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
      { duration: '60 min', price: 110 },
      { duration: '90 min', price: 150 },
    ],
  },
  {
    key: 'lymphatic',
    title: { en: 'Lymphatic Drainage', fr: 'Drainage lymphatique' },
    description: {
      en: 'A gentle, rhythmic technique that stimulates the lymphatic system to reduce swelling, clear toxins, and restore the body\'s natural fluid balance and immune function.',
      fr: 'Une technique douce et rythmique qui stimule le système lymphatique pour réduire les œdèmes, éliminer les toxines et restaurer l\'équilibre hydrique naturel et la fonction immunitaire du corps.',
    },
    image: {
      src: '/images/service-lymphatic.jpg',
      alt: {
        en: 'Lymphatic drainage massage session in Gatineau',
        fr: 'Séance de drainage lymphatique à Gatineau',
      },
    },
    tiers: [
      { duration: '60 min', price: 110 },
      { duration: '90 min', price: 150 },
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
      { duration: '30 min', price: 50 },
      { duration: '60 min', price: 80 }
    ],
  },
  {
    key: 'couples',
    title: { en: 'Couples Massage', fr: 'Massage en duo' },
    description: {
      en: 'A shared massage experience for two, where both partners enjoy a personalized treatment side by side — a meaningful way to connect and decompress together.',
      fr: 'Une expérience de massage partagée pour deux personnes, où les deux partenaires profitent d\'un soin personnalisé côte à côte — une façon significative de se reconnecter et de se ressourcer ensemble.',
    },
    image: {
      src: '/images/service-couples.jpg',
      alt: {
        en: 'Couples massage session in Gatineau',
        fr: 'Séance de massage en duo à Gatineau',
      },
    },
    tiers: [
      { duration: '60 min', price: 220 },
      { duration: '90 min', price: 300 },
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
    { days: { en: 'Monday',    fr: 'Lundi'    }, schemaDay: 'Mo', open: '15:00', close: '20:00' },
    { days: { en: 'Tuesday',   fr: 'Mardi'    }, schemaDay: 'Tu', open: '15:00', close: '20:00' },
    { days: { en: 'Wednesday', fr: 'Mercredi' }, schemaDay: 'We', open: '15:00', close: '20:00' },
    { days: { en: 'Thursday',  fr: 'Jeudi'    }, schemaDay: 'Th', open: '15:00', close: '20:00' },
    { days: { en: 'Friday',    fr: 'Vendredi' }, schemaDay: 'Fr', open: '15:00', close: '20:00' },
    { days: { en: 'Saturday',  fr: 'Samedi'   }, schemaDay: 'Sa', open: null,    close: null    },
    { days: { en: 'Sunday',    fr: 'Dimanche' }, schemaDay: 'Su', open: null,    close: null    },
  ],
  geo: { latitude: 45.42998533558253, longitude: -75.72007407363735 },
} as const;
