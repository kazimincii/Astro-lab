import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export default function ExploreScreen() {
  const features = [
    { id: '1', title: 'Tarot Reading', icon: 'card-outline', color: colors.cosmic.purple },
    { id: '2', title: 'Coffee Reading', icon: 'cafe-outline', color: colors.cosmic.pink },
    { id: '3', title: 'Numerology', icon: 'calculator-outline', color: colors.cosmic.blue },
    { id: '4', title: 'Compatibility', icon: 'heart-outline', color: colors.cosmic.gold },
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
