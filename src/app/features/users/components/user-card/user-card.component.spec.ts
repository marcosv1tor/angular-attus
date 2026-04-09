import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { ComponentRef } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect } from 'vitest';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  let componentRef: ComponentRef<UserCardComponent>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    cpf: '111.111.111-11',
    phone: '(11) 99999-9999',
    phoneType: 'mobile'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    const title = fixture.debugElement.query(By.css('mat-card-title')).nativeElement;
    expect(title.textContent).toContain('John Doe');
  });

  it('should emit edit event on button click', () => {
    let emittedUser: User | undefined;
    component.edit.subscribe((u: User) => emittedUser = u);

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(emittedUser).toEqual(mockUser);
  });
});
