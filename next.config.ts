import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/reviews',
        destination: 'https://g.page/r/CbPuh1aQPQQdEAI/review',
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
