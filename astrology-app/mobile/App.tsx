import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { STRIPE_CONFIG } from './src/config/stripe';
import { useWidgetUpdates } from './src/hooks/useWidgetUpdates';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient();

function AppContent() {
  const { updateWidgets } = useWidgetUpdates({
    enabled: true,
    fetchHoroscope: async () => {
      // Fetch daily horoscope from API
      try {
        const response = await fetch('https://api.astrology.app/v1/daily-forecast');
        const data = await response.json();
        return data.message || 'Welcome to your daily horoscope';
      } catch (error) {
        console.error('Failed to fetch horoscope:', error);
        return 'Open app to see your horoscope';
      }
    },
    fetchMoonPhase: async () => {
      // Fetch current moon phase
      try {
        const response = await fetch('https://api.astrology.app/v1/moon-phase');
        const data = await response.json();
        return data.phase || 'Waxing Crescent';
      } catch (error) {
        console.error('Failed to fetch moon phase:', error);
        return 'Waxing Crescent';
      }
    },
  });

  useEffect(() => {
    // Update widgets on app start
    updateWidgets();
  }, [updateWidgets]);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider
        publishableKey={STRIPE_CONFIG.publishableKey}
        merchantIdentifier={STRIPE_CONFIG.merchantIdentifier}
        urlScheme={STRIPE_CONFIG.urlScheme}
      >
        <ProfileProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </ProfileProvider>
      </StripeProvider>
    </QueryClientProvider>
  );
}
