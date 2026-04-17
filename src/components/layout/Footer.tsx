import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import { BotanicalCornerTL, BotanicalCornerBR } from '@/components/BotanicalDecor';
import { BUSINESS } from '@/lib/config';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const prefix = `/${locale}`;
  const year = new Date().getFullYear();

  const navLinks = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'fees', href: '/fees' },
    { key: 'contact', href: '/contact' },
  ] as const;

  return (
    <footer className="bg-forest text-white relative overflow-hidden">
      {/* Botanical corner accents */}
      <BotanicalCornerTL className="absolute top-0 left-0 w-40 h-40 text-white/10 pointer-events-none" />
      <BotanicalCornerBR className="absolute bottom-0 right-0 w-40 h-40 text-white/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href={`${prefix}`} className="flex items-center gap-3">
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Massage Therapy Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-white font-semibold tracking-wide">
                  Olha Shelest
                </span>
                <span className="text-white/50 text-xs tracking-widest uppercase">
                  {t('tagline')}
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {t('location')} · {t('amqMember')} {BUSINESS.amqNumber}
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-white/40 font-medium mb-5">
              {t('nav')}
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={`${prefix}${href === '/' ? '' : href}`}
                    className="text-white/70 hover:text-sage-light text-sm tracking-wide transition-colors"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-white/40 font-medium mb-5">
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`tel:${BUSINESS.phoneTel}`}
                  className="flex items-start gap-3 text-white/70 hover:text-sage-light text-sm transition-colors group"
                >
                  <Phone size={15} className="mt-0.5 flex-shrink-0 group-hover:text-sage" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-start gap-3 text-white/70 hover:text-sage-light text-sm transition-colors group"
                >
                  <Mail size={15} className="mt-0.5 flex-shrink-0 group-hover:text-sage" />
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/70 text-sm">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{BUSINESS.address},<br />{BUSINESS.city}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>
            © {year} Olha Shelest · {t('rights')}
          </p>
          <Link
            href={`${prefix}/privacy-policy`}
            className="hover:text-white/60 transition-colors underline underline-offset-4"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
