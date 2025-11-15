import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvancedChart, AdvancedChartType, ChartMode } from '../../entities/advanced-chart.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

@Injectable()
export class AdvancedChartsService {
  constructor(
    @InjectRepository(AdvancedChart)
    private chartRepository: Repository<AdvancedChart>,
    @InjectRepository(PersonProfile)
    private personRepository: Repository<PersonProfile>,
    @InjectRepository(BirthChart)
    private birthChartRepository: Repository<BirthChart>,
  ) {}

  async generateAdvancedChart(
    userId: string,
    chartType: AdvancedChartType,
    person1Id: string,
    person2Id?: string,
    targetDate?: Date,
    mode: ChartMode = ChartMode.BASIC,
  ): Promise<AdvancedChart> {
    const person1 = await this.personRepository.findOne({ where: { id: person1Id } });

    if (!person1) {
      throw new Error('Person not found');
    }

    let person2 = null;
    if (person2Id) {
      person2 = await this.personRepository.findOne({ where: { id: person2Id } });
      if (!person2) {
        throw new Error('Second person not found');
      }
    }

    const birthChart1 = await this.birthChartRepository.findOne({ where: { personId: person1Id } });
    let birthChart2 = null;
    if (person2Id) {
      birthChart2 = await this.birthChartRepository.findOne({ where: { personId: person2Id } });
    }

    // Generate chart data based on type
    const chartData = this.calculateChartData(chartType, birthChart1, birthChart2, targetDate);
    const interpretation = this.generateInterpretation(chartType, chartData, mode);

    const chart = this.chartRepository.create({
      userId,
      person1Id,
      person2Id,
      chartType,
      mode,
      targetDate,
      chartData,
      interpretation,
    });

    return await this.chartRepository.save(chart);
  }

  private calculateChartData(
    chartType: AdvancedChartType,
    chart1: any,
    chart2: any,
    targetDate?: Date,
  ): any {
    // This is a simplified version
    // In production, this would use Swiss Ephemeris or similar for accurate calculations

    switch (chartType) {
      case AdvancedChartType.TRANSIT:
        return this.calculateTransits(chart1, targetDate || new Date());
      case AdvancedChartType.PROGRESSED:
        return this.calculateProgressions(chart1, targetDate || new Date());
      case AdvancedChartType.SYNASTRY:
        return this.calculateSynastry(chart1, chart2);
      case AdvancedChartType.COMPOSITE:
        return this.calculateComposite(chart1, chart2);
      case AdvancedChartType.DAVISON:
        return this.calculateDavison(chart1, chart2);
      case AdvancedChartType.SOLAR_RETURN:
        return this.calculateSolarReturn(chart1, targetDate || new Date());
      case AdvancedChartType.LUNAR_RETURN:
        return this.calculateLunarReturn(chart1, targetDate || new Date());
      case AdvancedChartType.SOLAR_ARCS:
        return this.calculateSolarArcs(chart1, targetDate || new Date());
      default:
        return {};
    }
  }

  private calculateTransits(natalChart: any, date: Date): any {
    return {
      date,
      transitPlanets: {},
      aspects: [],
      summary: 'Current planetary transits to natal chart',
    };
  }

  private calculateProgressions(natalChart: any, date: Date): any {
    return {
      date,
      progressedPlanets: {},
      aspects: [],
      summary: 'Secondary progressions for current date',
    };
  }

  private calculateSynastry(chart1: any, chart2: any): any {
    return {
      interaspects: [],
      houseOverlays: [],
      summary: 'Synastry aspects between two charts',
    };
  }

  private calculateComposite(chart1: any, chart2: any): any {
    return {
      midpoints: {},
      compositePlanets: {},
      summary: 'Composite chart midpoints',
    };
  }

  private calculateDavison(chart1: any, chart2: any): any {
    return {
      davisonChart: {},
      summary: 'Davison relationship chart',
    };
  }

  private calculateSolarReturn(natalChart: any, date: Date): any {
    return {
      date,
      returnChart: {},
      summary: 'Solar return chart for the year',
    };
  }

  private calculateLunarReturn(natalChart: any, date: Date): any {
    return {
      date,
      returnChart: {},
      summary: 'Lunar return chart for the month',
    };
  }

  private calculateSolarArcs(natalChart: any, date: Date): any {
    return {
      date,
      arcedPlanets: {},
      summary: 'Solar arc directions',
    };
  }

  private generateInterpretation(chartType: AdvancedChartType, chartData: any, mode: ChartMode): string {
    if (mode === ChartMode.BASIC) {
      return `Basic interpretation of ${chartType} chart. The current planetary configurations suggest important themes and opportunities.`;
    } else {
      return `Detailed professional interpretation of ${chartType} chart with in-depth analysis of planetary aspects, house placements, and their implications for this period.`;
    }
  }

  async getUserCharts(userId: string, chartType?: AdvancedChartType): Promise<AdvancedChart[]> {
    const query: any = { userId };

    if (chartType) {
      query.chartType = chartType;
    }

    return await this.chartRepository.find({
      where: query,
      order: { createdAt: 'DESC' },
    });
  }

  async getChart(chartId: string): Promise<AdvancedChart | null> {
    return await this.chartRepository.findOne({ where: { id: chartId } });
  }
}
