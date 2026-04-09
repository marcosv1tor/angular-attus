import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="user-card" appearance="outlined">
      <mat-card-header>
        <div mat-card-avatar class="user-avatar">
          {{ user().name.charAt(0).toUpperCase() }}
        </div>
        <mat-card-title>{{ user().name }}</mat-card-title>
        <mat-card-subtitle>{{ user().email }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="info-row">
          <mat-icon class="info-icon">badge</mat-icon>
          {{ user().cpf }}
        </p>
        <p class="info-row">
          <mat-icon class="info-icon">
            {{ user().phoneType === 'mobile' ? 'smartphone' : 'phone' }}
          </mat-icon>
          {{ user().phone }}
          <span class="phone-badge">
            {{ user().phoneType === 'mobile' ? 'Celular' : 'Fixo' }}
          </span>
        </p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-stroked-button (click)="edit.emit(user())">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .user-card { width: 100%; }
    .user-avatar {
      background-color: #c62828;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      border-radius: 50%;
    }
    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
      color: #555;
      font-size: 14px;
    }
    .info-icon { font-size: 18px; width: 18px; height: 18px; color: #999; }
    .phone-badge {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      color: #666;
    }
  `],
})
export class UserCardComponent {
  /** Signal-based input (Angular 17+) */
  readonly user = input.required<User>();

  /** Signal-based output (Angular 17+) */
  readonly edit = output<User>();
}
