import type { MetadataRoute } from 'next';
import { BUSINESS, SITE } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS.name,
    short_name: 'Olha Shelest',
    description: SITE.description,
    start_url: '/en',
    display: 'standalone',
    background_color: '#FAF9F5',
    theme_color: '#2D6A4F',
    icons: [
      {
        src: '/images/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
