import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { cpfValidator } from '../../../../core/validators/cpf.validator';
import { phoneValidator } from '../../../../core/validators/phone.validator';
import { CpfMaskDirective, PhoneMaskDirective } from '../../../../core/directives';
import { User } from '../../../../core/models/user.model';

export interface UserFormDialogData {
  user?: User;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CpfMaskDirective,
    PhoneMaskDirective,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="user-form">

        <mat-form-field appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" placeholder="Nome completo" />
          @if (f['name'].hasError('required')) {
            <mat-error>Nome é obrigatório</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>E-mail</mat-label>
          <input matInput formControlName="email" type="email" placeholder="exemplo@email.com" />
          @if (f['email'].hasError('required')) {
            <mat-error>E-mail é obrigatório</mat-error>
          }
          @if (f['email'].hasError('email')) {
            <mat-error>E-mail inválido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>CPF</mat-label>
          <input matInput appCpfMask formControlName="cpf" placeholder="000.000.000-00" />
          @if (f['cpf'].hasError('required')) {
            <mat-error>CPF é obrigatório</mat-error>
          }
          @if (f['cpf'].hasError('invalidCpf')) {
            <mat-error>CPF inválido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Telefone</mat-label>
          <input matInput appPhoneMask formControlName="phone" placeholder="(00) 00000-0000" />
          @if (f['phone'].hasError('required')) {
            <mat-error>Telefone é obrigatório</mat-error>
          }
          @if (f['phone'].hasError('invalidPhone')) {
            <mat-error>Formato: (11) 99999-9999</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo de Telefone</mat-label>
          <mat-select formControlName="phoneType">
            <mat-option value="mobile">Celular</mat-option>
            <mat-option value="landline">Fixo</mat-option>
          </mat-select>
          @if (f['phoneType'].hasError('required')) {
            <mat-error>Tipo é obrigatório</mat-error>
          }
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button
        mat-flat-button
        [disabled]="form.invalid"
        (click)="submit()"
      >
        Salvar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 400px;
      padding-top: 8px;
    }
    mat-form-field { width: 100%; }
  `],
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  /** inject() replaces constructor @Inject(MAT_DIALOG_DATA) */
  private readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data?.user;

  readonly form: FormGroup = this.fb.group({
    name:      [this.data?.user?.name      ?? '', Validators.required],
    email:     [this.data?.user?.email     ?? '', [Validators.required, Validators.email]],
    cpf:       [this.data?.user?.cpf       ?? '', [Validators.required, cpfValidator()]],
    phone:     [this.data?.user?.phone     ?? '', [Validators.required, phoneValidator()]],
    phoneType: [this.data?.user?.phoneType ?? '', Validators.required],
  });

  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
