import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Accepts formats: (11) 99999-9999 or (11) 9999-9999 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const pattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return pattern.test(control.value) ? null : { invalidPhone: true };
  };
}
