import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  async redirects() {
    // Permanent 301 redirects for locale-less paths Google may probe.
    // These run before middleware, ensuring 301 instead of next-intl's 307.
    const localeRedirects = [
      '',
      '/about',
      '/services',
      '/fees',
      '/articles',
      '/contact',
      '/booking',
      '/privacy-policy',
      '/massage-hull',
      '/massage-ottawa',
      '/massage-aylmer',
      '/massage-outaouais',
    ].map((path) => ({
      source: path === '' ? '/' : path,
      destination: `/en${path}`,
      permanent: true,
    }));

    return [
      {
        source: '/reviews',
        destination: 'https://g.page/r/CbPuh1aQPQQdEAI/review',
        permanent: true,
      },
      // Article slugs wildcard
      {
        source: '/articles/:slug',
        destination: '/en/articles/:slug',
        permanent: true,
      },
      ...localeRedirects,
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
