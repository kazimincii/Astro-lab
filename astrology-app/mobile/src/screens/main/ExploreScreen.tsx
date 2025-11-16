import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export default function ExploreScreen({ navigation }: any) {
  const features = [
    // Core Features
    { id: '1', title: 'My Plan', icon: 'star-outline', color: '#f59e0b', screen: 'MyPlan' },
    { id: '2', title: 'Astro Academy', icon: 'school-outline', color: colors.cosmic.purple, screen: 'Education' },
    { id: '3', title: 'iOS Widgets', icon: 'grid-outline', color: '#6366f1', screen: 'Widgets' },
    { id: '4', title: 'My Journal', icon: 'book-outline', color: '#8b5cf6', screen: 'Journal' },

    // Wellness & Analysis
    { id: '5', title: 'Biorhythm', icon: 'pulse-outline', color: '#10b981', screen: 'Biorhythm' },
    { id: '6', title: 'Chakras', icon: 'radio-button-on-outline', color: '#a855f7', screen: 'Chakras' },
    { id: '7', title: 'Numerology', icon: 'calculator-outline', color: colors.cosmic.gold, screen: 'Numerology' },

    // Divination
    { id: '8', title: 'Tarot Reading', icon: 'card-outline', color: colors.cosmic.pink, screen: 'Tarot' },
    { id: '9', title: 'Coffee Reading', icon: 'cafe-outline', color: colors.cosmic.blue, screen: 'CoffeeReading' },
    { id: '10', title: 'Aura Scan', icon: 'scan-outline', color: '#ec4899', screen: 'AuraScan' },

    // Relationship & Social
    { id: '11', title: 'Relationship', icon: 'heart-circle-outline', color: '#ec4899', screen: 'RelationshipSoulmate' },
    { id: '12', title: 'Famous People', icon: 'people-circle-outline', color: '#f59e0b', screen: 'FamousPeople' },

    // Advanced Tools
    { id: '13', title: 'Advanced Charts', icon: 'analytics-outline', color: '#06b6d4', screen: 'AdvancedCharts' },
    { id: '14', title: 'Astro Map', icon: 'map-outline', color: '#3b82f6', screen: 'AstroMap' },
    { id: '15', title: 'Calendars', icon: 'calendar-outline', color: '#8b5cf6', screen: 'Calendars' },
    { id: '16', title: 'Forecasts', icon: 'trending-up-outline', color: '#10b981', screen: 'Forecasts' },

    // Community & Services
    { id: '17', title: 'Cosmic Climate', icon: 'planet-outline', color: '#6366f1', screen: 'CosmicClimate' },
    { id: '18', title: 'Live Services', icon: 'videocam-outline', color: '#a855f7', screen: 'LiveServices' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.grid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.featureCard, { borderColor: feature.color }]}
            onPress={() => {
              if (feature.screen) {
                navigation.navigate(feature.screen);
              }
            }}
          >
            <Ionicons name={feature.icon as any} size={40} color={feature.color} />
            <Text style={styles.featureTitle}>{feature.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.bg,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cosmic.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  featureCard: {
    width: '47%',
    backgroundColor: colors.cosmic.card,
    margin: 8,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cosmic.text,
    marginTop: 12,
    textAlign: 'center',
  },
});
