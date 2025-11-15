import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { advancedChartsApi, AdvancedChartType, ChartMode } from '@/api/advancedCharts';

export default function ChartTypeDetailScreen({ route, navigation }: any) {
  const { chartInfo } = route.params;
  const [generating, setGenerating] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ChartMode>(ChartMode.BASIC);

  const handleGenerate = async () => {
    // In a real app, you'd have a profile selector
    // For now, we'll show an info message
    Alert.alert(
      'Generate Chart',
      'In the full implementation, you would select profiles and date, then generate the chart.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Demo Generate',
          onPress: async () => {
            try {
              setGenerating(true);
              // Simulated generation - in real app, get actual profile IDs
              Alert.alert('Premium Action Required', 'This feature requires a premium action.');
            } catch (error: any) {
              console.error('Failed to generate chart:', error);
              if (error.response?.data?.message) {
                Alert.alert('Error', error.response.data.message);
              } else {
                Alert.alert('Error', 'Failed to generate chart');
              }
            } finally {
              setGenerating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{chartInfo.title}</Text>
      </View>

      {/* Chart Info Card */}
      <View style={[styles.mainCard, { borderLeftColor: chartInfo.color }]}>
        <View style={[styles.chartIconLarge, { backgroundColor: chartInfo.color + '20' }]}>
          <Ionicons name={chartInfo.icon} size={48} color={chartInfo.color} />
        </View>
        <Text style={styles.mainTitle}>{chartInfo.title}</Text>
        <Text style={styles.mainDesc}>{chartInfo.description}</Text>
      </View>

      {/* What You'll Get */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You'll Get</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Detailed chart visualization</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Professional interpretation</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Key aspects and patterns</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Personalized insights</Text>
          </View>
        </View>
      </View>

      {/* Mode Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chart Mode</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[styles.modeCard, selectedMode === ChartMode.BASIC && styles.modeCardActive]}
            onPress={() => setSelectedMode(ChartMode.BASIC)}
          >
            <View style={styles.modeHeader}>
              <Text style={[styles.modeTitle, selectedMode === ChartMode.BASIC && styles.modeTextActive]}>
                Basic
              </Text>
              {selectedMode === ChartMode.BASIC && (
                <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
              )}
            </View>
            <Text style={styles.modeDesc}>
              Essential chart information and core interpretations
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeCard, selectedMode === ChartMode.PRO && styles.modeCardActive]}
            onPress={() => setSelectedMode(ChartMode.PRO)}
          >
            <View style={styles.modeHeader}>
              <Text style={[styles.modeTitle, selectedMode === ChartMode.PRO && styles.modeTextActive]}>
                Professional
              </Text>
              {selectedMode === ChartMode.PRO && (
                <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
              )}
            </View>
            <Text style={styles.modeDesc}>
              In-depth analysis with advanced techniques and detailed guidance
            </Text>
            <View style={styles.proBadge}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.proText}>Pro</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Requirements */}
      {chartInfo.requiresTwo && (
        <View style={styles.requirementCard}>
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
          <View style={styles.requirementContent}>
            <Text style={styles.requirementTitle}>Two Profiles Required</Text>
            <Text style={styles.requirementText}>
              This chart type analyzes the relationship between two people. You'll need to select
              two birth profiles to generate this chart.
            </Text>
          </View>
        </View>
      )}

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, generating && styles.generateButtonDisabled]}
        onPress={handleGenerate}
        disabled={generating}
      >
        {generating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="sparkles" size={24} color="#fff" />
            <Text style={styles.generateButtonText}>Generate Chart</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.premiumNote}>Requires Premium Action</Text>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Select Profile{chartInfo.requiresTwo ? 's' : ''}</Text>
              <Text style={styles.stepDesc}>
                Choose {chartInfo.requiresTwo ? 'two birth profiles' : 'a birth profile'} from
                your saved profiles
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose Date (Optional)</Text>
              <Text style={styles.stepDesc}>
                Select a specific date for time-based charts, or use current date
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Generate & Explore</Text>
              <Text style={styles.stepDesc}>
                Review your chart with detailed interpretations and insights
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  chartIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  mainDesc: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#e5e7eb',
  },
  modeContainer: {
    gap: 12,
  },
  modeCard: {
    backgroundColor: '#1a1b2e',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeCardActive: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f120',
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  modeTextActive: {
    color: '#6366f1',
  },
  modeDesc: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fbbf2420',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginTop: 8,
  },
  proText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fbbf24',
  },
  requirementCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    gap: 12,
  },
  requirementContent: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  premiumNote: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
});
