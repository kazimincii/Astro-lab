import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { todayApi, TodaySummary } from '@/api/today';

export default function TodayScreen() {
  const [summary, setSummary] = useState<TodaySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTodaySummary = async () => {
    try {
      const data = await todayApi.getTodaySummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to load today summary:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTodaySummary();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTodaySummary();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load today's summary</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good day, {summary.profile.name}!</Text>
        <Text style={styles.date}>{new Date(summary.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}</Text>
      </View>

      {/* Star Message */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="star" size={24} color="#fbbf24" />
          <Text style={styles.cardTitle}>Star Message of the Day</Text>
        </View>
        <Text style={styles.starMessage}>{summary.starMessage.message}</Text>
        <View style={styles.keywords}>
          {summary.starMessage.keywords.map((keyword, index) => (
            <View key={index} style={styles.keyword}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Moon & Transit */}
      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon" size={20} color="#a78bfa" />
            <Text style={styles.cardTitleSmall}>Moon</Text>
          </View>
          <Text style={styles.moonPhase}>{summary.moon.phase}</Text>
          <Text style={styles.moonSign}>in {summary.moon.sign}</Text>
          <Text style={styles.moonIllumination}>
            {Math.round(summary.moon.illumination)}% illuminated
          </Text>
        </View>

        {summary.keyTransit && (
          <View style={[styles.card, styles.halfCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="planet" size={20} color="#f59e0b" />
              <Text style={styles.cardTitleSmall}>Key Transit</Text>
            </View>
            <Text style={styles.transitTitle}>{summary.keyTransit.title}</Text>
            <Text style={styles.transitDesc} numberOfLines={2}>
              {summary.keyTransit.description}
            </Text>
          </View>
        )}
      </View>

      {/* Forecast Scores */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Scores</Text>
        <View style={styles.scoresGrid}>
          <ScoreItem
            icon="heart"
            label="Love"
            score={summary.forecast.scores.love}
            color="#ec4899"
          />
          <ScoreItem
            icon="briefcase"
            label="Career"
            score={summary.forecast.scores.career}
            color="#3b82f6"
          />
          <ScoreItem
            icon="fitness"
            label="Health"
            score={summary.forecast.scores.health}
            color="#10b981"
          />
          <ScoreItem
            icon="star"
            label="Overall"
            score={summary.forecast.scores.overall}
            color="#fbbf24"
          />
        </View>
      </View>

      {/* Forecast */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Forecast</Text>
        <Text style={styles.forecastText}>{summary.forecast.general}</Text>
      </View>

      {/* Lucky Elements */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lucky Elements</Text>
        <View style={styles.luckyRow}>
          <View style={styles.luckyItem}>
            <Ionicons name="color-palette" size={20} color={summary.forecast.luckyColor} />
            <Text style={styles.luckyLabel}>Color</Text>
          </View>
          <View style={styles.luckyItem}>
            <Ionicons name="diamond" size={20} color="#a78bfa" />
            <Text style={styles.luckyLabel}>{summary.forecast.luckyGem}</Text>
          </View>
          <View style={styles.luckyItem}>
            <Ionicons name="keypad" size={20} color="#6366f1" />
            <Text style={styles.luckyLabel}>{summary.forecast.luckyNumbers.join(', ')}</Text>
          </View>
        </View>
      </View>

      {/* Daily Calendars */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Ratings</Text>
        <CalendarRating
          icon="sparkles"
          label="Beauty"
          rating={summary.calendars.beauty.rating}
          tip={summary.calendars.beauty.tip}
        />
        <CalendarRating
          icon="fitness"
          label="Health"
          rating={summary.calendars.health.rating}
          tip={summary.calendars.health.tip}
        />
        <CalendarRating
          icon="rocket"
          label="Activity"
          rating={summary.calendars.activity.rating}
          tip={summary.calendars.activity.tip}
        />
        <CalendarRating
          icon="leaf"
          label="Spiritual"
          rating={summary.calendars.spiritual.rating}
          tip={summary.calendars.spiritual.tip}
        />
      </View>

      {/* Upcoming Events */}
      {summary.upcomingEvents.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Cosmic Events</Text>
          {summary.upcomingEvents.map((event, index) => (
            <View key={index} style={styles.eventItem}>
              <Ionicons name="planet-outline" size={16} color="#a78bfa" />
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const ScoreItem = ({ icon, label, score, color }: any) => (
  <View style={styles.scoreItem}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.scoreLabel}>{label}</Text>
    <Text style={styles.scoreValue}>{score}/5</Text>
  </View>
);

const CalendarRating = ({ icon, label, rating, tip }: any) => (
  <View style={styles.calendarItem}>
    <View style={styles.calendarHeader}>
      <Ionicons name={icon} size={18} color="#6366f1" />
      <Text style={styles.calendarLabel}>{label}</Text>
      <Text style={styles.calendarRating}>{rating}/10</Text>
    </View>
    <Text style={styles.calendarTip}>{tip}</Text>
  </View>
);

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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  halfCard: {
    flex: 1,
    margin: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  cardTitleSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  starMessage: {
    fontSize: 16,
    color: '#e5e7eb',
    lineHeight: 24,
    marginBottom: 12,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyword: {
    backgroundColor: '#2d2e3f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  keywordText: {
    color: '#a78bfa',
    fontSize: 12,
  },
  moonPhase: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  moonSign: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  moonIllumination: {
    fontSize: 12,
    color: '#6b7280',
  },
  transitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  transitDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scoreItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2d2e3f',
    borderRadius: 12,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  forecastText: {
    fontSize: 15,
    color: '#e5e7eb',
    lineHeight: 22,
  },
  luckyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  luckyItem: {
    alignItems: 'center',
    gap: 8,
  },
  luckyLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  calendarItem: {
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  calendarLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  calendarRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  calendarTip: {
    fontSize: 13,
    color: '#9ca3af',
    marginLeft: 26,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
});
