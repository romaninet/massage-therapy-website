import { describe, it, expect } from 'vitest';
import { TEXT_FILTERS, isValidPhone, validateForm } from './validation';

const MSG = {
  nameRequired: 'Name required',
  nameInvalid: 'Name invalid',
  emailRequired: 'Email required',
  emailInvalid: 'Email invalid',
  phoneInvalid: 'Phone invalid',
  messageRequired: 'Message required',
  messageTooShort: 'Message too short',
};

const base = { name: 'Marie Dubois', email: 'marie@example.com', phone: '', message: 'Hello there world', type: '' };

describe('TEXT_FILTERS', () => {
  it('name: strips digits and special chars, allows French accents and hyphens', () => {
    expect(TEXT_FILTERS.name('Jean-Luc Élodie 123!')).toBe('Jean-Luc Élodie ');
    expect(TEXT_FILTERS.name("O'Brien")).toBe("O'Brien");
  });

  it('email: strips disallowed characters', () => {
    expect(TEXT_FILTERS.email('user@test.com')).toBe('user@test.com');
    expect(TEXT_FILTERS.email('user name@test.com')).toBe('username@test.com');
  });

  it('phone: strips letters, keeps digits and punctuation', () => {
    expect(TEXT_FILTERS.phone('(819) 815-5603')).toBe('(819) 815-5603');
    expect(TEXT_FILTERS.phone('abc 819')).toBe(' 819');
  });

  it('message: strips control characters, keeps normal text and newlines', () => {
    expect(TEXT_FILTERS.message('Hello\nWorld')).toBe('Hello\nWorld');
    expect(TEXT_FILTERS.message('Bad\x00char')).toBe('Badchar');
  });
});

describe('isValidPhone', () => {
  it('accepts 10-digit number', () => expect(isValidPhone('8198155603')).toBe(true));
  it('accepts 11-digit number starting with 1', () => expect(isValidPhone('18198155603')).toBe(true));
  it('accepts formatted string with punctuation', () => expect(isValidPhone('(819) 815-5603')).toBe(true));
  it('rejects 9-digit number', () => expect(isValidPhone('819815560')).toBe(false));
  it('rejects 11-digit number not starting with 1', () => expect(isValidPhone('28198155603')).toBe(false));
  it('accepts empty string (phone is optional)', () => expect(isValidPhone('')).toBe(false));
});

describe('validateForm', () => {
  it('passes with valid data', () => {
    expect(validateForm(base, MSG)).toEqual({});
  });

  it('requires name', () => {
    expect(validateForm({ ...base, name: '' }, MSG).name).toBe('Name required');
  });

  it('rejects single-char name', () => {
    expect(validateForm({ ...base, name: 'A' }, MSG).name).toBe('Name invalid');
  });

  it('requires email', () => {
    expect(validateForm({ ...base, email: '' }, MSG).email).toBe('Email required');
  });

  it('rejects malformed email', () => {
    expect(validateForm({ ...base, email: 'notanemail' }, MSG).email).toBe('Email invalid');
  });

  it('rejects invalid phone when provided', () => {
    expect(validateForm({ ...base, phone: '123' }, MSG).phone).toBe('Phone invalid');
  });

  it('allows empty phone (optional field)', () => {
    expect(validateForm({ ...base, phone: '' }, MSG).phone).toBeUndefined();
  });

  it('requires message', () => {
    expect(validateForm({ ...base, message: '' }, MSG).message).toBe('Message required');
  });

  it('rejects message shorter than 10 chars', () => {
    expect(validateForm({ ...base, message: 'Hi there' }, MSG).message).toBe('Message too short');
  });
});
