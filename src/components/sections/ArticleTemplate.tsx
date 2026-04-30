import Image from 'next/image';
import Link from 'next/link';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import FAQSection from '@/components/sections/FAQSection';

type Section = { heading: string; paragraphs: string[] };
type FAQItem = { question: string; answer: string };

type Props = {
  locale: string;
  preTitle: string;
  title: string;
  excerpt: string;
  datePublished: string;
  heroImageSrc: string;
  heroImageAlt: string;
  sections: Section[];
  faqItems?: FAQItem[];
  ctaText: string;
  ctaSubtext: string;
  servicesHref: string;
  feesHref: string;
  contactHref: string;
};

export default function ArticleTemplate({
  locale,
  preTitle,
  title,
  excerpt,
  datePublished,
  heroImageSrc,
  heroImageAlt,
  sections,
  faqItems,
  ctaText,
  ctaSubtext,
  servicesHref,
  feesHref,
  contactHref,
}: Props) {
  const formattedDate = new Date(datePublished).toLocaleDateString(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <main>
      {/* Page header — matches About/Fees/Services dark header style */}
      <section className="bg-forest text-white pt-28 pb-8 lg:pb-12 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
          <p className="section-pretitle mb-4">
            {preTitle}
          </p>
          <h1 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight mb-4">
            {title}
          </h1>
          <p className="text-white/50 text-sm">
            <time dateTime={datePublished}>{formattedDate}</time>
            {' · '}Olha Shelest
          </p>
        </div>
      </section>

      {/* Hero image */}
      <div className="relative w-full aspect-[16/7] overflow-hidden bg-pale-sage">
        <Image
          src={heroImageSrc}
          alt={heroImageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Article body */}
      <div className="bg-off-white py-10 lg:py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">

          {/* Excerpt / lead */}
          <p className="text-forest/80 text-lg leading-relaxed mb-10 lg:mb-14 font-light border-l-2 border-sage pl-5">
            {excerpt}
          </p>

          <BotanicalDivider className="w-40 text-sage/30 mb-10 lg:mb-14" />

          {/* Sections */}
          <div className="space-y-10 lg:space-y-14">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heading text-xl lg:text-2xl text-forest font-semibold mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-forest/70 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Internal links row */}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href={servicesHref}
              className="text-sm text-sage hover:text-forest border border-sage/40 hover:border-sage rounded px-4 py-2 transition-colors"
            >
              {locale === 'fr' ? 'Voir tous les services →' : 'View all services →'}
            </Link>
            <Link
              href={feesHref}
              className="text-sm text-sage hover:text-forest border border-sage/40 hover:border-sage rounded px-4 py-2 transition-colors"
            >
              {locale === 'fr' ? 'Voir les tarifs →' : 'See fees & pricing →'}
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      {faqItems && faqItems.length > 0 && (
        <FAQSection
          preTitle="FAQ"
          title={locale === 'fr' ? 'Foire aux questions' : 'Frequently Asked Questions'}
          items={faqItems}
        />
      )}

      {/* CTA */}
      <section className="bg-forest text-white py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
            {ctaSubtext}
          </p>
          <Link
            href={contactHref}
            className="inline-block bg-sage hover:bg-sage/90 text-white font-medium px-8 py-3.5 rounded transition-colors tracking-wide"
          >
            {ctaText}
          </Link>
        </div>
      </section>
    </main>
  );
}
