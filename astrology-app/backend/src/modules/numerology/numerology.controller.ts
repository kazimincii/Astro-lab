import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NumerologyService } from './numerology.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateNumerologyReportDto } from './dto/generate-report.dto';

@ApiTags('numerology')
@ApiBearerAuth('JWT-auth')
@Controller('numerology')
@UseGuards(JwtAuthGuard)
export class NumerologyController {
  constructor(private numerologyService: NumerologyService) {}

  @Post('report')
  @ApiOperation({
    summary: 'Generate numerology report',
    description: 'Generate a comprehensive numerology report based on name and birth date. Calculates life path number, destiny number, soul urge, and more.',
  })
  @ApiResponse({
    status: 201,
    description: 'Numerology report generated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        fullName: { type: 'string', example: 'John Michael Doe' },
        birthDate: { type: 'string', format: 'date', example: '1990-01-15' },
        numbers: {
          type: 'object',
          properties: {
            lifePathNumber: { type: 'number', example: 7 },
            destinyNumber: { type: 'number', example: 3 },
            soulUrgeNumber: { type: 'number', example: 11 },
            personalityNumber: { type: 'number', example: 5 },
            birthdayNumber: { type: 'number', example: 15 },
            maturityNumber: { type: 'number', example: 1 },
          },
        },
        interpretations: {
          type: 'object',
          properties: {
            lifePathInterpretation: { type: 'string', example: 'You are a seeker of truth and wisdom...' },
            destinyInterpretation: { type: 'string', example: 'Your destiny involves creative expression...' },
            soulUrgeInterpretation: { type: 'string', example: 'Your soul seeks spiritual enlightenment...' },
            personalityInterpretation: { type: 'string', example: 'Others see you as dynamic and adventurous...' },
          },
        },
        strengths: { type: 'array', items: { type: 'string' }, example: ['Analytical', 'Spiritual', 'Intuitive'] },
        challenges: { type: 'array', items: { type: 'string' }, example: ['Overthinking', 'Isolation'] },
        careerPaths: { type: 'array', items: { type: 'string' }, example: ['Researcher', 'Philosopher', 'Analyst'] },
        compatibleNumbers: { type: 'array', items: { type: 'number' }, example: [2, 4, 9] },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid name or birth date' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached or premium feature' })
  async generateReport(@Request() req, @Body() body: GenerateNumerologyReportDto) {
    return this.numerologyService.generateReport(req.user.id, body.fullName, body.birthDate);
  }
}
