import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelationshipService } from './relationship.service';
import { RelationshipProfile } from '../../entities/relationship.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

describe('RelationshipService', () => {
  let service: RelationshipService;
  let relationshipRepository: Repository<RelationshipProfile>;
  let personRepository: Repository<PersonProfile>;
  let birthChartRepository: Repository<BirthChart>;

  const mockRelationshipRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPersonRepository = {
    findOne: jest.fn(),
  };

  const mockBirthChartRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipService,
        {
          provide: getRepositoryToken(RelationshipProfile),
          useValue: mockRelationshipRepository,
        },
        {
          provide: getRepositoryToken(PersonProfile),
          useValue: mockPersonRepository,
        },
        {
          provide: getRepositoryToken(BirthChart),
          useValue: mockBirthChartRepository,
        },
      ],
    }).compile();

    service = module.get<RelationshipService>(RelationshipService);
    relationshipRepository = module.get<Repository<RelationshipProfile>>(
      getRepositoryToken(RelationshipProfile),
    );
    personRepository = module.get<Repository<PersonProfile>>(
      getRepositoryToken(PersonProfile),
    );
    birthChartRepository = module.get<Repository<BirthChart>>(
      getRepositoryToken(BirthChart),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(relationshipRepository).toBeDefined();
    expect(personRepository).toBeDefined();
    expect(birthChartRepository).toBeDefined();
  });

  describe('analyzeCompatibility', () => {
    it('should analyze compatibility between two people', async () => {
      const userId = 'user-1';
      const person1Id = 'person-1';
      const person2Id = 'person-2';

      const mockPerson1 = {
        id: person1Id,
        name: 'Alice',
        sunSign: 'Leo',
      };

      const mockPerson2 = {
        id: person2Id,
        name: 'Bob',
        sunSign: 'Aquarius',
      };

      const mockChart1 = {
        id: 'chart-1',
        personId: person1Id,
        planets: {},
      };

      const mockChart2 = {
        id: 'chart-2',
        personId: person2Id,
        planets: {},
      };

      const mockRelationship = {
        id: 'rel-1',
        userId,
        person1Id,
        person2Id,
        compatibilityScores: {
          overall: 75,
          emotional: 80,
          communication: 70,
          values: 75,
          physical: 75,
        },
        summary: 'Alice and Bob have good compatibility...',
      };

      mockPersonRepository.findOne
        .mockResolvedValueOnce(mockPerson1)
        .mockResolvedValueOnce(mockPerson2);
      mockBirthChartRepository.findOne
        .mockResolvedValueOnce(mockChart1)
        .mockResolvedValueOnce(mockChart2);
      mockRelationshipRepository.create.mockReturnValue(mockRelationship);
      mockRelationshipRepository.save.mockResolvedValue(mockRelationship);

      const result = await service.analyzeCompatibility(userId, person1Id, person2Id);

      expect(mockPersonRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockBirthChartRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRelationshipRepository.create).toHaveBeenCalled();
      expect(mockRelationshipRepository.save).toHaveBeenCalled();
      expect(result).toBe(mockRelationship);
    });

    it('should throw error if person1 not found', async () => {
      mockPersonRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.analyzeCompatibility('user-1', 'person-1', 'person-2'),
      ).rejects.toThrow('One or both persons not found');
    });

    it('should throw error if person2 not found', async () => {
      const mockPerson1 = { id: 'person-1', name: 'Alice' };
      mockPersonRepository.findOne
        .mockResolvedValueOnce(mockPerson1)
        .mockResolvedValueOnce(null);

      await expect(
        service.analyzeCompatibility('user-1', 'person-1', 'person-2'),
      ).rejects.toThrow('One or both persons not found');
    });
  });

  describe('getRelationship', () => {
    it('should find relationship by person IDs in either order', async () => {
      const mockRelationship = {
        id: 'rel-1',
        userId: 'user-1',
        person1Id: 'person-1',
        person2Id: 'person-2',
      };

      mockRelationshipRepository.findOne.mockResolvedValue(mockRelationship);

      const result = await service.getRelationship('user-1', 'person-1', 'person-2');

      expect(mockRelationshipRepository.findOne).toHaveBeenCalledWith({
        where: [
          { userId: 'user-1', person1Id: 'person-1', person2Id: 'person-2' },
          { userId: 'user-1', person1Id: 'person-2', person2Id: 'person-1' },
        ],
        order: { createdAt: 'DESC' },
      });
      expect(result).toBe(mockRelationship);
    });

    it('should return null if no relationship found', async () => {
      mockRelationshipRepository.findOne.mockResolvedValue(null);

      const result = await service.getRelationship('user-1', 'person-1', 'person-2');

      expect(result).toBeNull();
    });
  });
});
