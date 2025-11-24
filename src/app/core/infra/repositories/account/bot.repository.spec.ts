/**
 * Bot Repository Unit Tests
 *
 * Tests for BotRepository to ensure type filtering and data access work correctly.
 */

import { TestBed } from '@angular/core/testing';

import { BotRepository } from './bot.repository';
import { SupabaseService } from '../../supabase/supabase.service';
import { AccountType, AccountStatus } from '../../types';

describe('BotRepository', () => {
  let repository: BotRepository;
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
      providers: [BotRepository, { provide: SupabaseService, useValue: supabaseServiceMock }]
    });

    repository = TestBed.inject(BotRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('findAll', () => {
    it('should enforce type="Bot" filter', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', type: AccountType.BOT, name: 'Test Bot' }],
          error: null
        })
      );

      repository.findAll().subscribe({
        next: () => {
          expect(clientMock.from).toHaveBeenCalledWith('accounts');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.BOT);
          done();
        },
        error: done.fail
      });
    });

    it('should preserve additional filters when enforcing type', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', type: AccountType.BOT, status: AccountStatus.ACTIVE }],
          error: null
        })
      );

      repository.findAll({ filters: { status: AccountStatus.ACTIVE } }).subscribe({
        next: () => {
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.BOT);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('status', AccountStatus.ACTIVE);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findById', () => {
    it('should enforce type="Bot" filter when finding by ID', done => {
      queryBuilderMock.single.and.returnValue(
        Promise.resolve({
          data: { id: '123', type: AccountType.BOT, name: 'Test Bot' },
          error: null
        })
      );

      repository.findById('123').subscribe({
        next: () => {
          expect(clientMock.from).toHaveBeenCalledWith('accounts');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', '123');
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.BOT);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByName', () => {
    it('should find bot by name with type filter', done => {
      const name = 'My Bot';
      queryBuilderMock.single.and.returnValue(
        Promise.resolve({
          data: { id: '1', name, type: AccountType.BOT },
          error: null
        })
      );

      repository.findByName(name).subscribe({
        next: result => {
          expect(result).toBeTruthy();
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('name', name);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.BOT);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByCreator', () => {
    it('should find bots by creator with type filter', done => {
      const createdBy = 'user-123';
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          data: [{ id: '1', createdBy, type: AccountType.BOT }],
          error: null
        })
      );

      repository.findByCreator(createdBy).subscribe({
        next: results => {
          expect(results).toBeTruthy();
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('created_by', createdBy);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.BOT);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('create', () => {
    it('should enforce type="Bot" when creating', done => {
      const botData = {
        name: 'New Bot',
        description: 'Test bot'
      };

      const insertMock = {
        insert: jasmine.createSpy('insert').and.returnThis(),
        select: jasmine.createSpy('select').and.returnThis(),
        single: jasmine.createSpy('single').and.returnValue(
          Promise.resolve({
            data: { ...botData, type: AccountType.BOT },
            error: null
          })
        )
      };

      clientMock.from.and.returnValue(insertMock);

      repository.create(botData as any).subscribe({
        next: result => {
          expect(insertMock.insert).toHaveBeenCalledWith(
            jasmine.objectContaining({
              ...botData,
              type: AccountType.BOT
            })
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('count', () => {
    it('should enforce type="Bot" filter when counting', done => {
      queryBuilderMock.select.and.returnValue(
        Promise.resolve({
          count: 3,
          error: null
        })
      );

      repository.count().subscribe({
        next: count => {
          expect(count).toBe(3);
          expect(queryBuilderMock.eq).toHaveBeenCalledWith('type', AccountType.BOT);
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
