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
import { numerologyApi, NumerologyProfile } from '@/api/numerology';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ProfileSelector';

export default function NumerologyScreen({ navigation }: any) {
  const { selectedProfile, isLoading: profileLoading } = useProfile();
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProfile?.id) {
      fetchNumerology();
    } else {
      setLoading(false);
    }
  }, [selectedProfile?.id]);

  const fetchNumerology = async () => {
    if (!selectedProfile?.id) return;

    try {
      setLoading(true);
      const data = await numerologyApi.getNumerologyProfile(selectedProfile.id);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching numerology:', error);
      alert('Failed to load numerology profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!selectedProfile) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
          <Text style={styles.title}>🔢 Numerology</Text>
          <Text style={styles.subtitle}>Your Life Path Numbers</Text>
        </LinearGradient>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <ProfileSelector />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Select a profile to view numerology</Text>
        </View>
      </ScrollView>
    );
  }

  if (!profile) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
          <Text style={styles.title}>🔢 Numerology</Text>
          <Text style={styles.subtitle}>Your Life Path Numbers</Text>
        </LinearGradient>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <ProfileSelector />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No numerology data available</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>🔢 Numerology</Text>
        <Text style={styles.subtitle}>Your Life Path Numbers</Text>
      </LinearGradient>

      {/* Core Numbers */}
      <View style={styles.numbersGrid}>
        <View style={styles.numberCard}>
          <Text style={styles.numberValue}>{profile.lifePath}</Text>
          <Text style={styles.numberLabel}>Life Path</Text>
        </View>
        <View style={styles.numberCard}>
          <Text style={styles.numberValue}>{profile.destiny}</Text>
          <Text style={styles.numberLabel}>Destiny</Text>
        </View>
        <View style={styles.numberCard}>
          <Text style={styles.numberValue}>{profile.soulUrge}</Text>
          <Text style={styles.numberLabel}>Soul Urge</Text>
        </View>
        <View style={styles.numberCard}>
          <Text style={styles.numberValue}>{profile.personality}</Text>
          <Text style={styles.numberLabel}>Personality</Text>
        </View>
      </View>

      {/* Personal Year */}
      <View style={styles.personalYearCard}>
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.gradient}>
          <Text style={styles.personalYearLabel}>Personal Year</Text>
          <Text style={styles.personalYearValue}>{profile.personalYear}</Text>
          <Text style={styles.personalYearText}>
            Your theme for this year
          </Text>
        </LinearGradient>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.descriptionText}>{profile.description}</Text>
      </View>

      {/* Strengths */}
      {profile.strengths && profile.strengths.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Strengths</Text>
          {profile.strengths.map((strength, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{strength}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Challenges */}
      {profile.challenges && profile.challenges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Challenges to Overcome</Text>
          {profile.challenges.map((challenge, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{challenge}</Text>
            </View>
          ))}
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
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  numberCard: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  numberValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  numberLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  personalYearCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 24,
    alignItems: 'center',
  },
  personalYearLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  personalYearValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  personalYearText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    color: '#6366f1',
    fontSize: 20,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
});
