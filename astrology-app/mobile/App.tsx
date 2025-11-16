import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { STRIPE_CONFIG } from './src/config/stripe';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient();

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
            <NavigationContainer>
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </ProfileProvider>
      </StripeProvider>
    </QueryClientProvider>
  );
}
