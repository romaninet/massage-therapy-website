import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(en|fr)/:path*',
    '/((?!_next|_vercel|api|icon|apple-icon|favicon|manifest|robots|sitemap|.*\\..*).*)',
  ],
};
