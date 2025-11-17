/**
 * Widget Updates Hook
 *
 * Automatically updates iOS widgets when relevant data changes
 * Listens to app state and profile changes
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { widgetService, WidgetData } from '@/services/widgetService';

interface UseWidgetUpdatesProps {
  enabled?: boolean;
  fetchHoroscope?: () => Promise<WidgetData['todayHoroscope']>;
  fetchMoonPhase?: () => Promise<WidgetData['moonPhase']>;
  fetchBirthChart?: () => Promise<WidgetData['birthChart']>;
  fetchTransits?: () => Promise<WidgetData['transits']>;
}

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
    if (!enabled || !widgetService.isWidgetSupported()) {
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
        todayHoroscope: horoscope ?? {
          sign: 'Unknown',
          text: 'Open app to see your horoscope',
          date: new Date().toISOString().split('T')[0],
          mood: 'neutral',
          luckyNumber: 0,
          luckyColor: 'purple',
        },
        moonPhase: moonPhase ?? {
          phase: 'Unknown',
          illumination: 0,
          emoji: '🌑',
        },
        birthChart: birthChart ?? undefined,
        transits: transits ?? undefined,
        lastUpdated: new Date().toISOString(),
      };

      await widgetService.updateWidgetData(widgetData);
      await widgetService.reloadWidgets();

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
    if (!enabled || !widgetService.isWidgetSupported()) {
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
    isSupported: widgetService.isWidgetSupported(),
  };
};
