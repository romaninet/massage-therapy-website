import type { MetadataRoute } from 'next';
import { BUSINESS } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS.name,
    short_name: BUSINESS.name,
    description: 'Professional Massage Therapist in Gatineau, QC',
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
