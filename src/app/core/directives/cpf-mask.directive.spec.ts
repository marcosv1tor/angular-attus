import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CpfMaskDirective } from './cpf-mask.directive';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `<input appCpfMask [formControl]="control" />`,
  standalone: true,
  imports: [ReactiveFormsModule, CpfMaskDirective]
})
class TestComponent {
  control = new FormControl('');
}

describe('CpfMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should format cpf properly', () => {
    inputEl.value = '12345678901';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('123.456.789-01');
    expect(fixture.componentInstance.control.value).toBe('123.456.789-01');
  });

  it('should format incomplete cpf properly', () => {
    inputEl.value = '12345';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('123.45');
    
    inputEl.value = '12345678';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('123.456.78');
  });
});
