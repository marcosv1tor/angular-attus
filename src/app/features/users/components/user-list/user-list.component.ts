import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { UserCardComponent } from '../user-card/user-card.component';
import { UserFormComponent, UserFormDialogData } from '../user-form/user-form.component';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    UserCardComponent,
  ],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Usuários</h1>
        <span class="user-count">{{ users().length }} registros</span>
      </header>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar por nome</mat-label>
        <input matInput [formControl]="searchControl" placeholder="Digite para buscar..." />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      @if (loading()) {
        <div class="feedback-container">
          <mat-spinner diameter="48" />
          <p>Carregando usuários...</p>
        </div>
      }

      @if (error() && !loading()) {
        <div class="feedback-container error-container">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <p>{{ error() }}</p>
          <button mat-stroked-button (click)="loadUsers()">Tentar novamente</button>
        </div>
      }

      @if (!loading() && !error() && users().length === 0) {
        <div class="feedback-container">
          <mat-icon class="empty-icon">person_search</mat-icon>
          <p>Nenhum usuário encontrado.</p>
        </div>
      }

      @if (!loading() && !error() && users().length > 0) {
        <div class="users-grid">
          @for (user of users(); track user.id) {
            <app-user-card [user]="user" (edit)="openEditDialog($event)" />
          }
        </div>
      }

      <button
        mat-fab
        class="fab-button"
        aria-label="Novo usuário"
        (click)="openCreateDialog()"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
      position: relative;
      min-height: 100vh;
    }
    .page-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 24px;
    }
    .page-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .user-count {
      color: #888;
      font-size: 14px;
    }
    .search-field {
      width: 100%;
      max-width: 480px;
      margin-bottom: 24px;
    }
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }
    .feedback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 64px 0;
      color: #666;
    }
    .error-container { color: #c62828; }
    .error-icon, .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    .fab-button {
      position: fixed !important;
      bottom: 32px;
      right: 32px;
      background-color: #c62828;
      color: white;
    }
  `],
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly searchControl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearch();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => {
        this.error.set(err.message ?? 'Erro ao carregar usuários');
        this.loading.set(false);
        return EMPTY;
      }),
    ).subscribe(users => {
      this.users.set(users);
      this.loading.set(false);
    });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap(term =>
        this.userService.search(term).pipe(
          catchError(err => {
            this.error.set(err.message ?? 'Erro na busca');
            return EMPTY;
          }),
        )
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(users => {
      this.users.set(users);
      this.loading.set(false);
    });
  }

  openCreateDialog(): void {
    this.dialog
      .open<UserFormComponent, UserFormDialogData>(UserFormComponent, {
        data: {},
        width: '480px',
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(result => this.userService.create(result)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(newUser => {
        this.users.update(list => [...list, newUser]);
      });
  }

  openEditDialog(user: User): void {
    this.dialog
      .open<UserFormComponent, UserFormDialogData>(UserFormComponent, {
        data: { user },
        width: '480px',
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(result => this.userService.update(user.id, result)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(updated => {
        this.users.update(list => list.map(u => (u.id === updated.id ? updated : u)));
      });
  }
}
