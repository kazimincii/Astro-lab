import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonProfile } from '../../entities/person-profile.entity';
import { StarMessage } from '../../entities/star-message.entity';
import { AstroEvent } from '../../entities/astro-event.entity';
import { CalendarEntry, CalendarCategory } from '../../entities/calendar-entry.entity';
import { ForecastsService } from '../forecasts/forecasts.service';

@Injectable()
export class TodayService {
  constructor(
    @InjectRepository(PersonProfile)
    private profileRepository: Repository<PersonProfile>,
    @InjectRepository(StarMessage)
    private starMessageRepository: Repository<StarMessage>,
    @InjectRepository(AstroEvent)
    private astroEventRepository: Repository<AstroEvent>,
    @InjectRepository(CalendarEntry)
    private calendarRepository: Repository<CalendarEntry>,
    private forecastsService: ForecastsService,
  ) {}

  async getTodaySummary(userId: string, profileId?: string) {
    // Get primary profile or specified profile
    let profile: PersonProfile;

    if (profileId) {
      profile = await this.profileRepository.findOne({ where: { id: profileId } });
    } else {
      profile = await this.profileRepository.findOne({
        where: { owner: { id: userId }, isMainProfile: true },
        order: { createdAt: 'ASC' },
      });
    }

    if (!profile) {
      throw new Error('Profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get daily forecast
    const forecast = await this.forecastsService.getTodayForecast(profile.id);

    // Get star message
    const starMessage = await this.getOrCreateStarMessage(profile.id, today);

    // Get today's major events
    const events = await this.getTodayEvents();

    // Get calendar summaries
    const calendars = await this.getTodayCalendars(today);

    // Moon phase calculation (simplified)
    const moonData = this.calculateMoonData(today);

    return {
      profile: {
        id: profile.id,
        name: profile.name,
        sunSign: profile.sunSign,
      },
      date: today.toISOString().split('T')[0],
      forecast: {
        general: forecast.generalForecast,
        love: forecast.loveForecast,
        career: forecast.careerForecast,
        health: forecast.healthForecast,
        scores: {
          overall: forecast.overallScore,
          love: forecast.loveScore,
          career: forecast.careerScore,
          health: forecast.healthScore,
        },
        luckyNumbers: forecast.luckyNumbers,
        luckyColor: forecast.luckyColor,
        luckyGem: forecast.luckyGem,
      },
      starMessage: {
        message: starMessage.message,
        theme: starMessage.theme,
        keywords: starMessage.keywords,
      },
      moon: moonData,
      keyTransit: events.length > 0 ? {
        title: events[0].title,
        description: events[0].description,
        type: events[0].type,
      } : null,
      calendars: {
        beauty: calendars.beauty,
        health: calendars.health,
        activity: calendars.activity,
        spiritual: calendars.spiritual,
      },
      upcomingEvents: events.slice(0, 3).map(e => ({
        title: e.title,
        date: e.startDate,
        type: e.type,
      })),
    };
  }

  private async getOrCreateStarMessage(personId: string, date: Date): Promise<StarMessage> {
    let message = await this.starMessageRepository.findOne({
      where: { personId, date },
    });

    if (!message) {
      message = await this.generateStarMessage(personId, date);
    }

    return message;
  }

  private async generateStarMessage(personId: string, date: Date): Promise<StarMessage> {
    const messages = [
      {
        message: "Today's cosmic energy invites you to trust your intuition and embrace spontaneity. The stars align to support your authentic expression.",
        theme: "Authenticity",
        keywords: ["intuition", "spontaneity", "expression"],
      },
      {
        message: "The universe whispers wisdom through quiet moments today. Pause, listen, and allow divine guidance to illuminate your path forward.",
        theme: "Divine Guidance",
        keywords: ["wisdom", "guidance", "patience"],
      },
      {
        message: "Your creative power is amplified today. Channel this energy into projects that light up your soul and inspire those around you.",
        theme: "Creative Power",
        keywords: ["creativity", "inspiration", "energy"],
      },
    ];

    const seed = date.getDate() + date.getMonth();
    const selected = messages[seed % messages.length];

    const starMessage = this.starMessageRepository.create({
      personId,
      date,
      message: selected.message,
      theme: selected.theme,
      keywords: selected.keywords,
      context: {
        moonPhase: this.calculateMoonData(date).phase,
      },
    });

    return await this.starMessageRepository.save(starMessage);
  }

  private async getTodayEvents(): Promise<AstroEvent[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.astroEventRepository.find({
      where: { isActive: true },
      order: { importance: 'DESC', startDate: 'ASC' },
      take: 5,
    });
  }

  private async getTodayCalendars(date: Date) {
    const entries = await this.calendarRepository.find({
      where: { date },
    });

    const result: any = {};

    for (const entry of entries) {
      result[entry.category] = {
        rating: entry.rating,
        tip: entry.tip,
      };
    }

    return result;
  }

  private calculateMoonData(date: Date) {
    // Simplified moon calculation
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
                    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const dayOfMonth = date.getDate();
    const phaseIndex = Math.floor((dayOfMonth / 30) * 8) % 8;
    const signIndex = Math.floor((date.getMonth() * 2.5 + dayOfMonth / 12)) % 12;

    return {
      phase: phases[phaseIndex],
      sign: signs[signIndex],
      illumination: Math.abs(Math.sin((dayOfMonth / 29.5) * Math.PI)) * 100,
    };
  }
}
