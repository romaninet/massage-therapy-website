'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (target: 'en' | 'fr') => {
    if (target === locale) return;
    const segments = pathname.split('/');
    if (routing.locales.includes(segments[1] as 'en' | 'fr')) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    router.push(segments.join('/') || '/');
  };

  const activeText = dark ? 'text-white' : 'text-forest';
  const inactiveText = dark ? 'text-white/50 hover:text-white' : 'text-forest/50 hover:text-forest';

  return (
    <div className="flex items-center gap-4">
      {(['en', 'fr'] as const).map((lang) => {
        const isActive = locale === lang;
        return (
          <button
            key={lang}
            onClick={() => switchLocale(lang)}
            className={`relative text-sm font-medium tracking-widest uppercase transition-colors group ${isActive ? activeText : inactiveText}`}
            aria-label={lang === 'en' ? 'English' : 'Français'}
          >
            {lang.toUpperCase()}
            <span
              className={`absolute -bottom-1 left-0 h-px bg-sage transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
