import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

interface Expert {
  id: string;
  name: string;
  type: string;
  bio: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  pricePerSession: number;
}

export default function LiveServicesScreen() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  const serviceTypes = [
    { value: 'all', label: 'All' },
    { value: 'astrology', label: 'Astrology' },
    { value: 'tarot', label: 'Tarot' },
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'numerology', label: 'Numerology' },
  ];

  useEffect(() => {
    fetchExperts();
  }, [selectedType]);

  const fetchExperts = async () => {
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const response = await axios.get('/live-services/experts', { params });
      setExperts(response.data);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSession = (expertId: string) => {
    // Navigate to session request screen or show modal
    alert('Session request functionality - coming soon!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>🔮 Live Services</Text>
        <Text style={styles.subtitle}>
          Connect with expert readers and advisors
        </Text>
      </LinearGradient>

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {serviceTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.filterButton,
              selectedType === type.value && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType(type.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === type.value && styles.filterTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Experts List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView style={styles.expertsContainer}>
          {experts.map((expert) => (
            <View key={expert.id} style={styles.expertCard}>
              <View style={styles.expertHeader}>
                {expert.imageUrl && (
                  <Image
                    source={{ uri: expert.imageUrl }}
                    style={styles.expertImage}
                  />
                )}
                <View style={styles.expertInfo}>
                  <Text style={styles.expertName}>{expert.name}</Text>
                  <Text style={styles.expertType}>{expert.type}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {expert.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCount}>
                      ({expert.reviewCount} reviews)
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.expertBio} numberOfLines={3}>
                {expert.bio}
              </Text>

              <View style={styles.expertFooter}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>From</Text>
                  <Text style={styles.price}>${expert.pricePerSession}</Text>
                  <Text style={styles.priceLabel}>/ session</Text>
                </View>

                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleRequestSession(expert.id)}
                >
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.bookButtonGradient}
                  >
                    <Text style={styles.bookButtonText}>Request Session</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {experts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No experts available in this category
              </Text>
            </View>
          )}
        </ScrollView>
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
  filterContainer: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0f0f1e',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertsContainer: {
    flex: 1,
    padding: 20,
  },
  expertCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  expertHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  expertImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  expertType: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  expertBio: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 16,
  },
  expertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
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
