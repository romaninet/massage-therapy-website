import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/config';

const pages = [
  { path: '', changeFrequency: 'monthly' as const, priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/fees', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/contact', changeFrequency: 'yearly' as const, priority: 0.7 },
  { path: '/privacy-policy', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;

  return pages.flatMap(({ path, changeFrequency, priority }) => [
    {
      url: `${base}/en${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${base}/en${path}`,
          fr: `${base}/fr${path}`,
        },
      },
    },
    {
      url: `${base}/fr${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${base}/en${path}`,
          fr: `${base}/fr${path}`,
        },
      },
    },
  ]);
}
