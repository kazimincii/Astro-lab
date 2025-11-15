import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  BillingPeriod,
} from '../src/entities/subscription.entity';
import { User } from '../src/entities/user.entity';
import { PersonProfile } from '../src/entities/person-profile.entity';
import { ActionLog } from '../src/entities/action-log.entity';

describe('Subscriptions (e2e)', () => {
  let app: INestApplication;
  let subscriptionRepository: any;
  let userRepository: any;
  let profileRepository: any;
  let actionLogRepository: any;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Subscription))
      .useValue({
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        update: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(PersonProfile))
      .useValue({
        count: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(ActionLog))
      .useValue({
        create: jest.fn(),
        save: jest.fn(),
        count: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    subscriptionRepository = moduleFixture.get(getRepositoryToken(Subscription));
    userRepository = moduleFixture.get(getRepositoryToken(User));
    profileRepository = moduleFixture.get(getRepositoryToken(PersonProfile));
    actionLogRepository = moduleFixture.get(getRepositoryToken(ActionLog));

    // Setup authentication
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      password: '$2b$10$hashedPassword',
      firstName: 'Test',
      lastName: 'User',
    };
    userRepository.findOne.mockResolvedValue(mockUser);

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/subscriptions/plans (GET)', () => {
    it('should return all available subscription plans', () => {
      return request(app.getHttpServer())
        .get('/subscriptions/plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('plan');
          expect(res.body[0]).toHaveProperty('label');
          expect(res.body[0]).toHaveProperty('prices');
          expect(res.body[0]).toHaveProperty('features');
        });
    });
  });

  describe('/subscriptions/current (GET)', () => {
    it('should return current subscription for authenticated user', () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 10,
        profileLimit: 5,
        unlimitedActions: false,
        startDate: new Date(),
        endDate: new Date(),
      };

      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);

      return request(app.getHttpServer())
        .get('/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('plan');
          expect(res.body.plan).toBe(SubscriptionPlan.STANDARD);
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer()).get('/subscriptions/current').expect(401);
    });
  });

  describe('/subscriptions/usage (GET)', () => {
    it('should return usage summary for authenticated user', () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 10,
        profileLimit: 5,
        unlimitedActions: false,
      };

      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      actionLogRepository.count.mockResolvedValue(3);
      profileRepository.count.mockResolvedValue(2);

      return request(app.getHttpServer())
        .get('/subscriptions/usage')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('plan');
          expect(res.body).toHaveProperty('dailyActionLimit');
          expect(res.body).toHaveProperty('actionsUsedToday');
          expect(res.body).toHaveProperty('actionsRemaining');
          expect(res.body).toHaveProperty('profilesUsed');
        });
    });
  });

  describe('/subscriptions/change-plan (POST)', () => {
    it('should change subscription plan with valid data', () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        currentSubscription: null,
      };

      const mockNewSubscription = {
        id: 'sub-2',
        userId: 'user-1',
        plan: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        billingPeriod: BillingPeriod.MONTHLY,
      };

      subscriptionRepository.find.mockResolvedValue([]);
      userRepository.findOne.mockResolvedValue(mockUser);
      subscriptionRepository.create.mockReturnValue(mockNewSubscription);
      subscriptionRepository.save.mockResolvedValue(mockNewSubscription);
      userRepository.update.mockResolvedValue({ affected: 1 });

      return request(app.getHttpServer())
        .post('/subscriptions/change-plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          plan: SubscriptionPlan.PREMIUM,
          billingCycle: 'monthly',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('plan');
          expect(res.body.plan).toBe(SubscriptionPlan.PREMIUM);
        });
    });

    it('should fail with invalid plan type', () => {
      return request(app.getHttpServer())
        .post('/subscriptions/change-plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          plan: 'invalid-plan',
          billingCycle: 'monthly',
        })
        .expect(400);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/subscriptions/change-plan')
        .send({
          plan: SubscriptionPlan.PREMIUM,
          billingCycle: 'monthly',
        })
        .expect(401);
    });
  });

  describe('/subscriptions/start-trial (POST)', () => {
    it('should start trial subscription with valid plan', () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        currentSubscription: null,
      };

      const mockTrialSubscription = {
        id: 'sub-trial',
        userId: 'user-1',
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.TRIAL,
        isTrial: true,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      subscriptionRepository.findOne.mockResolvedValue(null);
      subscriptionRepository.find.mockResolvedValue([]);
      userRepository.findOne.mockResolvedValue(mockUser);
      subscriptionRepository.create.mockReturnValue(mockTrialSubscription);
      subscriptionRepository.save.mockResolvedValue(mockTrialSubscription);
      userRepository.update.mockResolvedValue({ affected: 1 });

      return request(app.getHttpServer())
        .post('/subscriptions/start-trial')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          plan: SubscriptionPlan.STANDARD,
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('status');
          expect(res.body.status).toBe(SubscriptionStatus.TRIAL);
          expect(res.body).toHaveProperty('trialEndsAt');
        });
    });

    it('should fail for basic plan (not trial eligible)', () => {
      return request(app.getHttpServer())
        .post('/subscriptions/start-trial')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          plan: SubscriptionPlan.BASIC,
        })
        .expect(400);
    });
  });

  describe('/subscriptions/cancel (POST)', () => {
    it('should cancel active paid subscription', () => {
      const mockActiveSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        plan: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: 'stripe_sub_123',
      };

      const mockBasicSubscription = {
        id: 'sub-basic',
        userId: 'user-1',
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      subscriptionRepository.findOne
        .mockResolvedValueOnce(mockActiveSubscription)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      subscriptionRepository.update.mockResolvedValue({ affected: 1 });
      subscriptionRepository.create.mockReturnValue(mockBasicSubscription);
      subscriptionRepository.save.mockResolvedValue(mockBasicSubscription);
      userRepository.update.mockResolvedValue({ affected: 1 });

      return request(app.getHttpServer())
        .post('/subscriptions/cancel')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          reason: 'User requested cancellation',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('plan');
          expect(res.body.plan).toBe(SubscriptionPlan.BASIC);
        });
    });

    it('should fail if no paid subscription exists', () => {
      const mockBasicSubscription = {
        id: 'sub-basic',
        userId: 'user-1',
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      subscriptionRepository.findOne.mockResolvedValue(mockBasicSubscription);

      return request(app.getHttpServer())
        .post('/subscriptions/cancel')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });
});
