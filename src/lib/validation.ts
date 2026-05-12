export type FormFields = {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
};

export type ValidationErrors = Partial<Omit<FormFields, 'type'>>;

// Strip disallowed characters on input (handles both typing and paste)
export const TEXT_FILTERS: Record<Exclude<keyof FormFields, 'type'>, (v: string) => string> = {
  // Letters (Latin + French accented À-ÿ), spaces, hyphens, apostrophes
  name: (v) => v.replace(/[^a-zA-ZÀ-ÿ\s''\-]/g, ''),
  // Standard email characters only
  email: (v) => v.replace(/[^a-zA-Z0-9@._+\-]/g, ''),
  // Digits, spaces, and phone punctuation only
  phone: (v) => v.replace(/[^0-9\s+\-().]/g, ''),
  // Strip control characters only (allow all printable + Unicode + newlines)
  message: (v) => v.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''),
};

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
}

export interface PersonFieldMessages {
  nameRequired: string;
  nameInvalid: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired?: string; // when provided, phone becomes mandatory
  phoneInvalid: string;
}

export type PersonFieldErrors = Partial<Record<'name' | 'email' | 'phone', string>>;

export function validatePersonFields(
  fields: { name: string; email: string; phone: string },
  msg: PersonFieldMessages
): PersonFieldErrors {
  const errs: PersonFieldErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const phone = fields.phone.trim();

  if (!name) errs.name = msg.nameRequired;
  else if (name.length < 2 || !/[a-zA-ZÀ-ÿ]/.test(name)) errs.name = msg.nameInvalid;

  if (!email) errs.email = msg.emailRequired;
  else if (!EMAIL_RE.test(email)) errs.email = msg.emailInvalid;

  if (msg.phoneRequired && !phone) errs.phone = msg.phoneRequired;
  else if (phone && !isValidPhone(phone)) errs.phone = msg.phoneInvalid;

  return errs;
}

interface ValidationMessages extends PersonFieldMessages {
  messageRequired: string;
  messageTooShort: string;
}

export function validateForm(form: FormFields, msg: ValidationMessages): ValidationErrors {
  const errs: ValidationErrors = { ...validatePersonFields(form, msg) };
  const message = form.message.trim();

  if (!message) errs.message = msg.messageRequired;
  else if (message.length < 10) errs.message = msg.messageTooShort;

  return errs;
}
