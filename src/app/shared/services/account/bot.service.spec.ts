import { TestBed } from '@angular/core/testing';
import { BotService } from './bot.service';
import { BotRepository } from '@core/infra/repositories/account';
import { of, throwError } from 'rxjs';

describe('BotService', () => {
  let service: BotService;
  let botRepositorySpy: jasmine.SpyObj<BotRepository>;

  const mockBot = {
    id: 'bot-1',
    type: 'Bot' as const,
    name: 'Test Bot',
    email: 'bot@example.com',
    creator_id: 'user-1',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null
  };

  beforeEach(() => {
    const botRepoSpy = jasmine.createSpyObj('BotRepository', [
      'findAll',
      'findById',
      'findByCreator',
      'findByStatus',
      'create',
      'update',
      'softDelete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        BotService,
        { provide: BotRepository, useValue: botRepoSpy }
      ]
    });

    service = TestBed.inject(BotService);
    botRepositorySpy = TestBed.inject(BotRepository) as jasmine.SpyObj<BotRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllBots', () => {
    it('should load bots and update signal', async () => {
      botRepositorySpy.findAll.and.returnValue(of([mockBot]));

      await service.getAllBots();

      expect(botRepositorySpy.findAll).toHaveBeenCalled();
      expect(service.bots()).toEqual([mockBot]);
      expect(service.isLoading()).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Load failed');
      botRepositorySpy.findAll.and.returnValue(throwError(() => error));

      await expectAsync(service.getAllBots()).toBeRejected();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('getBotById', () => {
    it('should return bot by id', async () => {
      botRepositorySpy.findById.and.returnValue(of(mockBot));

      const result = await service.getBotById('bot-1');

      expect(result).toEqual(mockBot);
      expect(botRepositorySpy.findById).toHaveBeenCalledWith('bot-1');
    });

    it('should return null when bot not found', async () => {
      botRepositorySpy.findById.and.returnValue(of(null));

      const result = await service.getBotById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createBot', () => {
    it('should create bot and reload list', async () => {
      const createRequest = { name: 'New Bot', email: 'new@example.com', creator_id: 'user-1' };
      botRepositorySpy.create.and.returnValue(of(mockBot));
      botRepositorySpy.findAll.and.returnValue(of([mockBot]));

      const result = await service.createBot(createRequest);

      expect(result).toEqual(mockBot);
      expect(botRepositorySpy.create).toHaveBeenCalledWith(jasmine.objectContaining(createRequest));
      expect(botRepositorySpy.findAll).toHaveBeenCalled();
    });
  });

  describe('updateBot', () => {
    it('should update bot and reload list', async () => {
      const updateRequest = { name: 'Updated Bot' };
      const updatedBot = { ...mockBot, name: 'Updated Bot' };
      botRepositorySpy.update.and.returnValue(of(updatedBot));
      botRepositorySpy.findAll.and.returnValue(of([updatedBot]));

      const result = await service.updateBot('bot-1', updateRequest);

      expect(result).toEqual(updatedBot);
      expect(botRepositorySpy.update).toHaveBeenCalledWith('bot-1', updateRequest);
      expect(botRepositorySpy.findAll).toHaveBeenCalled();
    });
  });

  describe('deleteBot', () => {
    it('should soft delete bot and reload list', async () => {
      botRepositorySpy.softDelete.and.returnValue(of(undefined));
      botRepositorySpy.findAll.and.returnValue(of([]));

      await service.deleteBot('bot-1');

      expect(botRepositorySpy.softDelete).toHaveBeenCalledWith('bot-1');
      expect(botRepositorySpy.findAll).toHaveBeenCalled();
    });
  });

  describe('Bot Status Management', () => {
    it('should activate bot', async () => {
      const activatedBot = { ...mockBot, status: 'active' as const };
      botRepositorySpy.update.and.returnValue(of(activatedBot));
      botRepositorySpy.findAll.and.returnValue(of([activatedBot]));

      await service.activateBot('bot-1');

      expect(botRepositorySpy.update).toHaveBeenCalledWith('bot-1', { status: 'active' });
    });

    it('should deactivate bot', async () => {
      const deactivatedBot = { ...mockBot, status: 'inactive' as const };
      botRepositorySpy.update.and.returnValue(of(deactivatedBot));
      botRepositorySpy.findAll.and.returnValue(of([deactivatedBot]));

      await service.deactivateBot('bot-1');

      expect(botRepositorySpy.update).toHaveBeenCalledWith('bot-1', { status: 'inactive' });
    });
  });

  describe('Signals', () => {
    it('should expose reactive state via signals', () => {
      expect(service.bots()).toEqual([]);
      expect(service.isLoading()).toBe(false);
      expect(service.botCount()).toBe(0);
    });

    it('should update botCount computed signal when bots change', async () => {
      botRepositorySpy.findAll.and.returnValue(of([mockBot, { ...mockBot, id: 'bot-2' }]));

      await service.getAllBots();

      expect(service.botCount()).toBe(2);
    });
  });
});
