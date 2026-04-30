import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { BotanicalDivider } from '@/components/BotanicalDecor';
import { SITE } from '@/lib/config';

export default function AboutPreviewSection() {
  const t = useTranslations('about.preview');
  const locale = useLocale();

  return (
    <section className="bg-off-white py-12 md:py-16 lg:py-32 overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          {/* Left: text */}
          <div className="flex flex-col">
            <p className="section-pretitle mb-4">
              {t('preTitle')}
            </p>
            <h2 className="heading-section leading-tight mb-4">
              {t('title')}
            </h2>
            <p className="font-heading text-sage/70 italic text-xl mb-6">{t('subtitle')}</p>
            <BotanicalDivider className="w-56 text-sage/40 mb-8" />
            <p className="text-forest/70 text-lg leading-relaxed mb-10">
              {t('bio')}
            </p>
            <Link
              href={`/${locale}/about`}
              className="self-start inline-flex items-center gap-3 px-8 py-4 bg-forest text-white font-medium tracking-wider uppercase text-sm rounded transition-[background-color,box-shadow,transform] duration-200 hover:bg-forest-dark hover:shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5"
            >
              {t('cta')}
            </Link>
          </div>

          {/* Right: photo */}
          <div className="hidden md:block relative h-full rounded-2xl overflow-hidden">
            <Image
              src={SITE.aboutPreviewImage.src}
              alt={SITE.aboutPreviewImage.alt[locale as 'en' | 'fr']}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
