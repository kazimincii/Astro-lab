// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { famousPeopleApi } from '@/api/famousPeople';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ProfileSelector';

interface FamousPerson {
  id: string;
  name: string;
  profession: string;
  category: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  matchReason: string;
  imageUrl?: string;
}

export default function FamousPeopleScreen({ navigation }: any) {
  const { selectedProfile, isLoading: profileLoading } = useProfile();
  const [people, setPeople] = useState<FamousPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProfile?.id) {
      fetchMatches();
    }
  }, [selectedProfile?.id]);

  const fetchMatches = async () => {
    try {
      const data = await famousPeopleApi.getMatches(selectedProfile.id);
      setPeople(data);
    } catch (error) {
      console.error('Error fetching famous matches:', error);
      alert('Failed to load famous people matches');
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

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>⭐ Famous Matches</Text>
        <Text style={styles.subtitle}>
          Notable people who share your cosmic signature
        </Text>
      </LinearGradient>

      <View style={styles.peopleList}>
        {people.map((person) => (
          <View key={person.id} style={styles.personCard}>
            {person.imageUrl && (
              <Image
                source={{ uri: person.imageUrl }}
                style={styles.personImage}
              />
            )}
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{person.name}</Text>
              <Text style={styles.personProfession}>
                {person.profession} • {person.category}
              </Text>

              <View style={styles.signsContainer}>
                <View style={styles.signBadge}>
                  <Text style={styles.signLabel}>☀️ {person.sunSign}</Text>
                </View>
                <View style={styles.signBadge}>
                  <Text style={styles.signLabel}>🌙 {person.moonSign}</Text>
                </View>
                {person.risingSign && (
                  <View style={styles.signBadge}>
                    <Text style={styles.signLabel}>⬆️ {person.risingSign}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.matchReason}>{person.matchReason}</Text>
            </View>
          </View>
        ))}

        {people.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No famous matches found yet</Text>
          </View>
        )}
      </View>
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
  peopleList: {
    padding: 20,
  },
  personCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
  },
  personImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  personProfession: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  signsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  signBadge: {
    backgroundColor: '#0f0f1e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  signLabel: {
    fontSize: 12,
    color: '#d1d5db',
  },
  matchReason: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
});
