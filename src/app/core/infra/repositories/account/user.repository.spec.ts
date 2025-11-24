/**
 * User Repository Unit Tests
 *
 * Tests for UserRepository to ensure type filtering and data access work correctly.
 */

import { TestBed } from '@angular/core/testing';

import { UserRepository } from './user.repository';
import { SupabaseService } from '../../supabase/supabase.service';
import { AccountType, AccountStatus } from '../../types';

describe('UserRepository', () => {
  let repository: UserRepository;
  let supabaseServiceMock: jasmine.SpyObj<SupabaseService>;
  let clientMock: any;
  let queryBuilderMock: any;

  beforeEach(() => {
    // Create query builder mock
    queryBuilderMock = {
      select: jasmine.createSpy('select').and.returnThis(),
      eq: jasmine.createSpy('eq').and.returnThis(),
      in: jasmine.createSpy('in').and.returnThis(),
      single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: null, error: null })),
      order: jasmine.createSpy('order').and.returnThis(),
      limit: jasmine.createSpy('limit').and.returnThis(),
      range: jasmine.createSpy('range').and.returnThis()
    };

    // Create client mock
    clientMock = {
      from: jasmine.createSpy('from').and.returnValue(queryBuilderMock)
    };

    // Create Supabase service mock
    supabaseServiceMock = jasmine.createSpyObj('SupabaseService', ['getClient']);
    supabaseServiceMock.getClient.and.returnValue(clientMock);

    TestBed.configureTestingModule({
      providers: [UserRepository, { provide: SupabaseService, useValue: supabaseServiceMock }]
    });

    repository = TestBed.inject(UserRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('findAll', () => {
    it('should enforce type="User" filter', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', type: AccountType.USER, name: 'Test User' }],
          error: null
        })
      );

      repository.findAll().subscribe({
        next: () => {
          expect(clientMock.from).toHaveBeenCalledWith('accounts');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });

    it('should preserve additional filters when enforcing type', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', type: AccountType.USER, status: AccountStatus.ACTIVE }],
          error: null
        })
      );

      repository.findAll({ filters: { status: AccountStatus.ACTIVE } }).subscribe({
        next: () => {
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.USER);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('status', AccountStatus.ACTIVE);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findById', () => {
    it('should enforce type="User" filter when finding by ID', done => {
      queryBuilderMock.single.and.returnValue(
        Promise.resolve({
          data: { id: '123', type: AccountType.USER, name: 'Test User' },
          error: null
        })
      );

      repository.findById('123').subscribe({
        next: () => {
          expect(clientMock.from).toHaveBeenCalledWith('accounts');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', '123');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByAuthUserId', () => {
    it('should find user by auth_user_id with type filter', done => {
      const authUserId = 'auth-123';
      queryBuilderMock.single.and.returnValue(
        Promise.resolve({
          data: { id: '1', authUserId, type: AccountType.USER },
          error: null
        })
      );

      repository.findByAuthUserId(authUserId).subscribe({
        next: result => {
          expect(result).toBeTruthy();
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('auth_user_id', authUserId);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByEmail', () => {
    it('should find user by email with type filter', done => {
      const email = 'test@example.com';
      queryBuilderMock.single.and.returnValue(
        Promise.resolve({
          data: { id: '1', email, type: AccountType.USER },
          error: null
        })
      );

      repository.findByEmail(email).subscribe({
        next: result => {
          expect(result).toBeTruthy();
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('email', email);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('create', () => {
    it('should enforce type="User" when creating', done => {
      const userData = {
        name: 'New User',
        email: 'new@example.com'
      };

      const insertMock = {
        insert: jasmine.createSpy('insert').and.returnThis(),
        select: jasmine.createSpy('select').and.returnThis(),
        single: jasmine.createSpy('single').and.returnValue(
          Promise.resolve({
            data: { ...userData, type: AccountType.USER },
            error: null
          })
        )
      };

      clientMock.from.and.returnValue(insertMock);

      repository.create(userData as any).subscribe({
        next: result => {
          expect(insertMock.insert).toHaveBeenCalledWith(
            jasmine.objectContaining({
              ...userData,
              type: AccountType.USER
            })
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('count', () => {
    it('should enforce type="User" filter when counting', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          count: 5,
          error: null
        })
      );

      repository.count().subscribe({
        next: count => {
          expect(count).toBe(5);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.USER);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('softDelete', () => {
    it('should update status to DELETED', done => {
      const updateMock = {
        update: jasmine.createSpy('update').and.returnThis(),
        eq: jasmine.createSpy('eq').and.returnThis(),
        select: jasmine.createSpy('select').and.returnThis(),
        single: jasmine.createSpy('single').and.returnValue(
          Promise.resolve({
            data: { id: '123', status: AccountStatus.DELETED },
            error: null
          })
        )
      };

      clientMock.from.and.returnValue(updateMock);

      repository.softDelete('123').subscribe({
        next: result => {
          expect(updateMock.update).toHaveBeenCalledWith(jasmine.objectContaining({ status: AccountStatus.DELETED }));
          done();
        },
        error: done.fail
      });
    });
  });
});
