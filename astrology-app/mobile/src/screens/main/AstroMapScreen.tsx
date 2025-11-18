import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { astroMapApi } from '@/api/astroMap';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ProfileSelector';

interface CityAnalysis {
  city: string;
  country: string;
  lifeRating: number;
  loveRating: number;
  careerRating: number;
  summary: string;
  influences: string[];
}

export default function AstroMapScreen({ navigation }: any) {
  const { selectedProfile, isLoading: profileLoading } = useProfile();
  const [cityName, setCityName] = useState('');
  const [analysis, setAnalysis] = useState<CityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyzeCity = async () => {
    if (!cityName.trim()) {
      alert('Please enter a city name');
      return;
    }

    setLoading(true);
    try {
      const data = await astroMapApi.analyzeCity(selectedProfile?.id || '', cityName);
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing city:', error);
      alert('Failed to analyze city');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7) return '#10b981';
    if (rating >= 4) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>🗺️ Astro Map</Text>
        <Text style={styles.subtitle}>
          Discover your best locations worldwide
        </Text>
      </LinearGradient>

      {/* City Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name..."
          placeholderTextColor="#6b7280"
          value={cityName}
          onChangeText={setCityName}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleAnalyzeCity}
          disabled={loading}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Analyze</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Analysis Result */}
      {analysis && (
        <View style={styles.analysisContainer}>
          <Text style={styles.cityName}>
            {analysis.city}, {analysis.country}
          </Text>

          {/* Ratings */}
          <View style={styles.ratingsGrid}>
            <View style={styles.ratingCard}>
              <Text style={styles.ratingLabel}>Life</Text>
              <View
                style={[
                  styles.ratingCircle,
                  { borderColor: getRatingColor(analysis.lifeRating) },
                ]}
              >
                <Text
                  style={[
                    styles.ratingValue,
                    { color: getRatingColor(analysis.lifeRating) },
                  ]}
                >
                  {analysis.lifeRating}
                </Text>
              </View>
            </View>

            <View style={styles.ratingCard}>
              <Text style={styles.ratingLabel}>Love</Text>
              <View
                style={[
                  styles.ratingCircle,
                  { borderColor: getRatingColor(analysis.loveRating) },
                ]}
              >
                <Text
                  style={[
                    styles.ratingValue,
                    { color: getRatingColor(analysis.loveRating) },
                  ]}
                >
                  {analysis.loveRating}
                </Text>
              </View>
            </View>

            <View style={styles.ratingCard}>
              <Text style={styles.ratingLabel}>Career</Text>
              <View
                style={[
                  styles.ratingCircle,
                  { borderColor: getRatingColor(analysis.careerRating) },
                ]}
              >
                <Text
                  style={[
                    styles.ratingValue,
                    { color: getRatingColor(analysis.careerRating) },
                  ]}
                >
                  {analysis.careerRating}
                </Text>
              </View>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{analysis.summary}</Text>
          </View>

          {/* Influences */}
          {analysis.influences && analysis.influences.length > 0 && (
            <View style={styles.influencesCard}>
              <Text style={styles.influencesTitle}>
                Planetary Influences
              </Text>
              {analysis.influences.map((influence, index) => (
                <View key={index} style={styles.influenceRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.influenceText}>{influence}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {!analysis && !loading && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>🗺️</Text>
          <Text style={styles.placeholderText}>
            Enter a city name to discover how planetary energies influence that
            location for you
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
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 100,
  },
  buttonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisContainer: {
    padding: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  ratingCard: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  ratingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  influencesCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
  },
  influencesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  influenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    color: '#6366f1',
    fontSize: 16,
    marginRight: 8,
  },
  influenceText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  placeholderContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
