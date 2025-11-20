import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import ChartWheel from '@/components/ChartWheel';

interface BirthChart {
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
    longitude: number;
    retrograde?: boolean;
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
  ascendant?: number;
  midheaven?: number;
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
  const [showAspects, setShowAspects] = useState(false);

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

  const getPlanetInfo = (planetName: string): string => {
    const planetInfo: { [key: string]: string } = {
      Sun: 'The Sun represents your core identity, ego, and life purpose. It shows how you express yourself and what makes you feel alive. Your Sun sign is your zodiac sign and represents your conscious mind and willpower.',
      Moon: 'The Moon represents your emotions, instincts, and subconscious mind. It shows how you process feelings, what makes you feel secure, and your emotional needs. The Moon sign reveals your inner self and how you nurture others.',
      Mercury: 'Mercury governs communication, thinking, and learning. It shows how you process information, express ideas, and connect with others mentally. Mercury also rules short trips, siblings, and daily routines.',
      Venus: 'Venus represents love, beauty, values, and relationships. It shows what you find attractive, how you express affection, and what brings you pleasure. Venus also governs money, art, and social harmony.',
      Mars: 'Mars represents action, energy, and desire. It shows how you assert yourself, pursue goals, and express anger. Mars governs passion, courage, competition, and physical energy.',
      Jupiter: 'Jupiter represents growth, expansion, and good fortune. It shows where you find meaning, wisdom, and opportunities. Jupiter governs philosophy, travel, higher education, and optimism.',
      Saturn: 'Saturn represents discipline, responsibility, and life lessons. It shows where you face challenges, build structure, and develop maturity. Saturn governs time, karma, authority, and long-term goals.',
      Uranus: 'Uranus represents innovation, rebellion, and sudden change. It shows where you seek freedom, uniqueness, and breakthrough insights. Uranus governs technology, revolution, and awakening.',
      Neptune: 'Neptune represents dreams, spirituality, and illusion. It shows your imagination, intuition, and connection to the divine. Neptune governs art, mysticism, compassion, and transcendence.',
      Pluto: 'Pluto represents transformation, power, and regeneration. It shows where you experience deep change, intensity, and rebirth. Pluto governs the unconscious, secrets, and profound evolution.',
    };
    return planetInfo[planetName] || 'This celestial body influences your birth chart with its unique energy.';
  };

  const getHouseInfo = (houseNumber: number): string => {
    const houseInfo: { [key: number]: string } = {
      1: '1st House (Self & Identity): The house of self, personality, and how you appear to others. It represents your physical body, first impressions, and approach to life. The sign on the cusp (Ascendant/Rising) is especially important.',
      2: '2nd House (Values & Resources): The house of money, possessions, and personal values. It shows how you earn income, what you value, and your relationship with material security and self-worth.',
      3: '3rd House (Communication & Learning): The house of communication, siblings, and short trips. It governs your thinking style, early education, neighbors, and how you share information.',
      4: '4th House (Home & Family): The house of home, family, and roots. It represents your childhood, parents (especially mother), ancestry, and emotional foundation. The IC (Imum Coeli) is at the cusp.',
      5: '5th House (Creativity & Pleasure): The house of creativity, romance, and self-expression. It governs children, hobbies, entertainment, gambling, and anything that brings you joy and playfulness.',
      6: '6th House (Health & Service): The house of health, work, and daily routines. It shows your approach to wellness, service to others, pets, and the details of everyday life.',
      7: '7th House (Partnerships): The house of marriage, partnerships, and relationships. It represents how you relate to others one-on-one, both romantically and in business. The Descendant is at the cusp.',
      8: '8th House (Transformation & Shared Resources): The house of sex, death, rebirth, and shared resources. It governs inheritances, taxes, intimacy, psychology, and profound transformation.',
      9: '9th House (Philosophy & Travel): The house of higher education, philosophy, and long-distance travel. It represents your belief systems, religion, law, and quest for meaning.',
      10: '10th House (Career & Public Life): The house of career, reputation, and public image. It shows your ambitions, achievements, and relationship with authority. The MC (Midheaven) is at the cusp.',
      11: '11th House (Community & Dreams): The house of friendships, groups, and future goals. It represents your social circles, humanitarian interests, and hopes and wishes for the future.',
      12: '12th House (Spirituality & Unconscious): The house of spirituality, secrets, and the unconscious mind. It governs karma, hidden enemies, institutions, solitude, and spiritual transcendence.',
    };
    return houseInfo[houseNumber] || 'This house area represents a specific life domain in your birth chart.';
  };

