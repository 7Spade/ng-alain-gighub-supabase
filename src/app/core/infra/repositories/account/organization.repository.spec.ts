/**
 * Organization Repository Unit Tests
 *
 * Tests for OrganizationRepository to ensure type filtering and data access work correctly.
 */

import { TestBed } from '@angular/core/testing';

import { OrganizationRepository } from './organization.repository';
import { SupabaseService } from '../../supabase/supabase.service';
import { AccountType, AccountStatus } from '../../types';

describe('OrganizationRepository', () => {
  let repository: OrganizationRepository;
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
      providers: [OrganizationRepository, { provide: SupabaseService, useValue: supabaseServiceMock }]
    });

    repository = TestBed.inject(OrganizationRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('findAll', () => {
    it('should enforce type="Organization" filter', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', type: AccountType.ORGANIZATION, name: 'Test Org' }],
          error: null
        })
      );

      repository.findAll().subscribe({
        next: () => {
          expect(clientMock.from).toHaveBeenCalledWith('accounts');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.ORGANIZATION);
          done();
        },
        error: done.fail
      });
    });

    it('should preserve additional filters when enforcing type', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', type: AccountType.ORGANIZATION, status: AccountStatus.ACTIVE }],
          error: null
        })
      );

      repository.findAll({ filters: { status: AccountStatus.ACTIVE } }).subscribe({
        next: () => {
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.ORGANIZATION);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('status', AccountStatus.ACTIVE);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findById', () => {
    it('should enforce type="Organization" filter when finding by ID', done => {
      queryBuilderMock.single.and.returnValue(
        Promise.resolve({
          data: { id: '123', type: AccountType.ORGANIZATION, name: 'Test Org' },
          error: null
        })
      );

      repository.findById('123').subscribe({
        next: () => {
          expect(clientMock.from).toHaveBeenCalledWith('accounts');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', '123');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.ORGANIZATION);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByIds', () => {
    it('should find organizations by IDs with type filter', done => {
      const ids = ['1', '2', '3'];
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [
            { id: '1', type: AccountType.ORGANIZATION },
            { id: '2', type: AccountType.ORGANIZATION }
          ],
          error: null
        })
      );

      repository.findByIds(ids).subscribe({
        next: results => {
          expect(results).toBeTruthy();
          expect(queryBuilderMock.in).toHaveBeenCalledWith('id', ids);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.ORGANIZATION);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findCreatedByUser', () => {
    it('should find organizations created by user with type and status filters', done => {
      const authUserId = 'user-123';
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', createdBy: authUserId, type: AccountType.ORGANIZATION, status: AccountStatus.ACTIVE }],
          error: null
        })
      );

      repository.findCreatedByUser(authUserId).subscribe({
        next: results => {
          expect(results).toBeTruthy();
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('created_by', authUserId);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('status', AccountStatus.ACTIVE);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.ORGANIZATION);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('create', () => {
    it('should enforce type="Organization" when creating', done => {
      const orgData = {
        name: 'New Org',
        description: 'Test organization'
      };

      const insertMock = {
        insert: jasmine.createSpy('insert').and.returnThis(),
        select: jasmine.createSpy('select').and.returnThis(),
        single: jasmine.createSpy('single').and.returnValue(
          Promise.resolve({
            data: { ...orgData, type: AccountType.ORGANIZATION },
            error: null
          })
        )
      };

      clientMock.from.and.returnValue(insertMock);

      repository.create(orgData as any).subscribe({
        next: result => {
          expect(insertMock.insert).toHaveBeenCalledWith(
            jasmine.objectContaining({
              ...orgData,
              type: AccountType.ORGANIZATION
            })
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('count', () => {
    it('should enforce type="Organization" filter when counting', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          count: 10,
          error: null
        })
      );

      repository.count().subscribe({
        next: count => {
          expect(count).toBe(10);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.ORGANIZATION);
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
