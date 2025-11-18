/**
 * Widget Updates Hook
 *
 * Automatically updates iOS widgets when relevant data changes
 * Listens to app state and profile changes
 * Supports App Groups for native widget communication
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { WidgetDataManager } = NativeModules;

/**
 * Widget Data Interface
 * Shared between app and widgets via App Groups
 */
export interface WidgetData {
  dailyMessage: string;
  dailyMessageSource?: 'horoscope' | 'cosmic' | 'ai';
  moonPhase: string;
  moonPhaseEmoji?: string;
  date: string;
  timestamp: number;
  birthChart?: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
  };
  nextEvent?: {
    name: string;
    date: string;
  };
  todayHoroscope?: string;
  transits?: Array<{
    planet: string;
    sign: string;
    degree: number;
  }>;
}

interface UseWidgetUpdatesProps {
  enabled?: boolean;
  fetchHoroscope?: () => Promise<string>;
  fetchMoonPhase?: () => Promise<string>;
  fetchBirthChart?: () => Promise<WidgetData['birthChart']>;
  fetchTransits?: () => Promise<WidgetData['transits']>;
}

const WIDGET_DATA_KEY = 'widget_data';
const APP_GROUPS_CONTAINER = 'group.com.astrologyapp.superapp';

/**
 * Hook to automatically update widgets based on app state and data changes
 */
export const useWidgetUpdates = (props: UseWidgetUpdatesProps = {}) => {
  const {
    enabled = true,
    fetchHoroscope,
    fetchMoonPhase,
    fetchBirthChart,
    fetchTransits,
  } = props;

  const appState = useRef(AppState.currentState);
  const lastUpdateRef = useRef<Date | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Minimum time between updates (5 minutes)
  const MIN_UPDATE_INTERVAL = 5 * 60 * 1000;

  const shouldUpdate = (): boolean => {
    if (!enabled) {
      return false;
    }

    if (!lastUpdateRef.current) {
      return true;
    }

    const timeSinceLastUpdate = Date.now() - lastUpdateRef.current.getTime();
    return timeSinceLastUpdate >= MIN_UPDATE_INTERVAL;
  };

  const updateWidgets = async () => {
    if (!shouldUpdate()) {
      console.log('Skipping widget update (too soon)');
      return;
    }

    try {
      console.log('Updating widgets...');

      const [horoscope, moonPhase, birthChart, transits] = await Promise.all([
        fetchHoroscope?.() ?? null,
        fetchMoonPhase?.() ?? null,
        fetchBirthChart?.() ?? null,
        fetchTransits?.() ?? null,
      ]);

      if (!horoscope && !moonPhase && !birthChart && !transits) {
        console.log('No data to update widgets');
        return;
      }

      const widgetData: WidgetData = {
        dailyMessage: horoscope ?? 'Open app to see your horoscope',
        dailyMessageSource: 'horoscope',
        moonPhase: moonPhase ?? 'Unknown',
        moonPhaseEmoji: getMoonPhaseEmoji(moonPhase ?? 'Unknown'),
        date: new Date().toISOString(),
        timestamp: Date.now(),
        birthChart,
        transits,
      };

      // Update via native or AsyncStorage
      if (Platform.OS === 'ios' && WidgetDataManager?.updateWidgetData) {
        await WidgetDataManager.updateWidgetData(
          JSON.stringify(widgetData),
          APP_GROUPS_CONTAINER
        );
        if (WidgetDataManager?.notifyWidgets) {
          await WidgetDataManager.notifyWidgets();
        }
      } else {
        // Fallback to AsyncStorage
        await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(widgetData));
      }

      lastUpdateRef.current = new Date();
      console.log('Widgets updated successfully');
    } catch (error) {
      console.error('Failed to update widgets:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // Update when app comes to foreground
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App came to foreground, updating widgets');
      await updateWidgets();
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Update on mount
    updateWidgets();

    // Listen to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Update every 30 minutes when app is active
    updateIntervalRef.current = setInterval(() => {
      if (AppState.currentState === 'active') {
        updateWidgets();
      }
    }, 30 * 60 * 1000);

    return () => {
      subscription.remove();
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [enabled, fetchHoroscope, fetchMoonPhase, fetchBirthChart, fetchTransits]);

  return {
    updateWidgets,
    isSupported: Platform.OS === 'ios',
  };
};

/**
 * Helper to get moon phase emoji
 */
export const getMoonPhaseEmoji = (phase: string): string => {
  const phaseMap: Record<string, string> = {
    'New Moon': '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter': '🌓',
    'Waxing Gibbous': '🌔',
    'Full Moon': '🌕',
    'Waning Gibbous': '🌖',
    'Last Quarter': '🌗',
    'Waning Crescent': '🌘',
  };
  return phaseMap[phase] || '🌙';
};
  };
};
