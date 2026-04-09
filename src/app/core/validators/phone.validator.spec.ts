import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { phoneValidator } from './phone.validator';

describe('phoneValidator', () => {
  const validate = (value: string) => phoneValidator()(new FormControl(value));

  it('returns null for empty value', () => {
    expect(validate('')).toBeNull();
  });

  it('accepts mobile format (11) 99999-9999', () => {
    expect(validate('(11) 98765-4321')).toBeNull();
  });

  it('accepts landline format (11) 9999-9999', () => {
    expect(validate('(11) 3456-7890')).toBeNull();
  });

  it('rejects phone without parentheses', () => {
    expect(validate('11 98765-4321')).toEqual({ invalidPhone: true });
  });

  it('rejects phone without dash', () => {
    expect(validate('(11) 987654321')).toEqual({ invalidPhone: true });
  });
});
