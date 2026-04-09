import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function isValidCpf(cpf: string): boolean {
  const stripped = cpf.replace(/\D/g, '');

  if (stripped.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(stripped)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(stripped[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(stripped[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(stripped[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(stripped[10])) return false;

  return true;
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return isValidCpf(control.value) ? null : { invalidCpf: true };
  };
}