  const getAspectInfo = (aspectType: string): string => {
    const aspectInfo: { [key: string]: string } = {
      Conjunction: 'Conjunction (0°): A powerful merging of planetary energies. The planets work together as one, amplifying each other. This is the strongest aspect, creating intensity and focus.',
      Opposition: 'Opposition (180°): A challenging aspect creating tension between two planets. It represents polarities that need balance, often manifesting as external conflicts or relationships that mirror our internal struggles.',
      Trine: 'Trine (120°): A harmonious aspect indicating natural talent and ease. Energy flows smoothly between the planets, bringing gifts, luck, and opportunities. Often taken for granted.',
      Square: 'Square (90°): A challenging aspect creating dynamic tension and motivation. It represents internal conflicts that drive growth and action, though often through struggle and effort.',
      Sextile: 'Sextile (60°): A harmonious aspect indicating opportunities and talents. It requires some effort to activate but brings positive connections and skillful combinations of planetary energies.',
    };
    return aspectInfo[aspectType] || 'This aspect represents a specific angular relationship between two planets in your chart.';
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

      {/* Chart Wheel - Full Interactive Visualization */}
      <View style={styles.chartContainer}>
        <ChartWheel
          planets={chart.planets}
          houses={chart.houses}
          aspects={chart.aspects}
          ascendant={chart.ascendant}
          showAspects={showAspects}
        />

        <TouchableOpacity
          style={[
            styles.toggleAspectsButton,
            showAspects && styles.toggleAspectsButtonActive,
          ]}
          onPress={() => setShowAspects(!showAspects)}
        >
          <Text style={styles.toggleAspectsText}>
            {showAspects ? 'Hide Aspects' : 'Show Aspects'}
          </Text>
        </TouchableOpacity>
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
          <TouchableOpacity
            key={index}
            style={styles.aspectRow}
            onPress={() =>
              learnMode && setSelectedElement({ type: 'aspect', data: aspect })
            }
          >
            <Text style={styles.aspectText}>
              {aspect.planet1} {aspect.type} {aspect.planet2}
            </Text>
            <Text style={styles.aspectAngle}>{aspect.angle}°</Text>
          </TouchableOpacity>
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
            {selectedElement.type === 'planet' && selectedElement.data.name}
            {selectedElement.type === 'house' && `House ${selectedElement.data.number}`}
            {selectedElement.type === 'aspect' &&
              `${selectedElement.data.planet1} ${selectedElement.data.type} ${selectedElement.data.planet2}`}
          </Text>
          {selectedElement.type === 'planet' && selectedElement.data.sign && (
            <Text style={styles.learnSubtitle}>
              {selectedElement.data.name} in {selectedElement.data.sign} • House {selectedElement.data.house}
              {selectedElement.data.retrograde && ' • Retrograde ℞'}
            </Text>
          )}
          <Text style={styles.learnText}>
            {selectedElement.type === 'planet' && getPlanetInfo(selectedElement.data.name)}
            {selectedElement.type === 'house' && getHouseInfo(selectedElement.data.number)}
            {selectedElement.type === 'aspect' && getAspectInfo(selectedElement.data.type)}
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
  toggleAspectsButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#6366f1',
    borderRadius: 12,
  },
  toggleAspectsButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  toggleAspectsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  learnSubtitle: {
    fontSize: 14,
    color: '#8b5cf6',
    marginBottom: 12,
    fontWeight: '600',
  },
  learnText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
});
