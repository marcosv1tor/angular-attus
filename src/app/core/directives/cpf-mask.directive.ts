import { Directive, HostListener, ElementRef, inject } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
  private readonly el = inject(ElementRef);
  private readonly ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 11);

    // Formata: XXX.XXX.XXX-XX
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = `${value.slice(0, 3)}.${value.slice(3)}`;
      } else if (value.length <= 9) {
        value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
      } else {
        value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
      }
    }

    input.value = value;
    
    // Atualiza o FormControl com o valor
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(value, { emitEvent: false });
    }
  }
}
