'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { NAV_LINKS } from '@/lib/config';

export default function Header() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleMenu = useCallback(() => setMobileOpen((m) => !m), []);

  const prefix = `/${locale}`;
  const isActive = (href: string) => {
    const full = href === '/' ? prefix : `${prefix}${href}`;
    return href === '/' ? pathname === full : pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-forest focus:text-sm focus:font-medium focus:rounded focus:shadow-lg"
      >
        Skip to content
      </a>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
          scrolled
            ? 'bg-forest/95 backdrop-blur-md shadow-lg shadow-forest/20'
            : 'bg-forest'
        }`}
      >
      <div className="container-wide">
        {/* Mobile: 3-col grid [name | logo | controls]. Desktop: flex justify-between */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-24 lg:flex lg:justify-between">

          {/* Mobile: name + subtitle left — hidden on desktop (lives inside logo link there) */}
          <div className="lg:hidden flex flex-col leading-tight">
            <span className="font-heading text-white font-semibold tracking-wide text-sm leading-tight">
              Olha Shelest
            </span>
            <span className="text-white/60 text-[9px] tracking-widest uppercase font-light">
              {tHeader('subtitle')}
            </span>
          </div>

          {/* Logo — centered on mobile, left-anchored on desktop */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group justify-self-center lg:justify-self-auto">
            <div className="w-28 h-28 lg:w-28 lg:h-28 relative flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt={tHeader('logoAlt')}
                fill
                sizes="112px"
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            {/* Name + subtitle — desktop only, inside the link */}
            <div className="hidden lg:flex flex-col leading-tight items-center">
              <span className="font-heading text-white font-semibold tracking-wide text-lg">
                Olha Shelest
              </span>
              <span className="text-white/60 text-[10px] tracking-widest uppercase font-light">
                {tHeader('subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label={t('mainNav')}>
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={`${prefix}${href === '/' ? '' : href}`}
                className={`text-sm tracking-wider uppercase font-medium transition-colors relative group ${
                  isActive(href)
                    ? 'text-sage-light'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {t(key)}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-sage transition-[width] duration-300 ${
                    isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher dark />
            <Link
              href={`${prefix}/contact`}
              className="px-5 py-2.5 border border-white/30 text-white text-sm tracking-wider uppercase font-medium rounded transition-colors hover:bg-white hover:text-forest"
            >
              {t('bookNow')}
            </Link>
          </div>

          {/* Mobile controls — right column */}
          <div className="flex lg:hidden items-center gap-4 justify-self-end">
            <LanguageSwitcher dark />
            <button
              onClick={toggleMenu}
              className="text-white p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-[max-height,opacity] duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-forest-dark border-t border-white/10 px-6 py-6 flex flex-col gap-1" aria-label={t('mobileNav')}>
          {NAV_LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={`${prefix}${href === '/' ? '' : href}`}
              className={`py-3 text-sm tracking-wider uppercase font-medium border-b border-white/10 transition-colors ${
                isActive(href) ? 'text-sage' : 'text-white/80 hover:text-white'
              }`}
            >
              {t(key)}
            </Link>
          ))}
          <Link
            href={`${prefix}/contact`}
            className="mt-4 py-3 text-center border border-white/30 text-white text-sm tracking-wider uppercase font-medium rounded hover:bg-white hover:text-forest transition-colors"
          >
            {t('bookNow')}
          </Link>
        </nav>
      </div>
      </header>
    </>
  );
}
