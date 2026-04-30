import type { MetadataRoute } from 'next';
import { SITE, ARTICLES } from '@/lib/config';

const pages = [
  { path: '', changeFrequency: 'monthly' as const, priority: 1.0, lastModified: SITE.lastUpdated },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8, lastModified: SITE.lastUpdated },
  { path: '/services', changeFrequency: 'monthly' as const, priority: 0.9, lastModified: SITE.lastUpdated },
  { path: '/fees', changeFrequency: 'monthly' as const, priority: 0.8, lastModified: SITE.lastUpdated },
  { path: '/articles', changeFrequency: 'weekly' as const, priority: 0.8, lastModified: SITE.lastUpdated },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7, lastModified: SITE.lastUpdated },
  { path: '/privacy-policy', changeFrequency: 'yearly' as const, priority: 0.3, lastModified: SITE.lastUpdated },
  { path: '/massage-hull', changeFrequency: 'monthly' as const, priority: 0.8, lastModified: SITE.lastUpdated },
  { path: '/massage-ottawa', changeFrequency: 'monthly' as const, priority: 0.8, lastModified: SITE.lastUpdated },
  { path: '/massage-aylmer', changeFrequency: 'monthly' as const, priority: 0.7, lastModified: SITE.lastUpdated },
  { path: '/massage-outaouais', changeFrequency: 'monthly' as const, priority: 0.7, lastModified: SITE.lastUpdated },
  ...ARTICLES.map((a) => ({
    path: `/articles/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: new Date(a.datePublished),
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;

  return pages.flatMap(({ path, changeFrequency, priority, lastModified }) => [
    {
      url: `${base}/en${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${base}/en${path}`,
          fr: `${base}/fr${path}`,
          'x-default': `${base}/en${path}`,
        },
      },
    },
    {
      url: `${base}/fr${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${base}/en${path}`,
          fr: `${base}/fr${path}`,
          'x-default': `${base}/en${path}`,
        },
      },
    },
  ]);
}
