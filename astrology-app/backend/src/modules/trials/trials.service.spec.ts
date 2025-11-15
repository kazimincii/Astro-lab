import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TrialsService } from './trials.service';
import { Trial, TrialStatus } from '../../entities/trial.entity';
import { SubscriptionPlan } from '../../entities/subscription.entity';

describe('TrialsService', () => {
  let service: TrialsService;
  let trialRepository: Repository<Trial>;

  const mockTrialRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrialsService,
        {
          provide: getRepositoryToken(Trial),
          useValue: mockTrialRepository,
        },
      ],
    }).compile();

    service = module.get<TrialsService>(TrialsService);
    trialRepository = module.get<Repository<Trial>>(getRepositoryToken(Trial));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(trialRepository).toBeDefined();
  });

  describe('startTrial', () => {
    it('should start a new trial for a user', async () => {
      const userId = 'user-1';
      const planType = SubscriptionPlan.STANDARD;

      const mockTrial = {
        id: 'trial-1',
        userId,
        planType,
        status: TrialStatus.ACTIVE,
        startDate: new Date(),
        endDate: new Date(),
        durationDays: 7,
      };

      mockTrialRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.create.mockReturnValue(mockTrial);
      mockTrialRepository.save.mockResolvedValue(mockTrial);

      const result = await service.startTrial(userId, planType);

      expect(mockTrialRepository.findOne).toHaveBeenCalledWith({
        where: { userId, status: TrialStatus.ACTIVE },
      });
      expect(mockTrialRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          planType,
          status: TrialStatus.ACTIVE,
          durationDays: 7,
        }),
      );
      expect(mockTrialRepository.save).toHaveBeenCalledWith(mockTrial);
      expect(result).toBe(mockTrial);
    });

    it('should throw error if user already has active trial', async () => {
      const userId = 'user-1';
      const existingTrial = {
        id: 'trial-1',
        userId,
        status: TrialStatus.ACTIVE,
      };

      mockTrialRepository.findOne.mockResolvedValue(existingTrial);

      await expect(
        service.startTrial(userId, SubscriptionPlan.STANDARD),
      ).rejects.toThrow('User already has an active trial');

      expect(mockTrialRepository.create).not.toHaveBeenCalled();
      expect(mockTrialRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getUserActiveTrial', () => {
    it('should return active trial for a user', async () => {
      const userId = 'user-1';
      const mockTrial = {
        id: 'trial-1',
        userId,
        status: TrialStatus.ACTIVE,
        planType: SubscriptionPlan.PREMIUM,
      };

      mockTrialRepository.findOne.mockResolvedValue(mockTrial);

      const result = await service.getUserActiveTrial(userId);

      expect(mockTrialRepository.findOne).toHaveBeenCalledWith({
        where: { userId, status: TrialStatus.ACTIVE },
      });
      expect(result).toBe(mockTrial);
    });

    it('should return null if no active trial exists', async () => {
      mockTrialRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserActiveTrial('user-1');

      expect(result).toBeNull();
    });
  });

  describe('cancelTrial', () => {
    it('should cancel an active trial', async () => {
      const userId = 'user-1';
      const mockTrial: any = {
        id: 'trial-1',
        userId,
        status: TrialStatus.ACTIVE,
        planType: SubscriptionPlan.STANDARD,
      };

      const cancelledTrial = {
        ...mockTrial,
        status: TrialStatus.CANCELLED,
        cancelledAt: expect.any(Date),
      };

      mockTrialRepository.findOne.mockResolvedValue(mockTrial);
      mockTrialRepository.save.mockResolvedValue(cancelledTrial);

      const result = await service.cancelTrial(userId);

      expect(mockTrialRepository.findOne).toHaveBeenCalledWith({
        where: { userId, status: TrialStatus.ACTIVE },
      });
      expect(mockTrial.status).toBe(TrialStatus.CANCELLED);
      expect(mockTrial.cancelledAt).toBeDefined();
      expect(mockTrialRepository.save).toHaveBeenCalledWith(mockTrial);
    });

    it('should throw error if no active trial found', async () => {
      mockTrialRepository.findOne.mockResolvedValue(null);

      await expect(service.cancelTrial('user-1')).rejects.toThrow('No active trial found');
    });
  });

  describe('expireTrial', () => {
    it('should expire a trial by ID', async () => {
      const trialId = 'trial-1';
      const mockTrial = {
        id: trialId,
        userId: 'user-1',
        status: TrialStatus.ACTIVE,
      };

      const expiredTrial = {
        ...mockTrial,
        status: TrialStatus.EXPIRED,
      };

      mockTrialRepository.findOne.mockResolvedValue(mockTrial);
      mockTrialRepository.save.mockResolvedValue(expiredTrial);

      const result = await service.expireTrial(trialId);

      expect(mockTrialRepository.findOne).toHaveBeenCalledWith({
        where: { id: trialId },
      });
      expect(mockTrial.status).toBe(TrialStatus.EXPIRED);
      expect(mockTrialRepository.save).toHaveBeenCalledWith(mockTrial);
      expect(result.status).toBe(TrialStatus.EXPIRED);
    });

    it('should throw error if trial not found', async () => {
      mockTrialRepository.findOne.mockResolvedValue(null);

      await expect(service.expireTrial('nonexistent-trial')).rejects.toThrow('Trial not found');
    });
  });

  describe('convertTrial', () => {
    it('should convert trial to paid subscription', async () => {
      const trialId = 'trial-1';
      const subscriptionId = 'sub-1';
      const mockTrial: any = {
        id: trialId,
        userId: 'user-1',
        status: TrialStatus.ACTIVE,
      };

      const convertedTrial = {
        ...mockTrial,
        status: TrialStatus.CONVERTED,
        convertedAt: expect.any(Date),
        convertedSubscriptionId: subscriptionId,
      };

      mockTrialRepository.findOne.mockResolvedValue(mockTrial);
      mockTrialRepository.save.mockResolvedValue(convertedTrial);

      const result = await service.convertTrial(trialId, subscriptionId);

      expect(mockTrialRepository.findOne).toHaveBeenCalledWith({
        where: { id: trialId },
      });
      expect(mockTrial.status).toBe(TrialStatus.CONVERTED);
      expect(mockTrial.convertedAt).toBeDefined();
      expect(mockTrial.convertedSubscriptionId).toBe(subscriptionId);
      expect(mockTrialRepository.save).toHaveBeenCalledWith(mockTrial);
    });

    it('should throw error if trial not found', async () => {
      mockTrialRepository.findOne.mockResolvedValue(null);

      await expect(
        service.convertTrial('nonexistent-trial', 'sub-1'),
      ).rejects.toThrow('Trial not found');
    });
  });

  describe('checkExpiredTrials', () => {
    it('should expire all trials past their end date', async () => {
      const mockExpiredTrials = [
        {
          id: 'trial-1',
          userId: 'user-1',
          status: TrialStatus.ACTIVE,
          endDate: new Date('2025-01-01'),
        },
        {
          id: 'trial-2',
          userId: 'user-2',
          status: TrialStatus.ACTIVE,
          endDate: new Date('2025-01-02'),
        },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockExpiredTrials),
      } as unknown as SelectQueryBuilder<Trial>;

      mockTrialRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockTrialRepository.findOne
        .mockResolvedValueOnce(mockExpiredTrials[0])
        .mockResolvedValueOnce(mockExpiredTrials[1]);
      mockTrialRepository.save.mockResolvedValue({});

      await service.checkExpiredTrials();

      expect(mockTrialRepository.createQueryBuilder).toHaveBeenCalledWith('trial');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('trial.status = :status', {
        status: TrialStatus.ACTIVE,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('trial.endDate < :now', {
        now: expect.any(Date),
      });
      expect(mockTrialRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockTrialRepository.save).toHaveBeenCalledTimes(2);
    });
  });
});
