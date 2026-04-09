import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { cpfValidator } from './cpf.validator';

describe('cpfValidator', () => {
  const validate = (value: string) => cpfValidator()(new FormControl(value));

  it('returns null for empty value', () => {
    expect(validate('')).toBeNull();
  });

  it('accepts a valid CPF (529.982.247-25)', () => {
    expect(validate('529.982.247-25')).toBeNull();
  });

  it('rejects a CPF with wrong check digits', () => {
    expect(validate('529.982.247-00')).toEqual({ invalidCpf: true });
  });

  it('rejects all-same-digit CPFs', () => {
    expect(validate('111.111.111-11')).toEqual({ invalidCpf: true });
  });

  it('rejects a CPF with wrong length', () => {
    expect(validate('123.456')).toEqual({ invalidCpf: true });
  });
});
