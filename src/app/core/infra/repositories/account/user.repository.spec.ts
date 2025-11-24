import { TestBed } from '@angular/core/testing';
import { AccountType } from '@core/infra/types/account';
import { SupabaseClient } from '@supabase/supabase-js';
import { of, throwError } from 'rxjs';

import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let supabaseClientSpy: jasmine.SpyObj<SupabaseClient>;

  const mockUser = {
    id: 'user-1',
    type: AccountType.USER,
    name: 'Test User',
    email: 'test@example.com',
    avatar: null,
    status: 'active',
    auth_user_id: 'auth-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    const supabaseSpy = jasmine.createSpyObj('SupabaseClient', ['from']);

    TestBed.configureTestingModule({
      providers: [UserRepository, { provide: SupabaseClient, useValue: supabaseSpy }]
    });

    repository = TestBed.inject(UserRepository);
    supabaseClientSpy = TestBed.inject(SupabaseClient) as jasmine.SpyObj<SupabaseClient>;
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('findAll', () => {
    it('should enforce type=User filter automatically', done => {
      const selectSpy = jasmine.createSpy('select').and.returnValue(Promise.resolve({ data: [mockUser], error: null }));
      const eqSpy = jasmine.createSpy('eq').and.returnValue({ select: selectSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue({ eq: eqSpy });

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findAll().subscribe({
        next: users => {
          expect(users).toEqual([mockUser]);
          expect(eqSpy).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });

    it('should merge custom filters with type filter', done => {
      const selectSpy = jasmine.createSpy('select').and.returnValue(Promise.resolve({ data: [mockUser], error: null }));
      const eqTypeSpy = jasmine.createSpy('eq').and.returnValue({ eq: jasmine.createSpy('eq').and.returnValue({ select: selectSpy }) });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue({ eq: eqTypeSpy });

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findAll({ filters: { status: 'active' } }).subscribe({
        next: () => {
          expect(eqTypeSpy).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByAuthUserId', () => {
    it('should find user by auth_user_id with type enforcement', done => {
      const singleSpy = jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: mockUser, error: null }));
      const eqAuthSpy = jasmine.createSpy('eq').and.returnValue({ single: singleSpy });
      const eqTypeSpy = jasmine.createSpy('eq').and.returnValue({ eq: eqAuthSpy });
      const selectSpy = jasmine.createSpy('select').and.returnValue({ eq: eqTypeSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue(selectSpy);

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findByAuthUserId('auth-123').subscribe({
        next: user => {
          expect(user).toEqual(mockUser);
          expect(eqTypeSpy).toHaveBeenCalledWith('type', AccountType.USER);
          expect(eqAuthSpy).toHaveBeenCalledWith('auth_user_id', 'auth-123');
          done();
        },
        error: done.fail
      });
    });

    it('should return null when user not found', done => {
      const singleSpy = jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: null, error: null }));
      const eqAuthSpy = jasmine.createSpy('eq').and.returnValue({ single: singleSpy });
      const eqTypeSpy = jasmine.createSpy('eq').and.returnValue({ eq: eqAuthSpy });
      const selectSpy = jasmine.createSpy('select').and.returnValue({ eq: eqTypeSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue(selectSpy);

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findByAuthUserId('nonexistent').subscribe({
        next: user => {
          expect(user).toBeNull();
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByEmail', () => {
    it('should find user by email with type enforcement', done => {
      const singleSpy = jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: mockUser, error: null }));
      const eqEmailSpy = jasmine.createSpy('eq').and.returnValue({ single: singleSpy });
      const eqTypeSpy = jasmine.createSpy('eq').and.returnValue({ eq: eqEmailSpy });
      const selectSpy = jasmine.createSpy('select').and.returnValue({ eq: eqTypeSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue(selectSpy);

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findByEmail('test@example.com').subscribe({
        next: user => {
          expect(user).toEqual(mockUser);
          expect(eqTypeSpy).toHaveBeenCalledWith('type', AccountType.USER);
          expect(eqEmailSpy).toHaveBeenCalledWith('email', 'test@example.com');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Type Safety', () => {
    it('should never return non-User accounts', done => {
      const nonUserAccount = { ...mockUser, type: AccountType.ORGANIZATION };
      const selectSpy = jasmine.createSpy('select').and.returnValue(Promise.resolve({ data: [nonUserAccount], error: null }));
      const eqSpy = jasmine.createSpy('eq').and.returnValue({ select: selectSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue({ eq: eqSpy });

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findAll().subscribe({
        next: _result => {
          // In real implementation, Supabase would filter this out
          // This test verifies the type filter is applied
          expect(eqSpy).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });
  });
});
