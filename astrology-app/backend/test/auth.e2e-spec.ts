import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let userRepository: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
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

    userRepository = moduleFixture.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({
        email: 'test@example.com',
        name: 'Test User',
      });
      userRepository.save.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          name: 'Test User',
        })
        .expect(400);
    });

    it('should fail with weak password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
        })
        .expect(400);
    });

    it('should fail without required fields', () => {
      return request(app.getHttpServer()).post('/auth/register').send({}).expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: '$2b$10$hashedPassword',
        name: 'Test User',
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should fail with invalid credentials', () => {
      userRepository.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/auth/me (GET)', () => {
    it('should return user info with valid token', async () => {
      const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({
        email: 'me@example.com',
        password: 'Password123!',
        name: 'Me User',
      });

      const token = registerResponse.body.access_token;

      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('name');
        });
    });

    it('should fail without token', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
