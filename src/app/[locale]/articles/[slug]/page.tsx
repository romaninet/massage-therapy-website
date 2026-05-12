import { notFound } from 'next/navigation';
import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, howToJsonLd, type Locale } from '@/lib/jsonld';
import { generatePageMetadata } from '@/lib/metadata';
import { ARTICLES, SITE } from '@/lib/config';
import ArticleTemplate from '@/components/sections/ArticleTemplate';

export async function generateStaticParams() {
  return ARTICLES.flatMap((a) => [
    { locale: 'en', slug: a.slug },
    { locale: 'fr', slug: a.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  const t = await getTranslations({ locale, namespace: 'articles' });

  const base = generatePageMetadata({
    locale,
    path: `/articles/${slug}`,
    titles: {
      en: `${t(`${slug}.title`)} | Olha Shelest — Gatineau`,
      fr: `${t(`${slug}.title`)} | Olha Shelest — Gatineau`,
    },
    descriptions: {
      en: t(`${slug}.excerpt`),
      fr: t(`${slug}.excerpt`),
    },
    ogImage: article.heroImage,
    ogImageAlt: {
      en: t(`${slug}.heroImageAlt`),
      fr: t(`${slug}.heroImageAlt`),
    },
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: article.datePublished,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;

  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: 'articles' });
  const messages = await getMessages({ locale })

  const sections = t.raw(`${slug}.sections`) as { heading: string; paragraphs: string[] }[];
  const faqItems = t.raw(`${slug}.faq`) as { question: string; answer: string }[];
  const title = t(`${slug}.title`);
  const excerpt = t(`${slug}.excerpt`);
  const articleUrl = `${SITE.url}/${locale}/articles/${slug}`;

  type HowToStep = { name: string; text: string };
  const articleMsgs = (messages.articles as Record<string, Record<string, unknown>>)?.[slug]
  const keywords = Array.isArray(articleMsgs?.keywords) ? articleMsgs.keywords as string[] : undefined
  const howToSteps = Array.isArray(articleMsgs?.howToSteps) ? articleMsgs.howToSteps as HowToStep[] : undefined

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title,
              excerpt,
              datePublished: article.datePublished,
              image: article.heroImage,
              url: articleUrl,
              locale: lang,
              keywords,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(lang, [
              { name: 'Articles', path: `/${locale}/articles` },
              { name: title, path: `/${locale}/articles/${slug}` },
            ])
          ),
        }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
        />
      )}
      {howToSteps && howToSteps.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              howToJsonLd({ name: title, description: excerpt, steps: howToSteps, url: articleUrl })
            ),
          }}
        />
      )}

      <ArticleTemplate
        locale={locale}
        preTitle={t(`${slug}.preTitle`)}
        title={title}
        excerpt={excerpt}
        datePublished={article.datePublished}
        heroImageSrc={article.heroImage}
        heroImageAlt={t(`${slug}.heroImageAlt`)}
        sections={sections}
        faqItems={faqItems}
        ctaText={t(`${slug}.ctaText`)}
        ctaSubtext={t(`${slug}.ctaSubtext`)}
        servicesHref={`/${locale}/services`}
        feesHref={`/${locale}/fees`}
        contactHref={`/${locale}/contact`}
      />
    </>
  );
}
