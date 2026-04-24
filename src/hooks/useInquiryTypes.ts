'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SERVICES } from '@/lib/config';

export function useInquiryTypes() {
  const t = useTranslations('contact.form');
  const locale = useLocale() as 'en' | 'fr';
  return [
    { value: '', label: t('generalInquiry') },
    ...SERVICES.map((s) => ({ value: s.key, label: s.title[locale] })),
  ];
}
