import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { I18nextProvider } from 'react-i18next';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { STRIPE_CONFIG } from './src/config/stripe';
import { initI18n } from './src/i18n';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient();

export default function App() {
  const [i18nInitialized, setI18nInitialized] = useState(false);
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    initI18n().then((i18n) => {
      setI18nInstance(i18n);
      setI18nInitialized(true);
    });
  }, []);

  if (!i18nInitialized || !i18nInstance) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
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
    </I18nextProvider>
  );
}
