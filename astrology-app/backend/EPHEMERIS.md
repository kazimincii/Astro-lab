# Swiss Ephemeris Integration Guide

This document explains how the Swiss Ephemeris library is integrated into the Astrology Super-App for accurate astronomical calculations.

## Overview

Swiss Ephemeris is a high-precision astronomical ephemeris library that provides:
- Planetary positions
- House calculations
- Aspect calculations
- Moon phases
- Eclipse calculations
- And much more

## Installation

The Swiss Ephemeris package is already included in package.json:

```json
{
  "dependencies": {
    "swisseph": "^2.10.3"
  }
}
```

## Ephemeris Data Files

Swiss Ephemeris requires ephemeris data files for accurate calculations. These files are not included in the repository due to their size.

### Download Ephemeris Files

1. Create ephemeris directory:
```bash
mkdir -p backend/ephemeris
```

2. Download data files from Swiss Ephemeris website:
   - Visit: https://www.astro.com/ftp/swisseph/ephe/
   - Download files for your needs:
     - `seas_18.se1` - Main asteroid file
     - `semo_18.se1` - Moon file
     - `sepl_18.se1` - Planet file

3. Place files in `backend/ephemeris/` directory

### Alternative: Use Default Path

Swiss Ephemeris can also use system-wide ephemeris files if installed:
```bash
# On macOS with Homebrew
brew install swisseph

# On Linux
sudo apt-get install libswe-dev
```

## Usage

### EphemerisService

The `EphemerisService` provides high-level methods for astrological calculations:

```typescript
import { EphemerisService, HouseSystem } from './services/ephemeris.service';

// Inject the service
constructor(private ephemerisService: EphemerisService) {}

// Calculate birth chart
const chart = await this.ephemerisService.calculateBirthChart(
  new Date('1990-01-15'),
  '14:30',
  40.7128,  // latitude
  -74.0060, // longitude
  HouseSystem.PLACIDUS
);

// Get current transits
const transits = await this.ephemerisService.calculateTransits();

// Get moon phase
const moonPhase = await this.ephemerisService.getMoonPhase();

// Calculate progressed chart
const progressed = await this.ephemerisService.calculateProgressedChart(
  birthDate,
  birthTime,
  new Date() // progression date
);
```

### Available Methods

#### calculateBirthChart()
Calculates complete natal chart including:
- Planet positions (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, Chiron)
- House cusps
- Ascendant (Rising Sign)
- Midheaven (MC)
- Major aspects between planets

```typescript
const chart: BirthChart = await ephemerisService.calculateBirthChart(
  birthDate: Date,
  birthTime: string,  // Format: "HH:MM"
  latitude: number,
  longitude: number,
  houseSystem?: HouseSystem  // Default: PLACIDUS
);
```

#### calculateTransits()
Gets current planetary positions:

```typescript
const transits: PlanetPosition[] = await ephemerisService.calculateTransits(
  date?: Date  // Optional, defaults to now
);
```

#### calculateProgressedChart()
Calculates secondary progressions (1 day = 1 year):

```typescript
const progressed: PlanetPosition[] = await ephemerisService.calculateProgressedChart(
  birthDate: Date,
  birthTime: string,
  progressionDate: Date
);
```

#### getMoonPhase()
Gets current moon phase and illumination:

```typescript
const phase = await ephemerisService.getMoonPhase(date?: Date);
// Returns: { phase: string, illumination: number, angle: number }
```

## Data Structures

### PlanetPosition
```typescript
interface PlanetPosition {
  planet: string;           // Planet name
  planetId: number;         // Swiss Ephemeris ID
  longitude: number;        // Ecliptic longitude (0-360°)
  latitude: number;         // Ecliptic latitude
  distance: number;         // Distance from Earth (AU)
  speedLongitude: number;   // Speed in longitude (°/day)
  sign: string;             // Zodiac sign
  signDegree: number;       // Degree within sign (0-30°)
  retrograde: boolean;      // Is planet retrograde?
  house?: number;           // House position (1-12)
}
```

### Aspect
```typescript
interface Aspect {
  planet1: string;         // First planet
  planet2: string;         // Second planet
  type: string;            // Conjunction, Opposition, Trine, Square, Sextile, etc.
  angle: number;           // Exact aspect angle
  orb: number;             // Orb (deviation from exact)
  applying: boolean;       // Is aspect applying or separating?
}
```

