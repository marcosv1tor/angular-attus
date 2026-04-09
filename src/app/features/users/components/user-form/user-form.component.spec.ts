import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent, UserFormDialogData } from './user-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '../../../../core/models/user.model';
import { vi } from 'vitest';
import { describe, beforeEach, it, expect } from 'vitest';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockDialogRef: Partial<MatDialogRef<UserFormComponent>>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    cpf: '529.982.247-25', // Valid CPF
    phone: '(11) 99999-9999',
    phoneType: 'mobile'
  };

  beforeEach(async () => {
    mockDialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UserFormComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { user: mockUser } as UserFormDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize form with user data if provided', () => {
    expect(component.form.value).toEqual({
      name: mockUser.name,
      email: mockUser.email,
      cpf: mockUser.cpf,
      phone: mockUser.phone,
      phoneType: mockUser.phoneType
    });
  });

  it('should close dialog with form value on submit if valid', () => {
    component.submit();
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.form.value);
  });
});
