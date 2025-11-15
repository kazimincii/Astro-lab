import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActionsService } from './actions.service';
import { ActionLog, ActionType } from '../../entities/action-log.entity';

describe('ActionsService', () => {
  let service: ActionsService;
  let repository: Repository<ActionLog>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: getRepositoryToken(ActionLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
    repository = module.get<Repository<ActionLog>>(getRepositoryToken(ActionLog));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('logAction', () => {
    it('should create and persist an action log entry', async () => {
      const savedAction = { id: 'action-1' };
      mockRepository.create.mockReturnValue(savedAction);
      mockRepository.save.mockResolvedValue(savedAction);

      const result = await service.logAction('user-1', ActionType.AI_ASSISTANT, { prompt: 'hello' }, { isPremium: true });

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { id: 'user-1' },
          actionType: ActionType.AI_ASSISTANT,
          metadata: { prompt: 'hello' },
          isPremiumAction: true,
        }),
      );
      expect(mockRepository.save).toHaveBeenCalledWith(savedAction);
      expect(result).toBe(savedAction);
    });
  });

  describe('logPremiumAction', () => {
    it('should delegate to logAction with premium flag', async () => {
      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockResolvedValue({});

      await service.logPremiumAction('user-1', ActionType.COFFEE_READING, { cupId: 'abc' }, 'Coffee reading');

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isPremiumAction: true,
          description: 'Coffee reading',
        }),
      );
    });
  });

  describe('getTodayActionsCount', () => {
    it('should return number of premium actions logged today', async () => {
      mockRepository.count.mockResolvedValue(3);
      const result = await service.getTodayActionsCount('user-1');
      expect(result).toBe(3);
      expect(mockRepository.count).toHaveBeenCalled();
    });
  });

  describe('countPremiumActionsBetween', () => {
    it('should return premium actions in the given window', async () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-02');
      mockRepository.count.mockResolvedValue(5);

      const result = await service.countPremiumActionsBetween('user-1', start, end);
      expect(result).toBe(5);
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: {
          user: { id: 'user-1' },
          isPremiumAction: true,
          actionDate: expect.anything(),
        },
      });
    });
  });
});