### BirthChart
```typescript
interface BirthChart {
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
```

## House Systems

Supported house systems:

```typescript
enum HouseSystem {
  PLACIDUS = 'P',    // Most common
  KOCH = 'K',
  EQUAL = 'E',
  CAMPANUS = 'C',
  WHOLE_SIGN = 'W',
}
```

## Planets

Calculated planets:

- **Sun** (0)
- **Moon** (1)
- **Mercury** (2)
- **Venus** (3)
- **Mars** (4)
- **Jupiter** (5)
- **Saturn** (6)
- **Uranus** (7)
- **Neptune** (8)
- **Pluto** (9)
- **True Node** (11)
- **Chiron** (15)

## Aspects

Calculated aspects with default orbs:

- **Conjunction** (0°, orb: 8°)
- **Opposition** (180°, orb: 8°)
- **Trine** (120°, orb: 8°)
- **Square** (90°, orb: 8°)
- **Sextile** (60°, orb: 6°)
- **Quincunx** (150°, orb: 3°)
- **Semi-Sextile** (30°, orb: 2°)
- **Semi-Square** (45°, orb: 2°)
- **Sesqui-Square** (135°, orb: 2°)

## Integration with Modules

### Charts Module

Update ChartsService to use EphemerisService:

```typescript
import { EphemerisService } from '../../services/ephemeris.service';

@Injectable()
export class ChartsService {
  constructor(
    private ephemerisService: EphemerisService,
    // ... other dependencies
  ) {}

  async generateBirthChart(profile: PersonProfile) {
    const chart = await this.ephemerisService.calculateBirthChart(
      profile.birthDate,
      profile.birthTime,
      profile.latitude,
      profile.longitude,
    );

    // Store chart data
    // Generate interpretations
    // Return formatted result
  }
}
```

### Today Module

For daily planetary positions:

```typescript
async getTodayTransits() {
  const transits = await this.ephemerisService.calculateTransits();
  const moonPhase = await this.ephemerisService.getMoonPhase();

  return {
    transits,
    moonPhase,
  };
}
```

## Performance Considerations

1. **Caching**: Cache calculated charts to avoid redundant calculations
2. **Lazy Loading**: Load ephemeris files on demand
3. **Background Jobs**: Use queue for heavy calculations
4. **Database Storage**: Store calculated results for reuse

## Error Handling

```typescript
try {
  const chart = await ephemerisService.calculateBirthChart(...);
} catch (error) {
  if (error.message.includes('ephemeris file')) {
    throw new InternalServerErrorException('Ephemeris data files not found');
  }
  throw error;
}
```

## Testing

Test with known birth data:

```typescript
describe('EphemerisService', () => {
  it('should calculate accurate planetary positions', async () => {
    const chart = await service.calculateBirthChart(
      new Date('1990-01-15'),
      '14:30',
      40.7128,
      -74.0060,
    );

    expect(chart.planets).toHaveLength(12);
    expect(chart.houses).toHaveLength(12);
    expect(chart.ascendant).toBeDefined();
    expect(chart.midheaven).toBeDefined();
  });
});
```

## Resources

- [Swiss Ephemeris Documentation](https://www.astro.com/swisseph/swephprg.htm)
- [Ephemeris Files](https://www.astro.com/ftp/swisseph/ephe/)
- [Astrological Calculations](https://www.astro.com/swisseph/swisseph.htm)
- [House Systems](https://www.astro.com/astrology/in_house_e.htm)

## Troubleshooting

### "Ephemeris file not found"
- Download ephemeris files from Swiss Ephemeris website
- Place in `backend/ephemeris/` directory
- Or install system-wide Swiss Ephemeris library

### Incorrect Calculations
- Verify birth time is in correct format (HH:MM)
- Check latitude/longitude coordinates
- Ensure timezone is properly handled
- Verify Julian Day conversion

### Performance Issues
- Implement caching for frequently requested charts
- Use background jobs for batch calculations
- Consider pre-calculating common transits

## Future Enhancements

- [ ] Solar and Lunar Returns
- [ ] Arabic Parts
- [ ] Fixed Stars
- [ ] Eclipses
- [ ] Planetary Hours
- [ ] Harmonic Charts
- [ ] Composite Charts
- [ ] Relocation Charts
