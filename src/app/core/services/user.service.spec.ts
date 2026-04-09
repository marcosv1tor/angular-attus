import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UserService] });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() returns the initial users', async () => {
    const users = await firstValueFrom(service.getAll());
    expect(users.length).toBeGreaterThan(0);
  });

  it('create() adds a new user and increments list', async () => {
    const initialCount = service.users().length;
    await firstValueFrom(service.create({
      name: 'Test User',
      email: 'test@test.com',
      cpf: '529.982.247-25',
      phone: '(11) 99999-9999',
      phoneType: 'mobile',
    }));
    expect(service.users().length).toBe(initialCount + 1);
  });

  it('update() changes user data', async () => {
    const [first] = service.users();
    await firstValueFrom(service.update(first.id, { name: 'Updated Name' }));
    const updated = service.users().find(u => u.id === first.id);
    expect(updated?.name).toBe('Updated Name');
  });

  it('delete() removes user from list', async () => {
    const [first] = service.users();
    const countBefore = service.users().length;
    await firstValueFrom(service.delete(first.id));
    expect(service.users().length).toBe(countBefore - 1);
    expect(service.users().find(u => u.id === first.id)).toBeUndefined();
  });

  it('search() filters by name (case-insensitive)', async () => {
    const results = await firstValueFrom(service.search('ana'));
    expect(results.every(u => u.name.toLowerCase().includes('ana'))).toBe(true);
  });

  it('search() returns empty array when no match', async () => {
    const results = await firstValueFrom(service.search('zzz_no_match'));
    expect(results).toEqual([]);
  });

  it('totalUsers computed reflects list length', async () => {
    const before = service.totalUsers();
    await firstValueFrom(service.create({
      name: 'Extra',
      email: 'extra@test.com',
      cpf: '529.982.247-25',
      phone: '(11) 11111-1111',
      phoneType: 'landline',
    }));
    expect(service.totalUsers()).toBe(before + 1);
  });
});
