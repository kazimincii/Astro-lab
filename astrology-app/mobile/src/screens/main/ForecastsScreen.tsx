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

type ForecastType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface Forecast {
  type: ForecastType;
  date: string;
  sections: {
    love?: string;
    money?: string;
    health?: string;
    career?: string;
    spiritual?: string;
    overall?: string;
  };
}

export default function ForecastsScreen({ route }: any) {
  const { profileId } = route.params || {};
  const [selectedType, setSelectedType] = useState<ForecastType>('daily');
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);

  const forecastTypes: { type: ForecastType; label: string; icon: string }[] = [
    { type: 'daily', label: 'Daily', icon: '☀️' },
    { type: 'weekly', label: 'Weekly', icon: '📅' },
    { type: 'monthly', label: 'Monthly', icon: '🌗' },
    { type: 'yearly', label: 'Yearly', icon: '🌌' },
  ];

  useEffect(() => {
    if (profileId) {
      fetchForecast();
    }
  }, [selectedType, profileId]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/forecasts/${profileId}/${selectedType}`);
      setForecast(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      alert('Failed to load forecast');
    } finally {
      setLoading(false);
    }
  };

  const sectionConfig = [
    { key: 'overall', title: 'Overall', icon: '✨', color: '#8b5cf6' },
    { key: 'love', title: 'Love', icon: '💖', color: '#ec4899' },
    { key: 'money', title: 'Money', icon: '💸', color: '#10b981' },
    { key: 'career', title: 'Career', icon: '📈', color: '#3b82f6' },
    { key: 'health', title: 'Health', icon: '🌿', color: '#22c55e' },
    { key: 'spiritual', title: 'Spiritual', icon: '🧘', color: '#a855f7' },
  ];

  const renderDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#191a2f', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>Forecasts</Text>
        <Text style={styles.subtitle}>Pick a window and explore your sky</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeSelector}
        >
          {forecastTypes.map(type => (
            <TouchableOpacity
              key={type.type}
              style={[
                styles.typeButton,
                selectedType === type.type && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType(type.type)}
            >
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type.type && styles.typeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : forecast ? (
        <ScrollView style={styles.forecastContainer}>
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroLabel}>Selected Period</Text>
              <Text style={styles.heroDate}>{renderDate(forecast.date)}</Text>
            </View>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{selectedType.toUpperCase()}</Text>
            </View>
          </View>

          {sectionConfig.map(
            (section) =>
              forecast.sections[section.key as keyof typeof forecast.sections] && (
                <View key={section.key} style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>{section.icon}</Text>
                    <Text style={[styles.sectionTitle, { color: section.color }]}>
                      {section.title}
                    </Text>
                  </View>
                  <Text style={styles.sectionText}>
                    {forecast.sections[section.key as keyof typeof forecast.sections]}
                  </Text>
                </View>
              )
          )}
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No forecast available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: 6,
    marginBottom: 14,
  },
  typeSelector: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#1f2033',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2a2b44',
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  typeIcon: {
    fontSize: 18,
  },
  typeLabel: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  typeLabelActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastContainer: {
    flex: 1,
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#1a1b2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242545',
  },
  heroLabel: {
    color: '#9ca3af',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroDate: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 6,
    fontWeight: '700',
  },
  heroTag: {
    backgroundColor: '#2a2b44',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3f4180',
  },
  heroTagText: {
    color: '#c7d2fe',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#24243a',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
});
