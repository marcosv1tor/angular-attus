import { Directive, HostListener, ElementRef, inject } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  private readonly el = inject(ElementRef);
  private readonly ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 11);

    // Formata: (XX) XXXXX-XXXX (celular com 11 dígitos) ou (XX) XXXX-XXXX (fixo com 10 dígitos)
    if (value.length > 0) {
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 6 && value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length === 7 || value.length === 8 || value.length === 9) {
        // Ainda digitando, não sabemos se é fixo ou celular
        if (value.length <= 10) {
          value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        } else {
          value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }
      } else if (value.length === 10) {
        // Fixo
        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else if (value.length === 11) {
        // Celular
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }

    input.value = value;
    
    // Atualiza o FormControl com o valor
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(value, { emitEvent: false });
    }
  }
}
