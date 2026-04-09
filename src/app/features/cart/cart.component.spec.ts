import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { CartComponent } from './cart.component';

registerLocaleData(localePt);

describe('CartComponent', () => {
  let component: CartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();

    const fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with empty items and zero total', () => {
    expect(component.items()).toEqual([]);
    expect(component.total()).toBe(0);
  });

  it('addItem() adds a new item with quantity 1', () => {
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    expect(component.items()).toHaveLength(1);
    expect(component.items()[0].quantity).toBe(1);
  });

  it('addItem() increments quantity for existing item', () => {
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    expect(component.items()).toHaveLength(1);
    expect(component.items()[0].quantity).toBe(2);
  });

  it('total() computes quantity × price correctly', () => {
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    component.addItem({ id: 2, name: 'Banana', price: 1.0 });
    expect(component.total()).toBe(6.0);
  });

  it('removeItem() decrements quantity', () => {
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    component.removeItem(1);
    expect(component.items()[0].quantity).toBe(1);
  });

  it('removeItem() removes item when quantity reaches 0', () => {
    component.addItem({ id: 1, name: 'Apple', price: 2.5 });
    component.removeItem(1);
    expect(component.items()).toHaveLength(0);
  });
});
