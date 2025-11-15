import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'util';

type SwissephModule = typeof import('swisseph');

const loadSwisseph = (): SwissephModule | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
    return require('swisseph');
  } catch {
    return null;
  }
};

const swisseph = loadSwisseph();
const swe_calc_ut = swisseph ? promisify(swisseph.swe_calc_ut) : null;
const swe_houses_ex = swisseph ? promisify(swisseph.swe_houses_ex) : null;
const swe_get_planet_name = swisseph ? promisify(swisseph.swe_get_planet_name) : null;
const SWISSEPH_CONSTANTS = {
  SE_GREG_CAL: swisseph?.SE_GREG_CAL ?? 1,
  SEFLG_SWIEPH: swisseph?.SEFLG_SWIEPH ?? 2,
};

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
  private readonly logger = new Logger(EphemerisService.name);

  private readonly hasNativeEphemeris = Boolean(
    swisseph && swe_calc_ut && swe_houses_ex && swe_get_planet_name,
  );

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

  private readonly fallbackPlanetOrder = [
    { planet: 'Sun', id: Planet.SUN },
    { planet: 'Moon', id: Planet.MOON },
    { planet: 'Mercury', id: Planet.MERCURY },
    { planet: 'Venus', id: Planet.VENUS },
    { planet: 'Mars', id: Planet.MARS },
    { planet: 'Jupiter', id: Planet.JUPITER },
    { planet: 'Saturn', id: Planet.SATURN },
    { planet: 'Uranus', id: Planet.URANUS },
    { planet: 'Neptune', id: Planet.NEPTUNE },
    { planet: 'Pluto', id: Planet.PLUTO },
    { planet: 'True Node', id: Planet.TRUE_NODE },
    { planet: 'Chiron', id: Planet.CHIRON },
  ];

  constructor() {
    if (swisseph && this.hasNativeEphemeris) {
      try {
        // Set ephemeris path (use default path or custom)
        swisseph.swe_set_ephe_path(__dirname + '/../../ephemeris');
      } catch (error) {
        this.logger.warn('Unable to configure Swiss Ephemeris path, falling back to placeholder data.');
      }
    } else {
      this.logger.warn(
        'Swiss Ephemeris native module is not installed. Using deterministic placeholder calculations until the native dependency is available.',
      );
    }
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
    if (!this.hasNativeEphemeris) {
      return this.generateFallbackChart(birthDate, birthTime, latitude, longitude, houseSystem);
    }

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
    if (!this.hasNativeEphemeris) {
      return this.generateFallbackPlanets(this.createSeed(date, '12:00', 0, 0));
    }
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
    if (!this.hasNativeEphemeris) {
      return this.generateFallbackPlanets(
        this.createSeed(progressedDate, birthTime, 0, 0),
      );
    }
    return await this.calculatePlanets(julianDay);
  }

  /**
   * Calculate planets for a given Julian Day
   */
  private async calculatePlanets(julianDay: number): Promise<PlanetPosition[]> {
    if (!swe_calc_ut || !swe_get_planet_name) {
      throw new Error('Swiss Ephemeris native module is not installed.');
    }

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
        const result = await swe_calc_ut(
          julianDay,
          planetId,
          SWISSEPH_CONSTANTS.SEFLG_SWIEPH,
        );
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
    if (!swe_houses_ex) {
      throw new Error('Swiss Ephemeris native module is not installed.');
    }

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

    if (swisseph) {
      return swisseph.swe_julday(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        decimalTime,
        SWISSEPH_CONSTANTS.SE_GREG_CAL,
      );
    }

    return this.computeJulianDay(date, decimalTime);
  }

  /**
   * Get moon phase
   */
  async getMoonPhase(date: Date = new Date()): Promise<{
    phase: string;
    illumination: number;
    angle: number;
  }> {
    if (!this.hasNativeEphemeris) {
      return this.getFallbackMoonPhase(date);
    }

    const julianDay = this.dateToJulianDay(date, '12:00');

    const sun = await swe_calc_ut(julianDay, Planet.SUN, SWISSEPH_CONSTANTS.SEFLG_SWIEPH);
    const moon = await swe_calc_ut(julianDay, Planet.MOON, SWISSEPH_CONSTANTS.SEFLG_SWIEPH);

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

  private computeJulianDay(date: Date, decimalTime: number): number {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const jd =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5 +
      (decimalTime - 12) / 24;

    return jd;
  }

  private generateFallbackChart(
    birthDate: Date,
    birthTime: string,
    latitude: number,
    longitude: number,
    houseSystem: HouseSystem,
  ): BirthChart {
    const seed = this.createSeed(birthDate, birthTime, latitude, longitude);
    const planets = this.generateFallbackPlanets(seed);
    const houses = this.generateFallbackHouses(seed, houseSystem);
    const ascendant = houses[0]?.cusp ?? 0;
    const midheaven = houses[9]?.cusp ?? this.normalizeAngle(ascendant + 90);
    const aspects = this.calculateAspects(planets);

    return {
      planets,
      houses,
      ascendant,
      midheaven,
      aspects,
      metadata: {
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone: 'UTC',
        houseSystem,
      },
    };
  }

  private generateFallbackPlanets(seed: number): PlanetPosition[] {
    return this.fallbackPlanetOrder.map((entry, index) => {
      const longitude = this.normalizeAngle(seed * 0.017 + index * 27.3 + (seed % 11));
      const latitude = ((seed % 20) - 10) / 5;
      const distance = 1 + ((seed + index * 13) % 100) / 500;
      const speedLongitude = (((seed >> (index % 5)) % 10) - 5) / 20;
      const signIndex = Math.floor(longitude / 30) % 12;

      return {
        planet: entry.planet,
        planetId: entry.id,
        longitude: Math.round(longitude * 100) / 100,
        latitude: Math.round(latitude * 100) / 100,
        distance: Math.round(distance * 1000) / 1000,
        speedLongitude: Math.round(speedLongitude * 1000) / 1000,
        sign: this.zodiacSigns[signIndex],
        signDegree: Math.round((longitude % 30) * 100) / 100,
        retrograde: ((seed + index) & 1) === 0,
        house: ((index % 12) + 1) as number,
      };
    });
  }

  private generateFallbackHouses(seed: number, houseSystem: HouseSystem): HousePosition[] {
    const start = this.normalizeAngle((seed % 360) + houseSystem.charCodeAt(0));
    const houses: HousePosition[] = [];

    for (let i = 0; i < 12; i++) {
      const cusp = this.normalizeAngle(start + i * 30);
      const signIndex = Math.floor(cusp / 30) % 12;
      houses.push({
        house: i + 1,
        cusp: Math.round(cusp * 100) / 100,
        sign: this.zodiacSigns[signIndex],
        signDegree: Math.round((cusp % 30) * 100) / 100,
      });
    }

    return houses;
  }

  private getFallbackMoonPhase(date: Date) {
    const seed = this.createSeed(date, '12:00', 0, 0);
    const angle = this.normalizeAngle(seed % 360);
    const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2;
    const phaseRanges = [
      { label: 'New Moon', max: 45 },
      { label: 'Waxing Crescent', max: 90 },
      { label: 'First Quarter', max: 135 },
      { label: 'Waxing Gibbous', max: 180 },
      { label: 'Full Moon', max: 225 },
      { label: 'Waning Gibbous', max: 270 },
      { label: 'Last Quarter', max: 315 },
      { label: 'Waning Crescent', max: 360 },
    ];

    const phase = phaseRanges.find(range => angle < range.max)?.label ?? 'New Moon';

    return {
      phase,
      illumination: Math.round(illumination * 100),
      angle: Math.round(angle * 100) / 100,
    };
  }

  private createSeed(
    date: Date,
    time: string,
    latitude: number,
    longitude: number,
  ) {
    const [hours, minutes] = time.split(':').map(Number);
    return (
      date.getUTCFullYear() * 1000 +
      (date.getUTCMonth() + 1) * 100 +
      date.getUTCDate() * 10 +
      hours * 2 +
      Math.round(minutes / 30) +
      Math.round(latitude * 10) +
      Math.round(longitude * 10)
    );
  }

  private normalizeAngle(value: number) {
    const normalized = value % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }
}
