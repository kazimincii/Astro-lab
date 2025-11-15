import { Injectable } from '@nestjs/common';
import * as swisseph from 'swisseph';
import { promisify } from 'util';

// Promisify Swiss Ephemeris functions
const swe_calc_ut = promisify(swisseph.swe_calc_ut);
const swe_houses_ex = promisify(swisseph.swe_houses_ex);
const swe_get_planet_name = promisify(swisseph.swe_get_planet_name);

export enum Planet {
  SUN = 0,
  MOON = 1,
  MERCURY = 2,
  VENUS = 3,
  MARS = 4,
  JUPITER = 5,
  SATURN = 6,
  URANUS = 7,
  NEPTUNE = 8,
  PLUTO = 9,
  TRUE_NODE = 11,
  CHIRON = 15,
}

export enum HouseSystem {
  PLACIDUS = 'P',
  KOCH = 'K',
  EQUAL = 'E',
  CAMPANUS = 'C',
  WHOLE_SIGN = 'W',
}

export interface PlanetPosition {
  planet: string;
  planetId: number;
  longitude: number;
  latitude: number;
  distance: number;
  speedLongitude: number;
  sign: string;
  signDegree: number;
  retrograde: boolean;
  house?: number;
}

export interface HousePosition {
  house: number;
  cusp: number;
  sign: string;
  signDegree: number;
}

export interface BirthChart {
  planets: PlanetPosition[];
  houses: HousePosition[];
  ascendant: number;
  midheaven: number;
  aspects: Aspect[];
  metadata: {
    birthDate: Date;
    birthTime: string;
    latitude: number;
    longitude: number;
    timezone: string;
    houseSystem: HouseSystem;
  };
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string; // conjunction, opposition, trine, square, sextile
  angle: number;
  orb: number;
  applying: boolean;
}

