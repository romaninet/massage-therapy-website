export const SITE = {
  url: 'https://www.shelestwellness.ca',
  ogImage: '/images/image1.jpg',
  portraitImage: '/images/olya-pic.jpg',
} as const;

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

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
} as const;
