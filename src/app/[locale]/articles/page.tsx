import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { breadcrumbJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import { ARTICLES } from '@/lib/config';
import { BotanicalDivider } from '@/components/BotanicalDecor';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/articles',
    titles: {
      en: 'Massage Therapy Articles & Guides | Olha Shelest — Gatineau',
      fr: 'Articles & Guides sur la Massothérapie | Olha Shelest — Gatineau',
    },
    descriptions: {
      en: 'Expert articles on massage therapy, sports recovery, and wellness in Gatineau. Written by Olha Shelest, AMQ-registered massage therapist.',
      fr: "Articles d'experts sur la massothérapie, la récupération sportive et le bien-être à Gatineau. Rédigés par Olha Shelest, massothérapeute agréée membre de l'AMQ.",
    },
  });
}

export default async function ArticlesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'articles' });

  const articles = ARTICLES.map((a) => ({
    ...a,
    title: t(`${a.slug}.title`),
    excerpt: t(`${a.slug}.excerpt`),
    heroImageAlt: t(`${a.slug}.heroImageAlt`),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(lang, [{ name: t('index.title'), path: `/${locale}/articles` }])
          ),
        }}
      />

      <main>
        {/* Header */}
        <section className="bg-forest text-white pt-28 pb-10 lg:pb-16 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
            <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-4">
              {t('index.preTitle')}
            </p>
            <h1 className="font-heading text-3xl lg:text-5xl font-semibold mb-4">
              {t('index.title')}
            </h1>
            <p className="text-white/60 text-base lg:text-lg max-w-xl">
              {t('index.subtitle')}
            </p>
          </div>
        </section>

        {/* Article list */}
        <section className="bg-off-white py-12 lg:py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <BotanicalDivider className="w-40 text-sage/30 mb-10 lg:mb-14" />

            <div className="grid gap-10 lg:gap-14">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="grid md:grid-cols-[280px_1fr] gap-6 lg:gap-10 group"
                >
                  <Link
                    href={`/${locale}/articles/${article.slug}`}
                    className="relative aspect-[4/3] md:aspect-auto overflow-hidden rounded bg-pale-sage block"
                  >
                    <Image
                      src={article.heroImage}
                      alt={article.heroImageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 280px"
                    />
                  </Link>

                  <div className="flex flex-col justify-center">
                    <time
                      dateTime={article.datePublished}
                      className="text-xs text-sage/70 tracking-widest uppercase mb-3"
                    >
                      {new Date(article.datePublished).toLocaleDateString(
                        locale === 'fr' ? 'fr-CA' : 'en-CA',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </time>
                    <h2 className="font-heading text-xl lg:text-2xl text-forest font-semibold mb-3 leading-snug">
                      <Link
                        href={`/${locale}/articles/${article.slug}`}
                        className="hover:text-sage transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-forest/65 text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <Link
                      href={`/${locale}/articles/${article.slug}`}
                      className="text-sage hover:text-forest text-sm font-medium transition-colors self-start"
                    >
                      {t('index.readMore')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
