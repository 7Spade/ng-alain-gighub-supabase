import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { WorkspaceDataService } from '@core/services/workspace-data.service';
import { TokenService } from '@delon/auth';
import { BotService } from '@shared/services/account';

import { BotFacade } from './bot.facade';

describe('BotFacade', () => {
  let facade: BotFacade;
  let botServiceSpy: jasmine.SpyObj<BotService>;
  let dataServiceSpy: jasmine.SpyObj<WorkspaceDataService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;

  const mockBot = {
    id: 'bot-1',
    type: 'Bot' as const,
    name: 'Test Bot',
    email: 'bot@example.com',
    avatar: null,
    status: 'active' as const,
    auth_user_id: 'auth-123', // Bot creator's auth.users.id
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    const botSpy = jasmine.createSpyObj('BotService', ['createBot', 'updateBot', 'deleteBot', 'activateBot', 'deactivateBot']);
    const dataSpy = jasmine.createSpyObj('WorkspaceDataService', ['loadWorkspaceData']);
    const errorSpy = jasmine.createSpyObj('ErrorHandlerService', ['getErrorMessage', 'logError']);
    const tokenSpy = jasmine.createSpyObj('TokenService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        BotFacade,
        { provide: BotService, useValue: botSpy },
        { provide: WorkspaceDataService, useValue: dataSpy },
        { provide: ErrorHandlerService, useValue: errorSpy },
        { provide: TokenService, useValue: tokenSpy }
      ]
    });

    facade = TestBed.inject(BotFacade);
    botServiceSpy = TestBed.inject(BotService) as jasmine.SpyObj<BotService>;
    dataServiceSpy = TestBed.inject(WorkspaceDataService) as jasmine.SpyObj<WorkspaceDataService>;
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('createBot', () => {
    it('should create bot, reload workspace, and return bot', async () => {
      const createRequest = { name: 'New Bot', email: 'new@example.com' };
      botServiceSpy.createBot.and.returnValue(Promise.resolve(mockBot));
      tokenServiceSpy.get.and.returnValue({ user: { id: 'user-1' } });
      dataServiceSpy.loadWorkspaceData.and.returnValue(Promise.resolve());

      const result = await facade.createBot(createRequest);

      expect(result).toEqual(mockBot);
      expect(botServiceSpy.createBot).toHaveBeenCalledWith(createRequest);
      expect(dataServiceSpy.loadWorkspaceData).toHaveBeenCalledWith('user-1');
    });

    it('should handle errors and throw with user-friendly message', async () => {
      const createRequest = { name: 'New Bot', email: 'new@example.com' };
      const error = new Error('Database error');
      botServiceSpy.createBot.and.returnValue(Promise.reject(error));
      errorHandlerSpy.getErrorMessage.and.returnValue('建立機器人失敗');

      await expectAsync(facade.createBot(createRequest)).toBeRejectedWithError('建立機器人失敗');
      expect(errorHandlerSpy.logError).toHaveBeenCalledWith('BotFacade', 'create bot', error);
    });
  });

  describe('updateBot', () => {
    it('should update bot, reload workspace, and return bot', async () => {
      const updateRequest = { name: 'Updated Bot' };
      const updatedBot = { ...mockBot, name: 'Updated Bot' };
      botServiceSpy.updateBot.and.returnValue(Promise.resolve(updatedBot));
      tokenServiceSpy.get.and.returnValue({ user: { id: 'user-1' } });
      dataServiceSpy.loadWorkspaceData.and.returnValue(Promise.resolve());

      const result = await facade.updateBot('bot-1', updateRequest);

      expect(result).toEqual(updatedBot);
      expect(botServiceSpy.updateBot).toHaveBeenCalledWith('bot-1', updateRequest);
    });
  });

  describe('deleteBot', () => {
    it('should delete bot and reload workspace', async () => {
      botServiceSpy.deleteBot.and.returnValue(Promise.resolve());
      tokenServiceSpy.get.and.returnValue({ user: { id: 'user-1' } });
      dataServiceSpy.loadWorkspaceData.and.returnValue(Promise.resolve());

      await facade.deleteBot('bot-1');

      expect(botServiceSpy.deleteBot).toHaveBeenCalledWith('bot-1');
      expect(dataServiceSpy.loadWorkspaceData).toHaveBeenCalledWith('user-1');
    });
  });

  describe('Bot Status Management', () => {
    it('should activate bot and reload workspace', async () => {
      const activatedBot = { ...mockBot, status: 'active' as const };
      botServiceSpy.activateBot.and.returnValue(Promise.resolve(activatedBot));
      tokenServiceSpy.get.and.returnValue({ user: { id: 'user-1' } });
      dataServiceSpy.loadWorkspaceData.and.returnValue(Promise.resolve());

      const result = await facade.activateBot('bot-1');

      expect(result).toEqual(activatedBot);
      expect(botServiceSpy.activateBot).toHaveBeenCalledWith('bot-1');
    });

    it('should deactivate bot and reload workspace', async () => {
      const deactivatedBot = { ...mockBot, status: 'inactive' as const };
      botServiceSpy.deactivateBot.and.returnValue(Promise.resolve(deactivatedBot));
      tokenServiceSpy.get.and.returnValue({ user: { id: 'user-1' } });
      dataServiceSpy.loadWorkspaceData.and.returnValue(Promise.resolve());

      const result = await facade.deactivateBot('bot-1');

      expect(result).toEqual(deactivatedBot);
      expect(botServiceSpy.deactivateBot).toHaveBeenCalledWith('bot-1');
    });
  });

  describe('Error Handling', () => {
    it('should use ErrorHandlerService for consistent error messages', async () => {
      const error = new Error('Network error');
      botServiceSpy.createBot.and.returnValue(Promise.reject(error));
      errorHandlerSpy.getErrorMessage.and.returnValue('網路錯誤，請稍後再試');

      try {
        await facade.createBot({ name: 'Bot', email: 'bot@test.com' });
        fail('Should have thrown an error');
      } catch (e) {
        expect(errorHandlerSpy.getErrorMessage).toHaveBeenCalledWith(error, 'create', '機器人');
        expect((e as Error).message).toBe('網路錯誤，請稍後再試');
      }
    });
  });
});
