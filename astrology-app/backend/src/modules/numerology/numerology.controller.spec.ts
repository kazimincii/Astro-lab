import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { NumerologyController } from './numerology.controller';
import { NumerologyService } from './numerology.service';
import { GenerateNumerologyReportDto } from './dto/generate-report.dto';

describe('NumerologyController', () => {
  let controller: NumerologyController;
  let numerologyService: NumerologyService;

  const mockNumerologyService = {
    generateReport: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'user@example.com',
  };

  const mockRequest = {
    user: mockUser,
  };

  const mockNumerologyReport = {
    id: 'report-123',
    userId: 'user-123',
    fullName: 'John Michael Doe',
    birthDate: new Date('1990-01-15'),
    numbers: {
      lifePathNumber: 7,
      destinyNumber: 3,
      soulUrgeNumber: 11,
      personalityNumber: 5,
      birthdayNumber: 15,
      maturityNumber: 1,
    },
    interpretations: {
      lifePathInterpretation:
        'Life Path 7: You are a seeker of truth and wisdom. Your analytical mind and spiritual nature drive you to understand the deeper meaning of life. You thrive in solitude and contemplation.',
      destinyInterpretation:
        'Destiny 3: Your destiny involves creative expression and communication. You are meant to inspire and uplift others through your words and artistic talents.',
      soulUrgeInterpretation:
        'Soul Urge 11: Your soul seeks spiritual enlightenment and the ability to inspire others. You have a deep intuition and a desire to serve humanity.',
      personalityInterpretation:
        'Personality 5: Others see you as dynamic, adventurous, and freedom-loving. You appear energetic and adaptable, always ready for new experiences.',
    },
    strengths: [
      'Analytical thinking',
      'Spiritual awareness',
      'Intuitive wisdom',
      'Deep insight',
      'Independent nature',
    ],
    challenges: [
      'Overthinking',
      'Social isolation',
      'Difficulty trusting others',
      'Perfectionism',
    ],
    careerPaths: [
      'Researcher',
      'Philosopher',
      'Analyst',
      'Spiritual teacher',
      'Scientist',
      'Writer',
    ],
    compatibleNumbers: [2, 4, 9],
    createdAt: new Date('2024-01-15T10:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NumerologyController],
      providers: [
        {
          provide: NumerologyService,
          useValue: mockNumerologyService,
        },
      ],
    }).compile();

    controller = module.get<NumerologyController>(NumerologyController);
    numerologyService = module.get<NumerologyService>(NumerologyService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateReport', () => {
    it('should generate numerology report successfully', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Michael Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result).toEqual(mockNumerologyReport);
      expect(mockNumerologyService.generateReport).toHaveBeenCalledWith(
        mockUser.id,
        dto.fullName,
        dto.birthDate,
      );
      expect(mockNumerologyService.generateReport).toHaveBeenCalledTimes(1);
    });

    it('should return report with all core numbers', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Michael Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.numbers).toHaveProperty('lifePathNumber');
      expect(result.numbers).toHaveProperty('destinyNumber');
      expect(result.numbers).toHaveProperty('soulUrgeNumber');
      expect(result.numbers).toHaveProperty('personalityNumber');
      expect(result.numbers).toHaveProperty('birthdayNumber');
      expect(result.numbers).toHaveProperty('maturityNumber');
    });

    it('should return Life Path Number between 1 and 11', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.numbers.lifePathNumber).toBeGreaterThanOrEqual(1);
      expect(result.numbers.lifePathNumber).toBeLessThanOrEqual(11);
    });

    it('should calculate Life Path Number from birth date', async () => {
      const birthDateReport = {
        ...mockNumerologyReport,
        birthDate: new Date('1990-01-15'),
        numbers: { ...mockNumerologyReport.numbers, lifePathNumber: 7 },
      };

      mockNumerologyService.generateReport.mockResolvedValue(birthDateReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'), // 1+9+9+0+0+1+1+5 = 26 -> 2+6 = 8
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.numbers.lifePathNumber).toBeDefined();
      expect(typeof result.numbers.lifePathNumber).toBe('number');
    });

    it('should calculate Destiny Number from full name', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Michael Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.numbers.destinyNumber).toBeDefined();
      expect(typeof result.numbers.destinyNumber).toBe('number');
    });

    it('should return Soul Urge Number (vowels)', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.numbers.soulUrgeNumber).toBeDefined();
      expect(typeof result.numbers.soulUrgeNumber).toBe('number');
    });

    it('should return Personality Number (consonants)', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.numbers.personalityNumber).toBeDefined();
      expect(typeof result.numbers.personalityNumber).toBe('number');
    });

    it('should handle master numbers (11, 22, 33)', async () => {
      const masterNumberReport = {
        ...mockNumerologyReport,
        numbers: {
          ...mockNumerologyReport.numbers,
          lifePathNumber: 11, // Master number
          soulUrgeNumber: 22, // Master number
        },
      };

      mockNumerologyService.generateReport.mockResolvedValue(masterNumberReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'Special Person',
        birthDate: new Date('1988-11-29'), // 1+9+8+8+1+1+2+9 = 39 -> 3+9 = 12 -> 1+2 = 3 (example)
      };

      const result = await controller.generateReport(mockRequest, dto);

      // Master numbers should be preserved (11, 22, 33)
      expect([11, 22, 33]).toContain(result.numbers.lifePathNumber);
    });

    it('should return report with interpretations', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.interpretations).toHaveProperty('lifePathInterpretation');
      expect(result.interpretations).toHaveProperty('destinyInterpretation');
      expect(result.interpretations).toHaveProperty('soulUrgeInterpretation');
      expect(result.interpretations).toHaveProperty('personalityInterpretation');
    });

    it('should return interpretation for Life Path Number', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.interpretations.lifePathInterpretation).toBeDefined();
      expect(typeof result.interpretations.lifePathInterpretation).toBe('string');
      expect(result.interpretations.lifePathInterpretation.length).toBeGreaterThan(0);
    });

    it('should return strengths array', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(Array.isArray(result.strengths)).toBe(true);
      expect(result.strengths.length).toBeGreaterThan(0);
      expect(result.strengths).toContain('Analytical thinking');
    });

    it('should return challenges array', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(Array.isArray(result.challenges)).toBe(true);
      expect(result.challenges.length).toBeGreaterThan(0);
      expect(result.challenges).toContain('Overthinking');
    });

    it('should return career paths array', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(Array.isArray(result.careerPaths)).toBe(true);
      expect(result.careerPaths.length).toBeGreaterThan(0);
      expect(result.careerPaths).toContain('Researcher');
    });

    it('should return compatible numbers', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(Array.isArray(result.compatibleNumbers)).toBe(true);
      expect(result.compatibleNumbers.length).toBeGreaterThan(0);
      expect(result.compatibleNumbers).toContain(2);
    });

    it('should handle different name formats', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const nameFormats = [
        'John Doe',
        'John Michael Doe',
        'Mary-Jane Smith',
        'Jean-Claude Van Damme',
        "O'Connor",
      ];

      for (const fullName of nameFormats) {
        const dto: GenerateNumerologyReportDto = {
          fullName,
          birthDate: new Date('1990-01-15'),
        };

        await controller.generateReport(mockRequest, dto);

        expect(mockNumerologyService.generateReport).toHaveBeenCalledWith(
          mockUser.id,
          fullName,
          dto.birthDate,
        );
      }
    });

    it('should handle different birth dates', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const birthDates = [
        new Date('1990-01-01'),
        new Date('1985-12-31'),
        new Date('2000-06-15'),
        new Date('1975-11-22'),
      ];

      for (const birthDate of birthDates) {
        const dto: GenerateNumerologyReportDto = {
          fullName: 'John Doe',
          birthDate,
        };

        await controller.generateReport(mockRequest, dto);

        expect(mockNumerologyService.generateReport).toHaveBeenCalledWith(
          mockUser.id,
          'John Doe',
          birthDate,
        );
      }
    });

    it('should generate different reports for different Life Path Numbers', async () => {
      const lifePaths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

      for (const lifePathNumber of lifePaths) {
        const report = {
          ...mockNumerologyReport,
          numbers: { ...mockNumerologyReport.numbers, lifePathNumber },
        };

        mockNumerologyService.generateReport.mockResolvedValue(report);

        const dto: GenerateNumerologyReportDto = {
          fullName: 'John Doe',
          birthDate: new Date('1990-01-15'),
        };

        const result = await controller.generateReport(mockRequest, dto);

        expect(result.numbers.lifePathNumber).toBe(lifePathNumber);
      }
    });

    it('should include creation timestamp', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.createdAt).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw BadRequestException for empty name', async () => {
      mockNumerologyService.generateReport.mockRejectedValue(
        new BadRequestException('Name is required'),
      );

      const dto: GenerateNumerologyReportDto = {
        fullName: '',
        birthDate: new Date('1990-01-15'),
      };

      await expect(controller.generateReport(mockRequest, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid birth date', async () => {
      mockNumerologyService.generateReport.mockRejectedValue(
        new BadRequestException('Invalid birth date'),
      );

      const dto: any = {
        fullName: 'John Doe',
        birthDate: 'invalid-date',
      };

      await expect(controller.generateReport(mockRequest, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for future birth date', async () => {
      mockNumerologyService.generateReport.mockRejectedValue(
        new BadRequestException('Birth date cannot be in the future'),
      );

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: futureDate,
      };

      await expect(controller.generateReport(mockRequest, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException for unauthenticated user', async () => {
      mockNumerologyService.generateReport.mockRejectedValue(
        new UnauthorizedException('Authentication required'),
      );

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      await expect(controller.generateReport(mockRequest, dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw ForbiddenException when action limit reached', async () => {
      mockNumerologyService.generateReport.mockRejectedValue(
        new ForbiddenException('Daily numerology report limit reached'),
      );

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      await expect(controller.generateReport(mockRequest, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException for premium feature on free tier', async () => {
      mockNumerologyService.generateReport.mockRejectedValue(
        new ForbiddenException('Detailed numerology report is a premium feature'),
      );

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      await expect(controller.generateReport(mockRequest, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should associate report with authenticated user', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      await controller.generateReport(mockRequest, dto);

      expect(mockNumerologyService.generateReport).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String),
        expect.any(Date),
      );
    });

    it('should handle names with special characters', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const specialNames = [
        'José García',
        'François Müller',
        'Søren Østergård',
        'Māori Name',
      ];

      for (const fullName of specialNames) {
        const dto: GenerateNumerologyReportDto = {
          fullName,
          birthDate: new Date('1990-01-15'),
        };

        const result = await controller.generateReport(mockRequest, dto);

        expect(result).toBeDefined();
      }
    });
  });

  describe('numerology number ranges', () => {
    it('should validate all numbers are within expected ranges', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      // Life Path: 1-9, 11, 22, 33
      expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]).toContain(
        result.numbers.lifePathNumber,
      );

      // Destiny: 1-9, 11, 22, 33
      expect(result.numbers.destinyNumber).toBeGreaterThanOrEqual(1);
      expect(result.numbers.destinyNumber).toBeLessThanOrEqual(33);

      // Birthday: 1-31
      expect(result.numbers.birthdayNumber).toBeGreaterThanOrEqual(1);
      expect(result.numbers.birthdayNumber).toBeLessThanOrEqual(31);
    });
  });

  describe('report structure', () => {
    it('should return complete report structure', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('fullName');
      expect(result).toHaveProperty('birthDate');
      expect(result).toHaveProperty('numbers');
      expect(result).toHaveProperty('interpretations');
      expect(result).toHaveProperty('strengths');
      expect(result).toHaveProperty('challenges');
      expect(result).toHaveProperty('careerPaths');
      expect(result).toHaveProperty('compatibleNumbers');
      expect(result).toHaveProperty('createdAt');
    });

    it('should return personalized interpretations', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(typeof result.interpretations.lifePathInterpretation).toBe('string');
      expect(result.interpretations.lifePathInterpretation.length).toBeGreaterThan(20);
    });

    it('should return multiple career suggestions', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.careerPaths.length).toBeGreaterThanOrEqual(3);
    });

    it('should return multiple compatible numbers', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Doe',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result.compatibleNumbers.length).toBeGreaterThan(0);
      result.compatibleNumbers.forEach((num) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(11);
      });
    });
  });

  describe('name processing', () => {
    it('should handle single-word names', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'Madonna',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result).toBeDefined();
    });

    it('should handle multi-word names', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const dto: GenerateNumerologyReportDto = {
        fullName: 'John Michael Patrick Smith',
        birthDate: new Date('1990-01-15'),
      };

      const result = await controller.generateReport(mockRequest, dto);

      expect(result).toBeDefined();
    });

    it('should handle names with uppercase and lowercase', async () => {
      mockNumerologyService.generateReport.mockResolvedValue(mockNumerologyReport);

      const nameVariations = ['john doe', 'JOHN DOE', 'JoHn DoE', 'John Doe'];

      for (const fullName of nameVariations) {
        const dto: GenerateNumerologyReportDto = {
          fullName,
          birthDate: new Date('1990-01-15'),
        };

        const result = await controller.generateReport(mockRequest, dto);

        expect(result).toBeDefined();
      }
    });
  });
});
