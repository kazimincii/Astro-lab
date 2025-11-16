import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import axios from 'axios';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 40;

interface BirthChart {
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
  }>;
  houses: Array<{
    number: number;
    sign: string;
    cusp: number;
  }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: string;
    angle: number;
  }>;
  interpretation: {
    sun: string;
    moon: string;
    rising: string;
  };
}

export default function BirthChartDetailScreen({ route }: any) {
  const { profileId } = route.params || {};
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [learnMode, setLearnMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);

  useEffect(() => {
    if (profileId) {
      fetchChart();
    }
  }, [profileId]);

  const fetchChart = async () => {
    try {
      const response = await axios.get(`/charts/${profileId}`);
      setChart(response.data);
    } catch (error) {
      console.error('Error fetching chart:', error);
      alert('Failed to load birth chart');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!chart) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No chart data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Learn Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            !learnMode && styles.modeButtonActive,
          ]}
          onPress={() => setLearnMode(false)}
        >
          <Text
            style={[
              styles.modeButtonText,
              !learnMode && styles.modeButtonTextActive,
            ]}
          >
            View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            learnMode && styles.modeButtonActive,
          ]}
          onPress={() => setLearnMode(true)}
        >
          <Text
            style={[
              styles.modeButtonText,
              learnMode && styles.modeButtonTextActive,
            ]}
          >
            Learn Mode
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart Wheel - Simplified SVG representation */}
      <View style={styles.chartContainer}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          {/* Outer Circle */}
          <Circle
            cx={CHART_SIZE / 2}
            cy={CHART_SIZE / 2}
            r={CHART_SIZE / 2 - 10}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />

          {/* Inner Circle */}
          <Circle
            cx={CHART_SIZE / 2}
            cy={CHART_SIZE / 2}
            r={CHART_SIZE / 3}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1"
          />

          {/* House Lines (12 divisions) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = CHART_SIZE / 2 + (CHART_SIZE / 3) * Math.cos(angle);
            const y1 = CHART_SIZE / 2 + (CHART_SIZE / 3) * Math.sin(angle);
            const x2 = CHART_SIZE / 2 + (CHART_SIZE / 2 - 10) * Math.cos(angle);
            const y2 = CHART_SIZE / 2 + (CHART_SIZE / 2 - 10) * Math.sin(angle);

            return (
              <Line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#4b5563"
                strokeWidth="1"
              />
            );
          })}

          {/* Planets (simplified positions) */}
          {chart.planets.slice(0, 10).map((planet, i) => {
            const angle = ((planet.degree - 90) * Math.PI) / 180;
            const radius = CHART_SIZE / 2.5;
            const x = CHART_SIZE / 2 + radius * Math.cos(angle);
            const y = CHART_SIZE / 2 + radius * Math.sin(angle);

            return (
              <SvgText
                key={planet.name}
                x={x}
                y={y}
                fontSize="16"
                fill="#f59e0b"
                textAnchor="middle"
              >
                {planet.name.substring(0, 2)}
              </SvgText>
            );
          })}
        </Svg>

        <View style={styles.chartNote}>
          <Text style={styles.chartNoteText}>
            Interactive chart visualization coming soon
          </Text>
        </View>
      </View>

      {/* Interpretation */}
      <View style={styles.interpretationContainer}>
        <View style={styles.interpretationCard}>
          <Text style={styles.interpretationTitle}>☀️ Sun Sign</Text>
          <Text style={styles.interpretationText}>
            {chart.interpretation.sun}
          </Text>
        </View>

        <View style={styles.interpretationCard}>
          <Text style={styles.interpretationTitle}>🌙 Moon Sign</Text>
          <Text style={styles.interpretationText}>
            {chart.interpretation.moon}
          </Text>
        </View>

        <View style={styles.interpretationCard}>
          <Text style={styles.interpretationTitle}>⬆️ Rising Sign</Text>
          <Text style={styles.interpretationText}>
            {chart.interpretation.rising}
          </Text>
        </View>
      </View>

      {/* Planets List */}
      <View style={styles.planetsContainer}>
        <Text style={styles.sectionTitle}>Planets</Text>
        {chart.planets.map((planet, index) => (
          <TouchableOpacity
            key={index}
            style={styles.planetRow}
            onPress={() =>
              learnMode && setSelectedElement({ type: 'planet', data: planet })
            }
          >
            <Text style={styles.planetName}>{planet.name}</Text>
            <Text style={styles.planetInfo}>
              {planet.sign} • House {planet.house} • {planet.degree.toFixed(1)}°
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Houses */}
      <View style={styles.housesContainer}>
        <Text style={styles.sectionTitle}>Houses</Text>
        <View style={styles.housesGrid}>
          {chart.houses.map((house) => (
            <TouchableOpacity
              key={house.number}
              style={styles.houseCard}
              onPress={() =>
                learnMode && setSelectedElement({ type: 'house', data: house })
              }
            >
              <Text style={styles.houseNumber}>{house.number}</Text>
              <Text style={styles.houseSign}>{house.sign}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Aspects */}
      <View style={styles.aspectsContainer}>
        <Text style={styles.sectionTitle}>Major Aspects</Text>
        {chart.aspects.slice(0, 10).map((aspect, index) => (
          <View key={index} style={styles.aspectRow}>
            <Text style={styles.aspectText}>
              {aspect.planet1} {aspect.type} {aspect.planet2}
            </Text>
            <Text style={styles.aspectAngle}>{aspect.angle}°</Text>
          </View>
        ))}
      </View>

      {/* Learn Mode Info */}
      {learnMode && selectedElement && (
        <View style={styles.learnModal}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedElement(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.learnTitle}>
            {selectedElement.type === 'planet'
              ? selectedElement.data.name
              : `House ${selectedElement.data.number}`}
          </Text>
          <Text style={styles.learnText}>
            Tap-to-learn detailed information will appear here. This feature
            provides insights about planets, houses, and aspects.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#6366f1',
  },
  modeButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chartNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
  },
  chartNoteText: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  interpretationContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  interpretationCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  interpretationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 12,
  },
  interpretationText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  planetsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  planetRow: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  planetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  planetInfo: {
    fontSize: 14,
    color: '#9ca3af',
  },
  housesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  housesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  houseCard: {
    width: '23%',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  houseNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  houseSign: {
    fontSize: 12,
    color: '#9ca3af',
  },
  aspectsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  aspectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  aspectText: {
    fontSize: 14,
    color: '#d1d5db',
  },
  aspectAngle: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  learnModal: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  learnTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  learnText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
});
