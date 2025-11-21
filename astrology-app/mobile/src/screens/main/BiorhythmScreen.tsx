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
import { useTranslation } from 'react-i18next';
import { biorhythmApi, BiorhythmProfile } from '@/api/biorhythm';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ProfileSelector';

export default function BiorhythmScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { selectedProfile, isLoading: profileLoading } = useProfile();
  const [biorhythm, setBiorhythm] = useState<BiorhythmProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (selectedProfile?.id) {
      loadBiorhythm();
    } else {
      setLoading(false);
    }
  }, [selectedProfile?.id]);

  const loadBiorhythm = async () => {
    if (!selectedProfile?.id) return;

    try {
      setLoading(true);
      const data = await biorhythmApi.getLatestBiorhythm(selectedProfile.id);
      setBiorhythm(data);
    } catch (error) {
      console.error('Failed to load biorhythm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!selectedProfile?.id) {
      Alert.alert(
        t('screens.biorhythm.errors.noProfile'),
        t('screens.biorhythm.errors.selectProfile')
      );
      return;
    }

    try {
      setCalculating(true);
      const data = await biorhythmApi.calculateBiorhythm(selectedProfile.id);
      setBiorhythm(data);
    } catch (error: any) {
      console.error('Failed to calculate biorhythm:', error);
      if (error.response?.data?.message) {
        Alert.alert(t('common.errors.required'), error.response.data.message);
      } else {
        Alert.alert(t('common.errors.required'), t('screens.biorhythm.errors.calculateFailed'));
      }
    } finally {
      setCalculating(false);
    }
  };

  const getCycleColor = (value: number) => {
    if (value > 0.7) return '#10b981';
    if (value > 0.3) return '#fbbf24';
    if (value > -0.3) return '#9ca3af';
    if (value > -0.7) return '#f59e0b';
    return '#ef4444';
  };

  const getCycleStatus = (value: number) => {
    if (value > 0.7) return t('screens.biorhythm.status.highPeak');
    if (value > 0.3) return t('screens.biorhythm.status.rising');
    if (value > -0.3) return t('screens.biorhythm.status.neutral');
    if (value > -0.7) return t('screens.biorhythm.status.declining');
    return t('screens.biorhythm.status.low');
  };

  if (!selectedProfile || profileLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('screens.biorhythm.title')}</Text>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <ProfileSelector />
        </View>
        {profileLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="pulse-outline" size={64} color="#6b7280" />
            <Text style={styles.emptyText}>{t('screens.biorhythm.noProfile')}</Text>
          </View>
        )}
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
        <Text style={styles.title}>{t('screens.biorhythm.title')}</Text>
        <TouchableOpacity
          style={[styles.calculateButton, calculating && styles.calculateButtonDisabled]}
          onPress={handleCalculate}
          disabled={calculating}
        >
          {calculating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="refresh" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {biorhythm ? (
        <>
          {/* Date Info */}
          <View style={styles.dateCard}>
            <Ionicons name="calendar-outline" size={20} color="#6366f1" />
            <Text style={styles.dateText}>
              {t('screens.biorhythm.calculatedFor', {
                date: new Date(biorhythm.calculatedDate).toLocaleDateString()
              })}
            </Text>
          </View>

          {/* Cycles */}
          <View style={styles.cyclesSection}>
            {/* Physical */}
            <View style={styles.cycleCard}>
              <View style={styles.cycleHeader}>
                <View style={[styles.cycleIcon, { backgroundColor: '#ef444420' }]}>
                  <Ionicons name="fitness" size={28} color="#ef4444" />
                </View>
                <View style={styles.cycleInfo}>
                  <Text style={styles.cycleName}>{t('screens.biorhythm.cycles.physical.name')}</Text>
                  <Text style={styles.cycleSubtitle}>{t('screens.biorhythm.cycles.physical.subtitle')}</Text>
                </View>
                <Text style={[styles.cycleValue, { color: getCycleColor(biorhythm.data.physical) }]}>
                  {(biorhythm.data.physical * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.abs(biorhythm.data.physical * 50) + 50}%`,
                      backgroundColor: getCycleColor(biorhythm.data.physical),
                    },
                  ]}
                />
              </View>
              <Text style={styles.cycleStatus}>{getCycleStatus(biorhythm.data.physical)}</Text>
              {biorhythm.data.nextPeaks?.physical && (
                <Text style={styles.nextPeak}>
                  {t('screens.biorhythm.nextPeak', {
                    date: new Date(biorhythm.data.nextPeaks.physical).toLocaleDateString()
                  })}
                </Text>
              )}
            </View>

            {/* Emotional */}
            <View style={styles.cycleCard}>
              <View style={styles.cycleHeader}>
                <View style={[styles.cycleIcon, { backgroundColor: '#ec489920' }]}>
                  <Ionicons name="heart" size={28} color="#ec4899" />
                </View>
                <View style={styles.cycleInfo}>
                  <Text style={styles.cycleName}>{t('screens.biorhythm.cycles.emotional.name')}</Text>
                  <Text style={styles.cycleSubtitle}>{t('screens.biorhythm.cycles.emotional.subtitle')}</Text>
                </View>
                <Text style={[styles.cycleValue, { color: getCycleColor(biorhythm.data.emotional) }]}>
                  {(biorhythm.data.emotional * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.abs(biorhythm.data.emotional * 50) + 50}%`,
                      backgroundColor: getCycleColor(biorhythm.data.emotional),
                    },
                  ]}
                />
              </View>
              <Text style={styles.cycleStatus}>{getCycleStatus(biorhythm.data.emotional)}</Text>
              {biorhythm.data.nextPeaks?.emotional && (
                <Text style={styles.nextPeak}>
                  {t('screens.biorhythm.nextPeak', {
                    date: new Date(biorhythm.data.nextPeaks.emotional).toLocaleDateString()
                  })}
                </Text>
              )}
            </View>

            {/* Intellectual */}
            <View style={styles.cycleCard}>
              <View style={styles.cycleHeader}>
                <View style={[styles.cycleIcon, { backgroundColor: '#6366f120' }]}>
                  <Ionicons name="bulb" size={28} color="#6366f1" />
                </View>
                <View style={styles.cycleInfo}>
                  <Text style={styles.cycleName}>{t('screens.biorhythm.cycles.intellectual.name')}</Text>
                  <Text style={styles.cycleSubtitle}>{t('screens.biorhythm.cycles.intellectual.subtitle')}</Text>
                </View>
                <Text style={[styles.cycleValue, { color: getCycleColor(biorhythm.data.intellectual) }]}>
                  {(biorhythm.data.intellectual * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.abs(biorhythm.data.intellectual * 50) + 50}%`,
                      backgroundColor: getCycleColor(biorhythm.data.intellectual),
                    },
                  ]}
                />
              </View>
              <Text style={styles.cycleStatus}>{getCycleStatus(biorhythm.data.intellectual)}</Text>
              {biorhythm.data.nextPeaks?.intellectual && (
                <Text style={styles.nextPeak}>
                  {t('screens.biorhythm.nextPeak', {
                    date: new Date(biorhythm.data.nextPeaks.intellectual).toLocaleDateString()
                  })}
                </Text>
              )}
            </View>
          </View>

          {/* Critical Days */}
          {biorhythm.data.criticalDays && biorhythm.data.criticalDays.length > 0 && (
            <View style={styles.criticalCard}>
              <View style={styles.criticalHeader}>
                <Ionicons name="warning" size={24} color="#f59e0b" />
                <Text style={styles.criticalTitle}>{t('screens.biorhythm.criticalDays.title')}</Text>
              </View>
              <Text style={styles.criticalText}>
                {t('screens.biorhythm.criticalDays.description')}
              </Text>
              <View style={styles.criticalDays}>
                {biorhythm.data.criticalDays.map((day, index) => (
                  <View key={index} style={styles.criticalDay}>
                    <Text style={styles.criticalDayText}>
                      {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Commentary */}
          {biorhythm.commentary && (
            <View style={styles.commentaryCard}>
              <Text style={styles.commentaryTitle}>{t('screens.biorhythm.guidance')}</Text>
              <Text style={styles.commentaryText}>{biorhythm.commentary}</Text>
            </View>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{t('screens.biorhythm.about.title')}</Text>
              <Text style={styles.infoText}>
                {t('screens.biorhythm.about.description')}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="pulse-outline" size={64} color="#6b7280" />
          <Text style={styles.emptyText}>{t('screens.biorhythm.empty.noData')}</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleCalculate}>
            <Text style={styles.emptyButtonText}>{t('screens.biorhythm.empty.calculateButton')}</Text>
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
  calculateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonDisabled: {
    opacity: 0.6,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  dateText: {
    fontSize: 15,
    color: '#e5e7eb',
  },
  cyclesSection: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  cycleCard: {
    backgroundColor: '#1a1b2e',
    padding: 20,
    borderRadius: 16,
  },
  cycleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cycleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleInfo: {
    flex: 1,
  },
  cycleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  cycleSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
  cycleValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2d2e3f',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  cycleStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  nextPeak: {
    fontSize: 13,
    color: '#9ca3af',
  },
  criticalCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  criticalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  criticalText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  criticalDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  criticalDay: {
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  criticalDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f59e0b',
  },
  commentaryCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  commentaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  commentaryText: {
    fontSize: 15,
    color: '#e5e7eb',
    lineHeight: 24,
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
