import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WidgetConfig, WidgetType } from '../../entities/widget-config.entity';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(WidgetConfig)
    private widgetRepository: Repository<WidgetConfig>,
  ) {}

  async getUserWidgets(userId: string): Promise<WidgetConfig[]> {
    return await this.widgetRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getWidget(userId: string, widgetType: WidgetType): Promise<WidgetConfig | null> {
    return await this.widgetRepository.findOne({
      where: { userId, widgetType },
    });
  }

  async createOrUpdateWidget(
    userId: string,
    widgetType: WidgetType,
    data: any,
  ): Promise<WidgetConfig> {
    let widget = await this.getWidget(userId, widgetType);

    if (widget) {
      widget.data = data;
      widget.isEnabled = true;
    } else {
      widget = this.widgetRepository.create({
        userId,
        widgetType,
        data,
        isEnabled: true,
      });
    }

    return await this.widgetRepository.save(widget);
  }

  async toggleWidget(userId: string, widgetType: WidgetType, isEnabled: boolean): Promise<WidgetConfig> {
    const widget = await this.getWidget(userId, widgetType);

    if (!widget) {
      throw new Error('Widget not found');
    }

    widget.isEnabled = isEnabled;
    return await this.widgetRepository.save(widget);
  }

  async deleteWidget(userId: string, widgetType: WidgetType): Promise<void> {
    await this.widgetRepository.delete({ userId, widgetType });
  }

  async getWidgetData(userId: string, widgetType: WidgetType): Promise<any> {
    const widget = await this.getWidget(userId, widgetType);

    if (!widget || !widget.isEnabled) {
      return null;
    }

    // Generate widget-specific data
    switch (widgetType) {
      case WidgetType.MOON_PHASE:
        return this.generateMoonPhaseData();
      case WidgetType.STAR_MESSAGE:
        return this.generateStarMessageData(widget.data.primaryPersonId);
      case WidgetType.TODAY_SUMMARY:
        return this.generateTodaySummaryData(widget.data.primaryPersonId);
      default:
        return widget.data;
    }
  }

  private generateMoonPhaseData() {
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
                    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const dayOfMonth = new Date().getDate();
    const phaseIndex = Math.floor((dayOfMonth / 30) * 8) % 8;
    const signIndex = Math.floor((new Date().getMonth() * 2.5 + dayOfMonth / 12)) % 12;

    return {
      phase: phases[phaseIndex],
      sign: signs[signIndex],
      illumination: Math.round(Math.abs(Math.sin((dayOfMonth / 29.5) * Math.PI)) * 100),
    };
  }

  private generateStarMessageData(personId: string) {
    return {
      message: "Trust the universe's timing today.",
      theme: "Divine Timing",
    };
  }

  private generateTodaySummaryData(personId: string) {
    return {
      summary: "A day of balance and new opportunities.",
      score: 8,
    };
  }
}
