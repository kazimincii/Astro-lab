import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PersonProfile } from '../src/entities/person-profile.entity';
import { User } from '../src/entities/user.entity';

describe('Profiles (e2e)', () => {
  let app: INestApplication;
  let profileRepository: any;
  let userRepository: any;
  let authToken: string;
  const userId = 'user-1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(PersonProfile))
      .useValue({
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        update: jest.fn(),
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

    profileRepository = moduleFixture.get(getRepositoryToken(PersonProfile));
    userRepository = moduleFixture.get(getRepositoryToken(User));

    // Setup authentication
    const mockUser = {
      id: userId,
      email: 'test@example.com',
      password: '$2b$10$hashedPassword',
      firstName: 'Test',
      lastName: 'User',
    };
    userRepository.findOne.mockResolvedValue(mockUser);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
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

  describe('/profiles (POST)', () => {
    it('should create a new profile with valid data', () => {
      const newProfileData = {
        name: 'John Doe',
        birthDate: '1990-05-15',
        birthTime: '14:30',
        birthPlace: 'New York, NY',
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York',
      };

      const mockProfile = {
        id: 'profile-1',
        ...newProfileData,
        owner: { id: userId },
        isMainProfile: true,
      };

      profileRepository.count.mockResolvedValue(0);
      profileRepository.create.mockReturnValue(mockProfile);
      profileRepository.save.mockResolvedValue(mockProfile);

      return request(app.getHttpServer())
        .post('/profiles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProfileData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(newProfileData.name);
          expect(res.body).toHaveProperty('isMainProfile');
        });
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/profiles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Doe',
          // Missing birthDate and other required fields
        })
        .expect(400);
    });

    it('should fail with invalid date format', () => {
      return request(app.getHttpServer())
        .post('/profiles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Doe',
          birthDate: 'invalid-date',
          birthTime: '14:30',
          birthPlace: 'New York, NY',
          latitude: 40.7128,
          longitude: -74.006,
        })
        .expect(400);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/profiles')
        .send({
          name: 'John Doe',
          birthDate: '1990-05-15',
        })
        .expect(401);
    });
  });

  describe('/profiles (GET)', () => {
    it('should return all profiles for authenticated user', () => {
      const mockProfiles = [
        {
          id: 'profile-1',
          name: 'John Doe',
          birthDate: new Date('1990-05-15'),
          isMainProfile: true,
          owner: { id: userId },
        },
        {
          id: 'profile-2',
          name: 'Jane Doe',
          birthDate: new Date('1992-08-20'),
          isMainProfile: false,
          owner: { id: userId },
        },
      ];

      profileRepository.find.mockResolvedValue(mockProfiles);

      return request(app.getHttpServer())
        .get('/profiles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('birthDate');
        });
    });

    it('should return empty array if user has no profiles', () => {
      profileRepository.find.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/profiles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(0);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/profiles')
        .expect(401);
    });
  });

  describe('/profiles/:id (GET)', () => {
    it('should return profile by ID', () => {
      const profileId = 'profile-1';
      const mockProfile = {
        id: profileId,
        name: 'John Doe',
        birthDate: new Date('1990-05-15'),
        birthTime: '14:30',
        birthPlace: 'New York, NY',
        latitude: 40.7128,
        longitude: -74.006,
        sunSign: 'Taurus',
        moonSign: 'Leo',
        risingSign: 'Virgo',
        owner: { id: userId },
      };

      profileRepository.findOne.mockResolvedValue(mockProfile);

      return request(app.getHttpServer())
        .get(`/profiles/${profileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(profileId);
          expect(res.body.name).toBe('John Doe');
          expect(res.body).toHaveProperty('sunSign');
        });
    });

    it('should return 404 if profile not found', () => {
      profileRepository.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/profiles/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/profiles/:id (PATCH)', () => {
    it('should update profile with valid data', () => {
      const profileId = 'profile-1';
      const updateData = {
        name: 'John Smith',
        birthPlace: 'Los Angeles, CA',
      };

      const existingProfile = {
        id: profileId,
        name: 'John Doe',
        birthDate: new Date('1990-05-15'),
        owner: { id: userId },
      };

      const updatedProfile = {
        ...existingProfile,
        ...updateData,
      };

      profileRepository.findOne.mockResolvedValue(existingProfile);
      profileRepository.save.mockResolvedValue(updatedProfile);

      return request(app.getHttpServer())
        .patch(`/profiles/${profileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.birthPlace).toBe(updateData.birthPlace);
        });
    });

    it('should return 404 if profile not found', () => {
      profileRepository.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .patch('/profiles/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'New Name' })
        .expect(404);
    });
  });

  describe('/profiles/:id (DELETE)', () => {
    it('should delete profile by ID', () => {
      const profileId = 'profile-1';
      const mockProfile = {
        id: profileId,
        name: 'John Doe',
        owner: { id: userId },
      };

      profileRepository.findOne.mockResolvedValue(mockProfile);
      profileRepository.delete.mockResolvedValue({ affected: 1 });

      return request(app.getHttpServer())
        .delete(`/profiles/${profileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should return 404 if profile not found', () => {
      profileRepository.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .delete('/profiles/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
