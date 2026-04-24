import Image from 'next/image';
import Link from 'next/link';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import ServiceIcon from '@/components/ServiceIcon';
import type { SERVICES } from '@/lib/config';
import type { Locale } from '@/lib/jsonld';

interface ServiceCardProps {
  service: (typeof SERVICES)[number];
  index: number;
  locale: string;
  lang: Locale;
  content: {
    longDescription: string;
    benefits: string[];
    whoFor: string;
  };
  labels: {
    benefitsLabel: string;
    whoForLabel: string;
    startingFrom: string;
    bookSession: string;
    seeFullPricing: string;
  };
}

export default function ServiceCard({ service, index, locale, lang, content, labels }: ServiceCardProps) {
  const isReversed = index % 2 === 1;
  const startingPrice = service.tiers[0].price;
  const priceDisplay = lang === 'fr' ? `${startingPrice} $` : `$${startingPrice}`;

  return (
    <section
      id={service.key}
      className={`scroll-mt-24 ${index % 2 === 0 ? 'bg-off-white' : 'bg-pale-sage'} py-12 lg:py-24 relative overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Text column — order flips on desktop for odd indices */}
          <div className={isReversed ? 'lg:order-2' : ''}>
            <div className="text-sage mb-5">
              <ServiceIcon serviceKey={service.key} className="w-12 h-12" />
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl text-forest font-semibold mb-5">
              {service.title[lang]}
            </h2>
            <BotanicalDivider className="w-40 text-sage/40 mb-6" />
            <p className="text-forest/75 text-lg leading-relaxed mb-7">{content.longDescription}</p>

            {/* Benefits */}
            <div className="mb-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
                {labels.benefitsLabel}
              </p>
              <ul className="space-y-2">
                {content.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-forest/65 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0 mt-[7px]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Who it's for */}
            <div className="mb-8 p-4 rounded-lg bg-forest/5 border-l-2 border-sage">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-1">
                {labels.whoForLabel}
              </p>
              <p className="text-forest/65 text-sm leading-relaxed">{content.whoFor}</p>
            </div>

            {/* Price + CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-forest/40 mb-0.5">{labels.startingFrom}</p>
                <p className="font-heading text-forest text-3xl font-semibold">{priceDisplay}</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center ml-2">
                <Link
                  href={`/${locale}/contact?type=${service.key}`}
                  className="px-6 py-3 bg-forest text-white text-sm tracking-wider uppercase font-medium rounded transition-all hover:bg-forest/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-forest/20"
                >
                  {labels.bookSession}
                </Link>
                <Link
                  href={`/${locale}/fees#${service.key}`}
                  className="text-forest/60 text-sm hover:text-forest transition-colors flex items-center gap-1 font-medium"
                >
                  {labels.seeFullPricing} →
                </Link>
              </div>
            </div>
          </div>

          {/* Image — full-width on mobile (above text), side column on desktop */}
          <div className={`relative order-first aspect-[4/3] lg:aspect-[4/5] rounded-lg overflow-hidden shadow-lg lg:shadow-2xl shadow-forest/15 ${isReversed ? 'lg:order-1' : 'lg:order-none'}`}>
            <Image
              src={service.image.src}
              alt={service.image.alt[lang]}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-forest/10" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-sage" />
          </div>

        </div>
      </div>
    </section>
  );
}