@Injectable()
export class EphemerisService {
  private readonly zodiacSigns = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  private readonly aspectTypes = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Square', angle: 90, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 6 },
    { name: 'Quincunx', angle: 150, orb: 3 },
    { name: 'Semi-Sextile', angle: 30, orb: 2 },
    { name: 'Semi-Square', angle: 45, orb: 2 },
    { name: 'Sesqui-Square', angle: 135, orb: 2 },
  ];

  constructor() {
    // Set ephemeris path (use default path or custom)
    swisseph.swe_set_ephe_path(__dirname + '/../../ephemeris');
  }

  /**
   * Calculate birth chart for given date, time and location
   */
  async calculateBirthChart(
    birthDate: Date,
    birthTime: string,
    latitude: number,
    longitude: number,
    houseSystem: HouseSystem = HouseSystem.PLACIDUS,
  ): Promise<BirthChart> {
    const julianDay = this.dateToJulianDay(birthDate, birthTime);

    // Calculate planet positions
    const planets = await this.calculatePlanets(julianDay);

    // Calculate houses
    const { houses, ascendant, midheaven } = await this.calculateHouses(
      julianDay,
      latitude,
      longitude,
      houseSystem,
    );

    // Assign houses to planets
    const planetsWithHouses = this.assignHousesToPlanets(planets, houses);

    // Calculate aspects
    const aspects = this.calculateAspects(planetsWithHouses);

    return {
      planets: planetsWithHouses,
      houses,
      ascendant,
      midheaven,
      aspects,
      metadata: {
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone: 'UTC', // Should be passed as parameter in real implementation
        houseSystem,
      },
    };
  }

  /**
   * Calculate current transits
   */
  async calculateTransits(date: Date = new Date()): Promise<PlanetPosition[]> {
    const julianDay = this.dateToJulianDay(date, '12:00');
    return await this.calculatePlanets(julianDay);
  }

  /**
   * Calculate progressed chart
   */
  async calculateProgressedChart(
    birthDate: Date,
    birthTime: string,
    progressionDate: Date,
  ): Promise<PlanetPosition[]> {
    // Secondary progressions: 1 day = 1 year
    const daysSinceBirth =
      (progressionDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
    const progressedDate = new Date(birthDate.getTime() + daysSinceBirth * 24 * 60 * 60 * 1000);

    const julianDay = this.dateToJulianDay(progressedDate, birthTime);
    return await this.calculatePlanets(julianDay);
  }

  /**
   * Calculate planets for a given Julian Day
   */
  private async calculatePlanets(julianDay: number): Promise<PlanetPosition[]> {
    const planetsToCalculate = [
      Planet.SUN,
      Planet.MOON,
      Planet.MERCURY,
      Planet.VENUS,
      Planet.MARS,
      Planet.JUPITER,
      Planet.SATURN,
      Planet.URANUS,
      Planet.NEPTUNE,
      Planet.PLUTO,
      Planet.TRUE_NODE,
      Planet.CHIRON,
    ];

    const results: PlanetPosition[] = [];

    for (const planetId of planetsToCalculate) {
      try {
        const result = await swe_calc_ut(julianDay, planetId, swisseph.SEFLG_SWIEPH);
        const planetName = await swe_get_planet_name(planetId);

        const longitude = result.longitude;
        const signIndex = Math.floor(longitude / 30);
        const signDegree = longitude % 30;

        results.push({
          planet: planetName,
          planetId,
          longitude: result.longitude,
          latitude: result.latitude,
          distance: result.distance,
          speedLongitude: result.longitudeSpeed,
          sign: this.zodiacSigns[signIndex],
          signDegree: Math.round(signDegree * 100) / 100,
          retrograde: result.longitudeSpeed < 0,
        });
      } catch (error) {
        console.error(`Error calculating planet ${planetId}:`, error);
      }
    }

    return results;
  }

  /**
   * Calculate houses for given time and location
   */
  private async calculateHouses(
    julianDay: number,
    latitude: number,
    longitude: number,
    houseSystem: HouseSystem,
  ): Promise<{
    houses: HousePosition[];
    ascendant: number;
    midheaven: number;
  }> {
    try {
      const result = await swe_houses_ex(julianDay, latitude, longitude, houseSystem);

      const houses: HousePosition[] = [];
      for (let i = 0; i < 12; i++) {
        const cusp = result.houses[i];
        const signIndex = Math.floor(cusp / 30);
        const signDegree = cusp % 30;

        houses.push({
          house: i + 1,
          cusp,
          sign: this.zodiacSigns[signIndex],
          signDegree: Math.round(signDegree * 100) / 100,
        });
      }

      return {
        houses,
        ascendant: result.ascendant,
        midheaven: result.mc,
      };
    } catch (error) {
      console.error('Error calculating houses:', error);
      throw error;
    }
  }

  /**
   * Assign house positions to planets
   */
  private assignHousesToPlanets(
    planets: PlanetPosition[],
    houses: HousePosition[],
  ): PlanetPosition[] {
    return planets.map((planet) => {
      const house = this.findHouseForLongitude(planet.longitude, houses);
      return { ...planet, house };
    });
  }

  /**
   * Find which house a given longitude falls into
   */
  private findHouseForLongitude(longitude: number, houses: HousePosition[]): number {
    for (let i = 0; i < houses.length; i++) {
      const currentCusp = houses[i].cusp;
      const nextCusp = houses[(i + 1) % 12].cusp;

      if (nextCusp > currentCusp) {
        if (longitude >= currentCusp && longitude < nextCusp) {
          return i + 1;
        }
      } else {
        // Handle wrap-around at 360°
        if (longitude >= currentCusp || longitude < nextCusp) {
          return i + 1;
        }
      }
    }
    return 1; // Default to first house
  }

  /**
   * Calculate aspects between planets
   */
  private calculateAspects(planets: PlanetPosition[]): Aspect[] {
    const aspects: Aspect[] = [];

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];

        const angle = this.calculateAngle(planet1.longitude, planet2.longitude);

        for (const aspectType of this.aspectTypes) {
          const orb = Math.abs(angle - aspectType.angle);

          if (orb <= aspectType.orb) {
            const applying = this.isAspectApplying(planet1, planet2, aspectType.angle);

            aspects.push({
              planet1: planet1.planet,
              planet2: planet2.planet,
              type: aspectType.name,
              angle: aspectType.angle,
              orb: Math.round(orb * 100) / 100,
              applying,
            });
            break; // Only one aspect per planet pair
          }
        }
      }
    }

    return aspects;
  }

  /**
   * Calculate angle between two longitudes
   */
  private calculateAngle(lon1: number, lon2: number): number {
    let angle = Math.abs(lon1 - lon2);
    if (angle > 180) {
      angle = 360 - angle;
    }
    return angle;
  }

  /**
   * Determine if aspect is applying or separating
   */
  private isAspectApplying(
    planet1: PlanetPosition,
    planet2: PlanetPosition,
    aspectAngle: number,
  ): boolean {
    // Simplified: check if planets are moving towards exact aspect
    const currentAngle = this.calculateAngle(planet1.longitude, planet2.longitude);

    // Calculate future positions (rough approximation)
    const future1 = planet1.longitude + planet1.speedLongitude;
    const future2 = planet2.longitude + planet2.speedLongitude;
    const futureAngle = this.calculateAngle(future1, future2);

    // Applying if future angle is closer to aspect angle
    return Math.abs(futureAngle - aspectAngle) < Math.abs(currentAngle - aspectAngle);
  }

  /**
   * Convert date and time to Julian Day
   */
  private dateToJulianDay(date: Date, time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    const decimalTime = hours + minutes / 60;

    return swisseph.swe_julday(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      decimalTime,
      swisseph.SE_GREG_CAL,
    );
  }

  /**
   * Get moon phase
   */
  async getMoonPhase(date: Date = new Date()): Promise<{
    phase: string;
    illumination: number;
    angle: number;
  }> {
    const julianDay = this.dateToJulianDay(date, '12:00');

    const sun = await swe_calc_ut(julianDay, Planet.SUN, swisseph.SEFLG_SWIEPH);
    const moon = await swe_calc_ut(julianDay, Planet.MOON, swisseph.SEFLG_SWIEPH);

    const angle = (moon.longitude - sun.longitude + 360) % 360;
    const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2;

    let phase = '';
    if (angle < 45) phase = 'New Moon';
    else if (angle < 90) phase = 'Waxing Crescent';
    else if (angle < 135) phase = 'First Quarter';
    else if (angle < 180) phase = 'Waxing Gibbous';
    else if (angle < 225) phase = 'Full Moon';
    else if (angle < 270) phase = 'Waning Gibbous';
    else if (angle < 315) phase = 'Last Quarter';
    else phase = 'Waning Crescent';

    return {
      phase,
      illumination: Math.round(illumination * 100),
      angle: Math.round(angle * 100) / 100,
    };
  }
}
