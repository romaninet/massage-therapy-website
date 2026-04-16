'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'fees', href: '/fees' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
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

  const prefix = `/${locale}`;
  const isActive = (href: string) => {
    const full = href === '/' ? prefix : `${prefix}${href}`;
    return href === '/' ? pathname === full : pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-forest/95 backdrop-blur-md shadow-lg shadow-forest/20'
          : 'bg-forest'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Massage Therapy Logo"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-heading text-white font-semibold tracking-wide text-base">
                Olha Shelest
              </span>
              <span className="text-white/60 text-xs tracking-widest uppercase font-light">
                Massage Therapy
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
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
                  className={`absolute -bottom-1 left-0 h-px bg-sage transition-all duration-300 ${
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
              className="px-5 py-2.5 border border-white/30 text-white text-sm tracking-wider uppercase font-medium rounded transition-all hover:bg-white hover:text-forest"
            >
              {t('bookNow')}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-4">
            <LanguageSwitcher dark />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
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
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-forest-dark border-t border-white/10 px-6 py-6 flex flex-col gap-1">
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
            className="mt-4 py-3 text-center border border-white/30 text-white text-sm tracking-wider uppercase font-medium rounded hover:bg-white hover:text-forest transition-all"
          >
            {t('bookNow')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
