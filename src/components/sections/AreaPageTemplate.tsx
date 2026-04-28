import Link from 'next/link';
import { SERVICES } from '@/lib/config';
import PageHeaderSection from '@/components/sections/PageHeaderSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import { BotanicalDivider } from '@/components/BotanicalDecor';

type FAQItem = { question: string; answer: string };

type Props = {
  locale: string;
  preTitle: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  gettingHereTitle: string;
  gettingHereBody: string;
  servicesTitle: string;
  faqPreTitle: string;
  faqTitle: string;
  faqItems: FAQItem[];
};

export default function AreaPageTemplate({
  locale,
  preTitle,
  title,
  subtitle,
  paragraphs,
  gettingHereTitle,
  gettingHereBody,
  servicesTitle,
  faqPreTitle,
  faqTitle,
  faqItems,
}: Props) {
  return (
    <>
      <PageHeaderSection preTitle={preTitle} title={title} subtitle={subtitle} pb="pb-8 lg:pb-20" />

      <section className="bg-off-white py-10 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* Intro paragraphs */}
          <div className="prose prose-stone max-w-none mb-10 lg:mb-14">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-forest/75 leading-relaxed mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          <BotanicalDivider className="w-40 text-sage/30 mb-10 lg:mb-14" />

          {/* Getting Here */}
          <div className="mb-10 lg:mb-14">
            <h2 className="font-heading text-2xl lg:text-3xl text-forest font-semibold mb-3">
              {gettingHereTitle}
            </h2>
            <p className="text-forest/75 leading-relaxed">{gettingHereBody}</p>
          </div>

          <BotanicalDivider className="w-40 text-sage/30 mb-10 lg:mb-14" />

          {/* Services list */}
          <div>
            <h2 className="font-heading text-2xl lg:text-3xl text-forest font-semibold mb-6">
              {servicesTitle}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((service) => (
                <li key={service.key}>
                  <Link
                    href={`/${locale}/services#${service.key}`}
                    className="flex items-center gap-2 text-sage hover:text-forest text-sm font-medium tracking-wide transition-colors group"
                  >
                    <span className="size-1.5 rounded-full bg-sage group-hover:bg-forest transition-colors shrink-0" />
                    {service.title[locale as 'en' | 'fr']}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <FAQSection preTitle={faqPreTitle} title={faqTitle} items={faqItems} />

      <CTASection />
    </>
  );
}
