import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NumerologyService } from './numerology.service';
import { NumerologyReport } from '../../entities/numerology-report.entity';

describe('NumerologyService', () => {
  let service: NumerologyService;
  let numerologyRepository: Repository<NumerologyReport>;

  const mockNumerologyRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NumerologyService,
        {
          provide: getRepositoryToken(NumerologyReport),
          useValue: mockNumerologyRepository,
        },
      ],
    }).compile();

    service = module.get<NumerologyService>(NumerologyService);
    numerologyRepository = module.get<Repository<NumerologyReport>>(
      getRepositoryToken(NumerologyReport),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(numerologyRepository).toBeDefined();
  });

  describe('generateReport', () => {
    it('should generate a numerology report for a user', async () => {
      const userId = 'user-1';
      const fullName = 'John Doe';
      const birthDate = new Date('1990-05-15');

      const mockReport = {
        id: 'report-1',
        user: { id: userId },
        fullName,
        birthDate,
        lifePathNumber: 7,
        destinyNumber: 3,
        soulUrgeNumber: 5,
        personalityNumber: 2,
        lifePathInterpretation: 'Life path interpretation...',
        destinyInterpretation: 'Destiny interpretation...',
      };

      mockNumerologyRepository.create.mockReturnValue(mockReport);
      mockNumerologyRepository.save.mockResolvedValue(mockReport);

      const result = await service.generateReport(userId, fullName, birthDate);

      expect(mockNumerologyRepository.create).toHaveBeenCalledWith({
        user: { id: userId },
        fullName,
        birthDate,
        lifePathNumber: 7,
        destinyNumber: 3,
        soulUrgeNumber: 5,
        personalityNumber: 2,
        lifePathInterpretation: 'Life path interpretation...',
        destinyInterpretation: 'Destiny interpretation...',
      });
      expect(mockNumerologyRepository.save).toHaveBeenCalledWith(mockReport);
      expect(result).toBe(mockReport);
    });

    it('should generate report with all required numerology numbers', async () => {
      const userId = 'user-2';
      const fullName = 'Jane Smith';
      const birthDate = new Date('1985-12-25');

      const mockReport = {
        id: 'report-2',
        user: { id: userId },
        fullName,
        birthDate,
        lifePathNumber: 7,
        destinyNumber: 3,
        soulUrgeNumber: 5,
        personalityNumber: 2,
        lifePathInterpretation: expect.any(String),
        destinyInterpretation: expect.any(String),
      };

      mockNumerologyRepository.create.mockReturnValue(mockReport);
      mockNumerologyRepository.save.mockResolvedValue(mockReport);

      const result = await service.generateReport(userId, fullName, birthDate);

      expect(result).toHaveProperty('lifePathNumber');
      expect(result).toHaveProperty('destinyNumber');
      expect(result).toHaveProperty('soulUrgeNumber');
      expect(result).toHaveProperty('personalityNumber');
      expect(result).toHaveProperty('lifePathInterpretation');
      expect(result).toHaveProperty('destinyInterpretation');
    });
  });
});
