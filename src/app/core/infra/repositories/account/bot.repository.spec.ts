import { TestBed } from '@angular/core/testing';
import { SupabaseClient } from '@supabase/supabase-js';
import { BotRepository } from './bot.repository';
import { AccountType } from '@core/infra/types/account';

describe('BotRepository', () => {
  let repository: BotRepository;
  let supabaseClientSpy: jasmine.SpyObj<SupabaseClient>;

  const mockBot = {
    id: 'bot-1',
    type: AccountType.BOT,
    name: 'Test Bot',
    email: 'bot@example.com',
    creator_id: 'user-1',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null
  };

  beforeEach(() => {
    const supabaseSpy = jasmine.createSpyObj('SupabaseClient', ['from']);

    TestBed.configureTestingModule({
      providers: [
        BotRepository,
        { provide: SupabaseClient, useValue: supabaseSpy }
      ]
    });

    repository = TestBed.inject(BotRepository);
    supabaseClientSpy = TestBed.inject(SupabaseClient) as jasmine.SpyObj<SupabaseClient>;
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('findAll', () => {
    it('should enforce type=Bot filter automatically', (done) => {
      const selectSpy = jasmine.createSpy('select').and.returnValue(Promise.resolve({ data: [mockBot], error: null }));
      const eqSpy = jasmine.createSpy('eq').and.returnValue({ select: selectSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue({ eq: eqSpy });

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findAll().subscribe({
        next: (bots) => {
          expect(bots).toEqual([mockBot]);
          expect(eqSpy).toHaveBeenCalledWith('type', AccountType.BOT);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByCreator', () => {
    it('should find bots by creator_id with type enforcement', (done) => {
      const selectSpy = jasmine.createSpy('select').and.returnValue(Promise.resolve({ data: [mockBot], error: null }));
      const eqCreatorSpy = jasmine.createSpy('eq').and.returnValue({ select: selectSpy });
      const eqTypeSpy = jasmine.createSpy('eq').and.returnValue({ eq: eqCreatorSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue({ eq: eqTypeSpy });

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findByCreator('user-1').subscribe({
        next: (bots) => {
          expect(bots).toEqual([mockBot]);
          expect(eqTypeSpy).toHaveBeenCalledWith('type', AccountType.BOT);
          expect(eqCreatorSpy).toHaveBeenCalledWith('creator_id', 'user-1');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByStatus', () => {
    it('should find bots by status with type enforcement', (done) => {
      const selectSpy = jasmine.createSpy('select').and.returnValue(Promise.resolve({ data: [mockBot], error: null }));
      const eqStatusSpy = jasmine.createSpy('eq').and.returnValue({ select: selectSpy });
      const eqTypeSpy = jasmine.createSpy('eq').and.returnValue({ eq: eqStatusSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue({ eq: eqTypeSpy });

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findByStatus('active').subscribe({
        next: (bots) => {
          expect(bots).toEqual([mockBot]);
          expect(eqTypeSpy).toHaveBeenCalledWith('type', AccountType.BOT);
          expect(eqStatusSpy).toHaveBeenCalledWith('status', 'active');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Type Safety', () => {
    it('should never return non-Bot accounts', (done) => {
      const selectSpy = jasmine.createSpy('select').and.returnValue(Promise.resolve({ data: [], error: null }));
      const eqSpy = jasmine.createSpy('eq').and.returnValue({ select: selectSpy });
      const fromSpy = jasmine.createSpyObj('from', ['select']);
      fromSpy.select.and.returnValue({ eq: eqSpy });

      supabaseClientSpy.from.and.returnValue(fromSpy);

      repository.findAll().subscribe({
        next: () => {
          expect(eqSpy).toHaveBeenCalledWith('type', AccountType.BOT);
          done();
        },
        error: done.fail
      });
    });
  });
});
