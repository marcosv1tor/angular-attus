import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PhoneMaskDirective } from './phone-mask.directive';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `<input appPhoneMask [formControl]="control" />`,
  standalone: true,
  imports: [ReactiveFormsModule, PhoneMaskDirective]
})
class TestComponent {
  control = new FormControl('');
}

describe('PhoneMaskDirective', () => {
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

  it('should format mobile phone properly', () => {
    inputEl.value = '11987654321';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('(11) 98765-4321');
    expect(fixture.componentInstance.control.value).toBe('(11) 98765-4321');
  });

  it('should format landline phone properly', () => {
    inputEl.value = '1134567890';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('(11) 3456-7890');
  });

  it('should format incomplete phone properly', () => {
    inputEl.value = '11';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('(11');

    inputEl.value = '119';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('(11) 9');

    inputEl.value = '1198765';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('(11) 9876-5');
  });
});
