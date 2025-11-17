import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { advancedChartsApi, AdvancedChart, AdvancedChartType } from '@/api/advancedCharts';

export default function AdvancedChartsScreen({ navigation }: any) {
  const [charts, setCharts] = useState<AdvancedChart[]>([]);
  const [loading, setLoading] = useState(true);

  const chartTypes = [
    {
      type: AdvancedChartType.TRANSIT,
      title: 'Transit Chart',
      description: 'Current planetary positions affecting your natal chart',
      icon: 'planet',
      color: '#3b82f6',
      requiresTwo: false,
    },
    {
      type: AdvancedChartType.PROGRESSED,
      title: 'Progressed Chart',
      description: 'Your evolved chart showing inner development over time',
      icon: 'trending-up',
      color: '#10b981',
      requiresTwo: false,
    },
    {
      type: AdvancedChartType.SOLAR_RETURN,
      title: 'Solar Return',
      description: 'Annual chart for when Sun returns to natal position',
      icon: 'sunny',
      color: '#f59e0b',
      requiresTwo: false,
    },
    {
      type: AdvancedChartType.LUNAR_RETURN,
      title: 'Lunar Return',
      description: 'Monthly chart for when Moon returns to natal position',
      icon: 'moon',
      color: '#a78bfa',
      requiresTwo: false,
    },
    {
      type: AdvancedChartType.SYNASTRY,
      title: 'Synastry Chart',
      description: 'Compare two birth charts for relationship compatibility',
      icon: 'heart-circle',
      color: '#ec4899',
      requiresTwo: true,
    },
    {
      type: AdvancedChartType.COMPOSITE,
      title: 'Composite Chart',
      description: 'Midpoint chart representing the relationship itself',
      icon: 'people',
      color: '#8b5cf6',
      requiresTwo: true,
    },
    {
      type: AdvancedChartType.DAVISON,
      title: 'Davison Chart',
      description: 'Relationship chart using midpoint date and location',
      icon: 'heart',
      color: '#f43f5e',
      requiresTwo: true,
    },
    {
      type: AdvancedChartType.SOLAR_ARCS,
      title: 'Solar Arcs',
      description: 'Predictive technique using symbolic progressions',
      icon: 'analytics',
      color: '#06b6d4',
      requiresTwo: false,
    },
  ];

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    try {
      setLoading(true);
      const data = await advancedChartsApi.getUserCharts();
      setCharts(data);
    } catch (error) {
      console.error('Failed to load charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChartTypePress = (chartInfo: any) => {
    navigation.navigate('ChartTypeDetail', { chartInfo });
  };

  const getChartCount = (type: AdvancedChartType) => {
    return charts.filter(chart => chart.chartType === type).length;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Advanced Charts</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6366f1" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Professional Astrology Tools</Text>
            <Text style={styles.infoText}>
              Advanced chart techniques for deeper insights into timing, relationships, and
              personal evolution.
            </Text>
          </View>
        </View>

        {/* Stats */}
        {!loading && charts.length > 0 && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{charts.length}</Text>
              <Text style={styles.statLabel}>Total Charts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {new Set(charts.map(c => c.chartType)).size}
              </Text>
              <Text style={styles.statLabel}>Types Used</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{chartTypes.length}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>
        )}

        {/* Chart Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chart Types</Text>

          {/* Single Person Charts */}
          <Text style={styles.categoryTitle}>Personal Charts</Text>
          {chartTypes
            .filter(chart => !chart.requiresTwo)
            .map((chartInfo) => {
              const count = getChartCount(chartInfo.type);
              return (
                <TouchableOpacity
                  key={chartInfo.type}
                  style={styles.chartCard}
                  onPress={() => handleChartTypePress(chartInfo)}
                >
                  <View style={[styles.chartIcon, { backgroundColor: chartInfo.color + '20' }]}>
                    <Ionicons name={chartInfo.icon as any} size={28} color={chartInfo.color} />
                  </View>
                  <View style={styles.chartInfo}>
                    <Text style={styles.chartTitle}>{chartInfo.title}</Text>
                    <Text style={styles.chartDesc}>{chartInfo.description}</Text>
                    {count > 0 && (
                      <View style={styles.chartCount}>
                        <Ionicons name="document-text" size={14} color="#6366f1" />
                        <Text style={styles.chartCountText}>{count} saved</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#6b7280" />
                </TouchableOpacity>
              );
            })}

          {/* Relationship Charts */}
          <Text style={[styles.categoryTitle, { marginTop: 24 }]}>Relationship Charts</Text>
          {chartTypes
            .filter(chart => chart.requiresTwo)
            .map((chartInfo) => {
              const count = getChartCount(chartInfo.type);
              return (
                <TouchableOpacity
                  key={chartInfo.type}
                  style={styles.chartCard}
                  onPress={() => handleChartTypePress(chartInfo)}
                >
                  <View style={[styles.chartIcon, { backgroundColor: chartInfo.color + '20' }]}>
                    <Ionicons name={chartInfo.icon as any} size={28} color={chartInfo.color} />
                  </View>
                  <View style={styles.chartInfo}>
                    <Text style={styles.chartTitle}>{chartInfo.title}</Text>
                    <Text style={styles.chartDesc}>{chartInfo.description}</Text>
                    {count > 0 && (
                      <View style={styles.chartCount}>
                        <Ionicons name="document-text" size={14} color="#6366f1" />
                        <Text style={styles.chartCountText}>{count} saved</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#6b7280" />
                </TouchableOpacity>
              );
            })}
        </View>

        {/* Premium Note */}
        <View style={styles.premiumCard}>
          <Ionicons name="star" size={24} color="#fbbf24" />
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Premium Feature</Text>
            <Text style={styles.premiumText}>
              Generating advanced charts requires a premium action. Each chart provides deep
              insights with professional-grade interpretations.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b2e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  chartIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartInfo: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  chartDesc: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  chartCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  chartCountText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '500',
  },
  premiumCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
    gap: 12,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  premiumText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
});
