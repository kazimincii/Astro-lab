import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const mockUsersRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by ID with relations', async () => {
      const userId = 'user-1';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        currentSubscription: { id: 'sub-1' },
        profiles: [{ id: 'profile-1' }],
      };

      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['currentSubscription', 'profiles'],
      });
      expect(result).toBe(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent-user');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user-1',
        email,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBe(mockUser);
    });

    it('should return null if user with email not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user and return updated user', async () => {
      const userId = 'user-1';
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockUsersRepository.update.mockResolvedValue({ affected: 1 });
      mockUsersRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateData);

      expect(mockUsersRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['currentSubscription', 'profiles'],
      });
      expect(result).toBe(updatedUser);
    });
  });
});
