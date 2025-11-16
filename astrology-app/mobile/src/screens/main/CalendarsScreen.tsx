import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

type CalendarType = 'beauty' | 'health' | 'activity' | 'spiritual' | 'transit' | 'moon';

interface CalendarEntry {
  date: string;
  type: CalendarType;
  rating: number;
  tips: string[];
}

const calendarTypes: { type: CalendarType; name: string; icon: string }[] = [
  { type: 'beauty', name: 'Beauty', icon: '✨' },
  { type: 'health', name: 'Health', icon: '💚' },
  { type: 'activity', name: 'Activity', icon: '⚡' },
  { type: 'spiritual', name: 'Spiritual', icon: '🔮' },
  { type: 'transit', name: 'Transit', icon: '🌟' },
  { type: 'moon', name: 'Moon', icon: '🌙' },
];

export default function CalendarsScreen() {
  const [selectedType, setSelectedType] = useState<CalendarType>('moon');
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchCalendarEntries();
  }, [selectedType, selectedDate]);

  const fetchCalendarEntries = async () => {
    setLoading(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const response = await axios.get(
        `/calendars/${selectedType}?month=${month}&year=${year}`
      );
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#10b981';
    if (rating >= 5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.container}>
      {/* Calendar Type Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeSelector}
        contentContainerStyle={styles.typeSelectorContent}
      >
        {calendarTypes.map((type) => (
          <TouchableOpacity
            key={type.type}
            style={[
              styles.typeButton,
              selectedType === type.type && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType(type.type)}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text
              style={[
                styles.typeName,
                selectedType === type.type && styles.typeNameActive,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Calendar Entries */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView style={styles.entriesContainer}>
          {entries.map((entry, index) => (
            <View key={index} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View
                  style={[
                    styles.ratingBadge,
                    { backgroundColor: getRatingColor(entry.rating) },
                  ]}
                >
                  <Text style={styles.ratingText}>{entry.rating}/10</Text>
                </View>
              </View>

              {entry.tips && entry.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  {entry.tips.map((tip, tipIndex) => (
                    <View key={tipIndex} style={styles.tipRow}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  typeSelector: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 12,
  },
  typeSelectorContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0f0f1e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
  },
  typeIcon: {
    fontSize: 18,
  },
  typeName: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  typeNameActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entriesContainer: {
    flex: 1,
    padding: 20,
  },
  entryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipsContainer: {
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    color: '#6366f1',
    fontSize: 16,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
});
