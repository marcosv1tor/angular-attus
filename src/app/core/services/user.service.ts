import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { CreateUserDto, UpdateUserDto, User } from '../models/user.model';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Ana Lima', email: 'ana.lima@email.com', cpf: '529.982.247-25', phone: '(11) 98765-4321', phoneType: 'mobile' },
  { id: '2', name: 'Bruno Souza', email: 'bruno.souza@email.com', cpf: '987.654.321-00', phone: '(21) 3456-7890', phoneType: 'landline' },
  { id: '3', name: 'Carla Mendes', email: 'carla.mendes@email.com', cpf: '111.444.777-35', phone: '(31) 99876-5432', phoneType: 'mobile' },
  { id: '4', name: 'Diego Ferreira', email: 'diego.f@email.com', cpf: '123.456.789-09', phone: '(41) 98765-1234', phoneType: 'mobile' },
  { id: '5', name: 'Elena Pereira', email: 'elena.p@email.com', cpf: '987.654.321-00', phone: '(51) 3223-4455', phoneType: 'landline' },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _users = signal<User[]>([...MOCK_USERS]);
  private nextId = MOCK_USERS.length + 1;

  readonly users = this._users.asReadonly();
  readonly totalUsers = computed(() => this._users().length);

  getAll(): Observable<User[]> {
    return of([...this._users()]).pipe(delay(600));
  }

  getById(id: string): Observable<User> {
    const user = this._users().find(u => u.id === id);
    return user
      ? of({ ...user }).pipe(delay(300))
      : throwError(() => new Error(`Usuário ${id} não encontrado`));
  }

  search(term: string): Observable<User[]> {
    const lower = term.toLowerCase();
    const result = this._users().filter(u => u.name.toLowerCase().includes(lower));
    return of(result).pipe(delay(400));
  }

  create(dto: CreateUserDto): Observable<User> {
    const newUser: User = { ...dto, id: String(this.nextId++) };
    return of(newUser).pipe(
      delay(500),
      switchMap(user => {
        this._users.update(users => [...users, user]);
        return of(user);
      })
    );
  }

  update(id: string, dto: UpdateUserDto): Observable<User> {
    const index = this._users().findIndex(u => u.id === id);
    if (index === -1) return throwError(() => new Error(`Usuário ${id} não encontrado`));

    const updated: User = { ...this._users()[index], ...dto };
    return of(updated).pipe(
      delay(500),
      switchMap(user => {
        this._users.update(users => users.map(u => (u.id === id ? user : u)));
        return of(user);
      })
    );
  }

  delete(id: string): Observable<void> {
    return of(void 0).pipe(
      delay(300),
      switchMap(() => {
        this._users.update(users => users.filter(u => u.id !== id));
        return of(void 0);
      })
    );
  }
}
