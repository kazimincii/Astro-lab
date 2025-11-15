import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widgetsApi, WidgetConfig, WidgetType } from '@/api/widgets';

export default function WidgetsScreen() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const widgetTypes = [
    {
      type: WidgetType.MOON_PHASE,
      title: 'Moon Phase',
      description: 'Current moon phase and zodiac sign',
      icon: 'moon',
      color: '#a78bfa',
    },
    {
      type: WidgetType.STAR_MESSAGE,
      title: 'Star Message',
      description: 'Daily personalized message from the stars',
      icon: 'star',
      color: '#fbbf24',
    },
    {
      type: WidgetType.TODAY_SUMMARY,
      title: 'Today Summary',
      description: 'Quick overview of your day',
      icon: 'today',
      color: '#6366f1',
    },
    {
      type: WidgetType.DAILY_FORECAST,
      title: 'Daily Forecast',
      description: 'Your daily horoscope at a glance',
      icon: 'sunny',
      color: '#f59e0b',
    },
  ];

  const loadWidgets = async () => {
    try {
      const data = await widgetsApi.getUserWidgets();
      setWidgets(data);
    } catch (error) {
      console.error('Failed to load widgets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWidgets();
  }, []);

  const handleToggleWidget = async (widgetType: WidgetType, currentlyEnabled: boolean) => {
    try {
      const widget = widgets.find(w => w.widgetType === widgetType);

      if (!widget) {
        // Create new widget if it doesn't exist
        if (!currentlyEnabled) {
          await widgetsApi.createOrUpdateWidget(widgetType, {
            refreshInterval: 3600,
            theme: 'dark',
            size: 'medium',
          });
        }
      } else {
        // Toggle existing widget
        await widgetsApi.toggleWidget(widgetType, !currentlyEnabled);
      }

      await loadWidgets();
    } catch (error) {
      console.error('Failed to toggle widget:', error);
      Alert.alert('Error', 'Failed to update widget');
    }
  };

  const handleDeleteWidget = async (widgetType: WidgetType) => {
    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget configuration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await widgetsApi.deleteWidget(widgetType);
              await loadWidgets();
            } catch (error) {
              console.error('Failed to delete widget:', error);
              Alert.alert('Error', 'Failed to delete widget');
            }
          },
        },
      ]
    );
  };

  const getWidgetConfig = (widgetType: WidgetType): WidgetConfig | undefined => {
    return widgets.find(w => w.widgetType === widgetType);
  };

  const isWidgetEnabled = (widgetType: WidgetType): boolean => {
    const widget = getWidgetConfig(widgetType);
    return widget ? widget.isEnabled : false;
  };

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
        <Text style={styles.title}>iOS Widgets</Text>
        <Text style={styles.subtitle}>
          Configure widgets for your iPhone home screen
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#6366f1" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>How to add widgets</Text>
          <Text style={styles.infoText}>
            Long press on your home screen, tap the + button, search for "Astrology
            App", and select your desired widget.
          </Text>
        </View>
      </View>

      {/* Widget List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Widgets</Text>
        {widgetTypes.map((widgetInfo) => {
          const config = getWidgetConfig(widgetInfo.type);
          const enabled = isWidgetEnabled(widgetInfo.type);

          return (
            <View key={widgetInfo.type} style={styles.widgetCard}>
              <View style={styles.widgetHeader}>
                <View style={[styles.iconContainer, { backgroundColor: widgetInfo.color + '20' }]}>
                  <Ionicons name={widgetInfo.icon as any} size={28} color={widgetInfo.color} />
                </View>
                <View style={styles.widgetInfo}>
                  <Text style={styles.widgetTitle}>{widgetInfo.title}</Text>
                  <Text style={styles.widgetDescription}>{widgetInfo.description}</Text>
                </View>
                <Switch
                  value={enabled}
                  onValueChange={() => handleToggleWidget(widgetInfo.type, enabled)}
                  trackColor={{ false: '#2d2e3f', true: widgetInfo.color + '60' }}
                  thumbColor={enabled ? widgetInfo.color : '#6b7280'}
                  ios_backgroundColor="#2d2e3f"
                />
              </View>

              {config && enabled && (
                <View style={styles.widgetDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                      <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  </View>

                  {config.data.refreshInterval && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Refresh Interval</Text>
                      <Text style={styles.detailValue}>
                        {Math.floor(config.data.refreshInterval / 60)} minutes
                      </Text>
                    </View>
                  )}

                  {config.data.theme && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Theme</Text>
                      <Text style={styles.detailValue}>{config.data.theme}</Text>
                    </View>
                  )}

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteWidget(widgetInfo.type)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      <Text style={styles.deleteButtonText}>Delete Configuration</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Widget Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Widget Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{widgets.length}</Text>
            <Text style={styles.statLabel}>Configured</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {widgets.filter(w => w.isEnabled).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{widgetTypes.length}</Text>
            <Text style={styles.statLabel}>Available</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 24,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  widgetCard: {
    backgroundColor: '#1a1b2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetInfo: {
    flex: 1,
  },
  widgetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  widgetDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 18,
  },
  widgetDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2d2e3f',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b98120',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  actions: {
    marginTop: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef444420',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  statsCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
