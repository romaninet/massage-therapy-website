'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email required';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setState('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-8 bg-pale-sage rounded-lg border border-sage/20">
        <CheckCircle size={48} className="text-sage mb-4" />
        <p className="font-heading text-forest text-xl font-semibold mb-2">
          {t('success')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <h3 className="font-heading text-forest text-2xl font-semibold mb-2">{t('title')}</h3>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-forest/60 tracking-wider uppercase">
            {t('name')}
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t('namePlaceholder')}
            className={`bg-white border-forest/20 focus-visible:ring-sage focus-visible:border-sage ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-forest/60 tracking-wider uppercase">
            {t('email')}
          </label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t('emailPlaceholder')}
            className={`bg-white border-forest/20 focus-visible:ring-sage focus-visible:border-sage ${errors.email ? 'border-red-400' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-forest/60 tracking-wider uppercase">
          {t('phone')}
        </label>
        <Input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder={t('phonePlaceholder')}
          className="bg-white border-forest/20 focus-visible:ring-sage focus-visible:border-sage"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-forest/60 tracking-wider uppercase">
          {t('message')}
        </label>
        <Textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          rows={6}
          className={`bg-white border-forest/20 focus-visible:ring-sage focus-visible:border-sage resize-none ${errors.message ? 'border-red-400' : ''}`}
        />
        {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
      </div>

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
