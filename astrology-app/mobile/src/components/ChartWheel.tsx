import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Circle,
  Line,
  Text as SvgText,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '@/theme/colors';

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width - 40, 400);
const CENTER = CHART_SIZE / 2;
const OUTER_RADIUS = CENTER - 20;
const MIDDLE_RADIUS = OUTER_RADIUS - 60;
const INNER_RADIUS = MIDDLE_RADIUS - 40;

interface Planet {
  name: string;
  sign: string;
  house: number;
  degree: number;
  longitude: number;
  retrograde?: boolean;
}

interface House {
  number: number;
  sign: string;
  cusp: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
}

interface ChartWheelProps {
  planets: Planet[];
  houses: House[];
  aspects?: Aspect[];
  ascendant?: number;
  showAspects?: boolean;
}

// Planet symbols (using Unicode astrological symbols)
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  'True Node': '☊',
  Chiron: '⚷',
};

// Sign symbols
const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

// Aspect colors
const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#FFD700',
  Opposition: '#FF6B6B',
  Trine: '#4ECDC4',
  Square: '#FF8C42',
  Sextile: '#95E1D3',
  Quincunx: '#A8DADC',
};

export default function ChartWheel({
  planets,
  houses,
  aspects = [],
  ascendant,
  showAspects = false,
}: ChartWheelProps) {
  // Convert degree to radians and adjust for chart rotation (Ascendant at 9 o'clock)
  const degToRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  // Calculate point on circle
  const getPoint = (degree: number, radius: number) => {
    const rad = degToRad(degree);
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad),
    };
  };

  // Rotate chart so Ascendant is at 9 o'clock (left side)
  const rotation = ascendant ? -ascendant : 0;

  // Normalize degree with rotation
  const normalizeDegree = (degree: number) => {
    return (degree + rotation + 360) % 360;
  };

  return (
    <View style={styles.container}>
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        <Defs>
          <LinearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.cosmic.purple} stopOpacity="0.1" />
            <Stop offset="1" stopColor={colors.cosmic.accent} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        <G rotation={rotation} origin={`${CENTER}, ${CENTER}`}>
          {/* Outer circle - Zodiac signs */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RADIUS}
            fill="url(#chartGradient)"
            stroke={colors.cosmic.purple}
            strokeWidth="2"
          />

          {/* Middle circle - Houses */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={MIDDLE_RADIUS}
            fill="none"
            stroke={colors.cosmic.purple}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Inner circle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            fill="none"
            stroke={colors.cosmic.purple}
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Draw zodiac sign divisions (12 segments) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const degree = i * 30;
            const outer = getPoint(degree, OUTER_RADIUS);
            const middle = getPoint(degree, MIDDLE_RADIUS);
            const signDegree = (degree + 15) % 360;
            const signPos = getPoint(signDegree, OUTER_RADIUS - 20);
            const signs = Object.keys(SIGN_SYMBOLS);
            const sign = signs[i];

            return (
              <G key={`sign-${i}`}>
                <Line
                  x1={middle.x}
                  y1={middle.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={colors.cosmic.purple}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                <SvgText
                  x={signPos.x}
                  y={signPos.y}
                  fill={colors.cosmic.accent}
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {SIGN_SYMBOLS[sign]}
                </SvgText>
              </G>
            );
          })}

          {/* Draw house cusps */}
          {houses.map((house) => {
            const normalizedCusp = normalizeDegree(house.cusp);
            const outer = getPoint(normalizedCusp, MIDDLE_RADIUS);
            const inner = getPoint(normalizedCusp, INNER_RADIUS);
            const labelPos = getPoint(normalizedCusp + 15, MIDDLE_RADIUS - 20);

            return (
              <G key={`house-${house.number}`}>
                <Line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={colors.cosmic.text}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
                <SvgText
                  x={labelPos.x}
                  y={labelPos.y}
                  fill={colors.cosmic.textSecondary}
                  fontSize="12"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {house.number}
                </SvgText>
              </G>
            );
          })}

          {/* Draw aspects (if enabled) */}
          {showAspects &&
            aspects.map((aspect, i) => {
              const planet1 = planets.find((p) => p.name === aspect.planet1);
              const planet2 = planets.find((p) => p.name === aspect.planet2);

              if (!planet1 || !planet2) return null;

              const p1 = getPoint(normalizeDegree(planet1.longitude), INNER_RADIUS - 10);
              const p2 = getPoint(normalizeDegree(planet2.longitude), INNER_RADIUS - 10);
              const color = ASPECT_COLORS[aspect.type] || colors.cosmic.textSecondary;

              return (
                <Line
                  key={`aspect-${i}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  strokeDasharray={aspect.type === 'Opposition' ? '4,4' : undefined}
                />
              );
            })}

          {/* Draw planets */}
          {planets.map((planet) => {
            const normalizedLongitude = normalizeDegree(planet.longitude);
            const planetPos = getPoint(normalizedLongitude, MIDDLE_RADIUS + 30);
            const symbol = PLANET_SYMBOLS[planet.name] || planet.name.charAt(0);

            return (
              <G key={`planet-${planet.name}`}>
                <Circle
                  cx={planetPos.x}
                  cy={planetPos.y}
                  r="12"
                  fill={colors.cosmic.card}
                  stroke={colors.cosmic.accent}
                  strokeWidth="1.5"
                />
                <SvgText
                  x={planetPos.x}
                  y={planetPos.y}
                  fill={colors.cosmic.text}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {symbol}
                </SvgText>
                {planet.retrograde && (
                  <SvgText
                    x={planetPos.x + 10}
                    y={planetPos.y - 10}
                    fill="#FF6B6B"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    R
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Ascendant marker */}
          {ascendant !== undefined && (
            <G>
              <Line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER + OUTER_RADIUS}
                y2={CENTER}
                stroke={colors.cosmic.accent}
                strokeWidth="2"
              />
              <SvgText
                x={CENTER + OUTER_RADIUS - 30}
                y={CENTER - 10}
                fill={colors.cosmic.accent}
                fontSize="12"
                fontWeight="bold"
              >
                ASC
              </SvgText>
            </G>
          )}
        </G>
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Chart Information</Text>
        <View style={styles.legendRow}>
          <Text style={styles.legendText}>Outer Ring: Zodiac Signs</Text>
        </View>
        <View style={styles.legendRow}>
          <Text style={styles.legendText}>Middle Ring: Houses (1-12)</Text>
        </View>
        <View style={styles.legendRow}>
          <Text style={styles.legendText}>Planets: Positioned by degree</Text>
        </View>
        {showAspects && (
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>Lines: Planetary Aspects</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  legend: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    width: CHART_SIZE,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.cosmic.text,
    marginBottom: 12,
  },
  legendRow: {
    marginBottom: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.cosmic.textSecondary,
  },
});
