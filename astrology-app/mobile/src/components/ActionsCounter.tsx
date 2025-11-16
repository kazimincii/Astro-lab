import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface ActionsData {
  dailyLimit: number;
  used: number;
  remaining: number;
  planType: string;
}

export default function ActionsCounter() {
  const navigation = useNavigation();
  const [actionsData, setActionsData] = useState<ActionsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActionsData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActionsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActionsData = async () => {
    try {
      const response = await axios.get('/actions/remaining');
      setActionsData(response.data);
    } catch (error) {
      console.error('Error fetching actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    navigation.navigate('MyPlan' as never);
  };

  if (loading || !actionsData) {
    return null;
  }

  // Don't show for unlimited (premium)
  if (actionsData.dailyLimit === -1) {
    return (
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <View style={styles.unlimitedBadge}>
          <Text style={styles.unlimitedText}>∞</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const percentage = (actionsData.remaining / actionsData.dailyLimit) * 100;
  const isLow = percentage <= 25;
  const isOut = actionsData.remaining === 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOut && styles.containerOut,
        isLow && !isOut && styles.containerLow,
      ]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚡</Text>
      </View>
      <Text style={[styles.text, isOut && styles.textOut]}>
        {actionsData.remaining}/{actionsData.dailyLimit}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  containerLow: {
    borderColor: '#f59e0b',
  },
  containerOut: {
    borderColor: '#ef4444',
    backgroundColor: '#2d1a1f',
  },
  iconContainer: {
    marginRight: 6,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  textOut: {
    color: '#ef4444',
  },
  unlimitedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f59e0b',
    borderRadius: 20,
  },
  unlimitedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
