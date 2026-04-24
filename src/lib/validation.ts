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

interface ValidationMessages {
  nameRequired: string;
  nameInvalid: string;
  emailRequired: string;
  emailInvalid: string;
  phoneInvalid: string;
  messageRequired: string;
  messageTooShort: string;
}

export function validateForm(form: FormFields, msg: ValidationMessages): ValidationErrors {
  const errs: ValidationErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const message = form.message.trim();

  if (!name) errs.name = msg.nameRequired;
  else if (name.length < 2 || !/[a-zA-ZÀ-ÿ]/.test(name)) errs.name = msg.nameInvalid;

  if (!email) errs.email = msg.emailRequired;
  else if (!EMAIL_RE.test(email)) errs.email = msg.emailInvalid;

  if (phone && !isValidPhone(phone)) errs.phone = msg.phoneInvalid;

  if (!message) errs.message = msg.messageRequired;
  else if (message.length < 10) errs.message = msg.messageTooShort;

  return errs;
}
