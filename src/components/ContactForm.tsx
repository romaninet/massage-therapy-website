'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { formatPhone } from '@/lib/phone';
import { SERVICES } from '@/lib/config';
import { type FormFields, type ValidationErrors, TEXT_FILTERS, isValidPhone, validateForm } from '@/lib/validation';
import { FormField, TextareaField } from '@/components/FormField';
import { useInquiryTypes } from '@/hooks/useInquiryTypes';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm({ initialType = '' }: { initialType?: string }) {
  const t = useTranslations('contact.form');
  const v = useTranslations('contact.form.validation');

  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState<FormFields>({
    name: '', email: '', phone: '', message: '',
    type: SERVICES.some((s) => s.key === initialType) ? initialType : '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [honeypot, setHoneypot] = useState('');
  const inquiryTypes = useInquiryTypes();

  const validate = (): boolean => {
    const errs = validateForm(form, {
      nameRequired: v('nameRequired'),
      nameInvalid: v('nameInvalid'),
      emailRequired: v('emailRequired'),
      emailInvalid: v('emailInvalid'),
      phoneInvalid: v('phoneInvalid'),
      messageRequired: v('messageRequired'),
      messageTooShort: v('messageTooShort'),
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhoneBlur = () => {
    const raw = form.phone.trim();
    if (!raw) return;
    if (isValidPhone(raw)) {
      setForm((prev) => ({ ...prev, phone: formatPhone(raw) }));
      setErrors((prev) => ({ ...prev, phone: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, phone: v('phoneInvalid') }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as Exclude<keyof FormFields, 'type'>;
    const filtered = TEXT_FILTERS[key](value);
    setForm((prev) => ({ ...prev, [key]: filtered }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot) { setState('success'); return; }
    if (!validate()) return;
    setState('sending');

    // Resolve service key to English label for the email (Olha reads English)
    const typeLabel = form.type
      ? (SERVICES.find((s) => s.key === form.type)?.title.en ?? form.type)
      : 'General Inquiry';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: typeLabel, website: honeypot }),
      });
      if (!res.ok) throw new Error('Server error');
      setState('success');
      setForm({ name: '', email: '', phone: '', message: '', type: '' });
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-8 bg-pale-sage rounded-lg border border-sage/20">
        <CheckCircle size={48} className="text-sage mb-4" />
        <p className="font-heading text-forest text-xl font-semibold mb-2">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — hidden from real users, bots fill it */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
      />
      <h3 className="font-heading text-forest text-2xl font-semibold mb-2">{t('title')}</h3>

      {/* Inquiry type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-forest/60 tracking-wider uppercase">{t('typeLabel')}</label>
        <select
          name="type"
          value={form.type}
          onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          className="w-full rounded-md border border-forest/20 bg-white px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
        >
          {inquiryTypes.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <FormField
          label={t('name')} name="name" value={form.name} onChange={handleChange}
          placeholder={t('namePlaceholder')} autoComplete="name" maxLength={30} error={errors.name}
        />
        <FormField
          label={t('email')} name="email" type="email" value={form.email} onChange={handleChange}
          placeholder={t('emailPlaceholder')} autoComplete="email" maxLength={30} error={errors.email}
        />
      </div>

      <FormField
        label={t('phone')} name="phone" type="tel" value={form.phone}
        onChange={handleChange} onBlur={handlePhoneBlur}
        placeholder={t('phonePlaceholder')} autoComplete="tel" maxLength={17} error={errors.phone}
      />

      <TextareaField
        label={t('message')} name="message" value={form.message} onChange={handleChange}
        placeholder={t('messagePlaceholder')} rows={6} maxLength={300} error={errors.message}
      />

      {state === 'error' && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3 border border-red-200">
          <AlertCircle size={16} />
          {t('error')}
        </div>
      )}

      <Button
        type="submit"
        disabled={state === 'sending'}
        className="bg-forest hover:bg-forest-dark text-white tracking-wider uppercase text-sm font-medium py-6 transition-all hover:shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {state === 'sending' ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {t('sending')}
          </span>
        ) : (
          t('submit')
        )}
      </Button>
    </form>
  );
}
