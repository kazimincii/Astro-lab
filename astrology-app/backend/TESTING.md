# Testing Guide

This document provides comprehensive information about testing the Astrology Super-App backend.

## Test Structure

```
backend/
├── src/
│   └── modules/
│       └── **/*.spec.ts          # Unit tests
├── test/
│   ├── jest-e2e.json             # E2E test configuration
│   └── **/*.e2e-spec.ts          # E2E tests
└── coverage/                      # Coverage reports
```

## Running Tests

### Unit Tests

Run all unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:cov
```

### E2E Tests

Run end-to-end tests:
```bash
npm run test:e2e
```

### Debug Mode

Run tests in debug mode:
```bash
npm run test:debug
```

## Test Coverage

Current test coverage goals:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

View coverage report:
```bash
npm run test:cov
open coverage/lcov-report/index.html
```

## Writing Tests

### Unit Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('YourService', () => {
  let service: YourService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourService,
        {
          provide: getRepositoryToken(YourEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            // ... other methods
          },
        },
      ],
    }).compile();

    service = module.get<YourService>(YourService);
    repository = module.get(getRepositoryToken(YourEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Your tests here
});
```

### E2E Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('YourController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/endpoint (GET)', () => {
    return request(app.getHttpServer())
      .get('/endpoint')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('expectedProperty');
      });
  });
});
```

## Test Organization

### What to Test

#### Services (Unit Tests)
- ✅ Business logic
- ✅ Data transformations
- ✅ Error handling
- ✅ Edge cases
- ✅ Mocked dependencies

#### Controllers (E2E Tests)
- ✅ Request/Response flow
- ✅ Authentication/Authorization
- ✅ Validation
- ✅ HTTP status codes
- ✅ Integration with services

### What NOT to Test
- ❌ Third-party library internals
- ❌ TypeORM generated code
- ❌ NestJS decorators
- ❌ Simple getters/setters

## Mocking

### Common Mocks

#### Repository Mock
```typescript
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};
```

#### Service Mock
```typescript
const mockService = {
  methodName: jest.fn(),
};
```

### External Services

Mock external services (OpenAI, Stripe, etc.) to avoid:
- API costs during testing
- Network dependencies
- Rate limiting issues

```typescript
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked response' } }],
        }),
      },
    },
  })),
}));
```

## Test Database

For E2E tests, consider using:
- In-memory SQLite (fast, isolated)
- Test PostgreSQL database (more realistic)
- Docker container (production-like)

### Setup Test Database

```bash
# Using Docker
docker run --name test-postgres -e POSTGRES_PASSWORD=testpass -p 5433:5432 -d postgres

# Update .env.test
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=astrology_test
DATABASE_USER=postgres
DATABASE_PASSWORD=testpass
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` to reset state
- Don't rely on test execution order

### 2. Clear Test Names
```typescript
// ✅ Good
it('should throw UnauthorizedException when credentials are invalid', () => {});

// ❌ Bad
it('test login', () => {});
```

### 3. AAA Pattern
```typescript
it('should create user', async () => {
  // Arrange
  const userData = { email: 'test@example.com' };

  // Act
  const result = await service.createUser(userData);

  // Assert
  expect(result).toBeDefined();
  expect(result.email).toBe(userData.email);
});
```

### 4. Test Coverage
- Aim for high coverage, but focus on quality over quantity
- 100% coverage doesn't guarantee bug-free code
- Test critical paths and edge cases

### 5. Keep Tests Fast
- Mock external dependencies
- Use in-memory databases when possible
- Avoid unnecessary async operations

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-deployment

### CI Configuration Example (.github/workflows/test.yml)
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:cov
      - run: npm run test:e2e
```

## Troubleshooting

### Common Issues

#### Tests Timeout
```typescript
// Increase timeout for specific test
it('slow test', async () => {
  // test code
}, 10000); // 10 seconds
```

#### Mock Not Working
```typescript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### Database Connection Issues
```bash
# Check database is running
docker ps

# Check connection string
echo $DATABASE_URL
```

## Resources

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
