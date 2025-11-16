import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chakrasApi, ChakraProfile, ChakraStatus } from '@/api/chakras';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ProfileSelector';

export default function ChakrasScreen({ navigation }: any) {
  const { selectedProfile, isLoading: profileLoading } = useProfile();
  const [chakraProfile, setChakraProfile] = useState<ChakraProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const chakraColors = {
    root: '#dc2626',
    sacral: '#f97316',
    solarPlexus: '#eab308',
    heart: '#22c55e',
    throat: '#3b82f6',
    thirdEye: '#6366f1',
    crown: '#a855f7',
  };

  const chakraIcons = {
    root: 'fitness',
    sacral: 'water',
    solarPlexus: 'sunny',
    heart: 'heart',
    throat: 'megaphone',
    thirdEye: 'eye',
    crown: 'flash',
  };

  useEffect(() => {
    if (selectedProfile?.id) {
      loadChakraProfile();
    } else {
      setLoading(false);
    }
  }, [selectedProfile?.id]);

  const loadChakraProfile = async () => {
    try {
      setLoading(true);
      const data = await chakrasApi.getChakraProfile(selectedProfile.id);
      setChakraProfile(data);
    } catch (error) {
      console.error('Failed to load chakra profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProfile?.id) {
      Alert.alert('No Profile', 'Please select a profile first');
      return;
    }

    try {
      setGenerating(true);
      const data = await chakrasApi.generateChakraProfile(selectedProfile.id);
      setChakraProfile(data);
    } catch (error: any) {
      console.error('Failed to generate chakra profile:', error);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to generate chakra profile');
      }
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status: ChakraStatus) => {
    switch (status) {
      case ChakraStatus.BALANCED:
        return '#10b981';
      case ChakraStatus.UNDERACTIVE:
        return '#3b82f6';
      case ChakraStatus.OVERACTIVE:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: ChakraStatus) => {
    switch (status) {
      case ChakraStatus.BALANCED:
        return 'Balanced';
      case ChakraStatus.UNDERACTIVE:
        return 'Underactive';
      case ChakraStatus.OVERACTIVE:
        return 'Overactive';
      default:
        return 'Unknown';
    }
  };

  if (!selectedProfile?.id) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Chakras</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="radio-button-on-outline" size={64} color="#6b7280" />
          <Text style={styles.emptyText}>Please select a profile to view chakras</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Chakras</Text>
        <TouchableOpacity
          style={[styles.generateButton, generating && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="sparkles" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {chakraProfile ? (
        <>
          {/* Overall Guidance */}
          {chakraProfile.overallGuidance && (
            <View style={styles.guidanceCard}>
              <Text style={styles.guidanceTitle}>Overall Guidance</Text>
              <Text style={styles.guidanceText}>{chakraProfile.overallGuidance}</Text>
            </View>
          )}

          {/* Chakras */}
          <View style={styles.chakrasSection}>
            {Object.entries(chakraProfile.chakraStates).map(([key, chakra]) => {
              const chakraKey = key as keyof typeof chakraColors;
              return (
                <View key={key} style={styles.chakraCard}>
                  <View style={styles.chakraHeader}>
                    <View
                      style={[
                        styles.chakraIcon,
                        { backgroundColor: chakraColors[chakraKey] + '20' },
                      ]}
                    >
                      <Ionicons
                        name={chakraIcons[chakraKey] as any}
                        size={28}
                        color={chakraColors[chakraKey]}
                      />
                    </View>
                    <View style={styles.chakraInfo}>
                      <Text style={styles.chakraName}>{chakra.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(chakra.status) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(chakra.status) },
                          ]}
                        >
                          {getStatusLabel(chakra.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.chakraScore, { color: chakraColors[chakraKey] }]}>
                      {chakra.score}/10
                    </Text>
                  </View>

                  {/* Score Bar */}
                  <View style={styles.scoreBar}>
                    <View
                      style={[
                        styles.scoreFill,
                        {
                          width: `${chakra.score * 10}%`,
                          backgroundColor: chakraColors[chakraKey],
                        },
                      ]}
                    />
                  </View>

                  {/* Tips */}
                  {chakra.tips && chakra.tips.length > 0 && (
                    <View style={styles.tips}>
                      <Text style={styles.tipsTitle}>Tips:</Text>
                      {chakra.tips.map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                          <Text style={styles.tipBullet}>•</Text>
                          <Text style={styles.tipText}>{tip}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Meditation & Breathwork */}
          {chakraProfile.meditation && (
            <View style={styles.meditationCard}>
              <Text style={styles.meditationTitle}>Practices</Text>

              {chakraProfile.meditation.recommended &&
                chakraProfile.meditation.recommended.length > 0 && (
                  <View style={styles.practiceSection}>
                    <View style={styles.practiceSectionHeader}>
                      <Ionicons name="leaf-outline" size={20} color="#10b981" />
                      <Text style={styles.practiceSectionTitle}>Recommended Meditations</Text>
                    </View>
                    {chakraProfile.meditation.recommended.map((practice, index) => (
                      <View key={index} style={styles.practiceItem}>
                        <Text style={styles.practiceText}>{practice}</Text>
                      </View>
                    ))}
                  </View>
                )}

              {chakraProfile.meditation.breathwork &&
                chakraProfile.meditation.breathwork.length > 0 && (
                  <View style={styles.practiceSection}>
                    <View style={styles.practiceSectionHeader}>
                      <Ionicons name="cloud-outline" size={20} color="#3b82f6" />
                      <Text style={styles.practiceSectionTitle}>Breathwork Exercises</Text>
                    </View>
                    {chakraProfile.meditation.breathwork.map((practice, index) => (
                      <View key={index} style={styles.practiceItem}>
                        <Text style={styles.practiceText}>{practice}</Text>
                      </View>
                    ))}
                  </View>
                )}
            </View>
          )}

          {/* Info */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>About Chakras</Text>
              <Text style={styles.infoText}>
                Chakras are energy centers in your body that influence your physical, emotional,
                and spiritual well-being. Balancing your chakras can lead to greater harmony and
                vitality.
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="radio-button-on-outline" size={64} color="#6b7280" />
          <Text style={styles.emptyText}>No chakra profile available</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleGenerate}>
            <Text style={styles.emptyButtonText}>Generate Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1b2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  generateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  guidanceCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#a855f7',
  },
  guidanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  guidanceText: {
    fontSize: 15,
    color: '#e5e7eb',
    lineHeight: 24,
  },
  chakrasSection: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  chakraCard: {
    backgroundColor: '#1a1b2e',
    padding: 20,
    borderRadius: 16,
  },
  chakraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  chakraIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chakraInfo: {
    flex: 1,
  },
  chakraName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chakraScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#2d2e3f',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
  },
  tips: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2d2e3f',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 8,
  },
  tipBullet: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  meditationCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  meditationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  practiceSection: {
    marginBottom: 16,
  },
  practiceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  practiceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  practiceItem: {
    backgroundColor: '#2d2e3f',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  practiceText: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
