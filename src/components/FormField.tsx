'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const labelClass = 'text-xs font-medium text-forest/60 tracking-wider uppercase';
const inputClass = 'bg-white border-forest/20 focus-visible:ring-sage focus-visible:border-sage';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  error?: string;
}

export function FormField({
  label, name, value, onChange, onBlur, placeholder,
  type = 'text', autoComplete, maxLength, error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`${inputClass} ${error ? 'border-red-400' : ''}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
}

export function TextareaField({
  label, name, value, onChange, placeholder, rows = 6, maxLength, error,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className={labelClass}>{label}</label>
        {maxLength !== undefined && (
          <span className={`text-xs tabular-nums ${value.length >= maxLength ? 'text-red-500' : 'text-forest/40'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`${inputClass} resize-none ${error ? 'border-red-400' : ''}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
