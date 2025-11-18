// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Card } from '@/components/ui/Card';

type ForecastType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface Forecast {
  type: ForecastType;
  date: string;
  sections: {
    love?: string;
    money?: string;
    health?: string;
    career?: string;
    spiritual?: string;
    overall?: string;
  };
}

export default function ForecastsScreen({ route }: any) {
  const { t } = useTranslation();
  const { profileId } = route.params || {};
  const [selectedType, setSelectedType] = useState<ForecastType>('daily');
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);

  const forecastTypes: { type: ForecastType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { type: 'daily', label: t('screens.forecasts.types.daily'), icon: 'sunny-outline' },
    { type: 'weekly', label: t('screens.forecasts.types.weekly'), icon: 'calendar-outline' },
    { type: 'monthly', label: t('screens.forecasts.types.monthly'), icon: 'calendar-number-outline' },
    { type: 'yearly', label: t('screens.forecasts.types.yearly'), icon: 'sparkles-outline' },
  ];

  useEffect(() => {
    if (profileId) {
      fetchForecast();
    }
  }, [selectedType, profileId]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/forecasts/${profileId}/${selectedType}`);
      setForecast(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      Alert.alert('', t('screens.forecasts.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const sectionConfig = [
    { key: 'overall', title: t('screens.forecasts.sections.overall'), icon: 'sparkles-outline', color: '#8b5cf6' },
    { key: 'love', title: t('screens.forecasts.sections.love'), icon: 'heart-outline', color: '#ec4899' },
    { key: 'money', title: t('screens.forecasts.sections.money'), icon: 'cash-outline', color: '#10b981' },
    { key: 'career', title: t('screens.forecasts.sections.career'), icon: 'briefcase-outline', color: '#3b82f6' },
    { key: 'health', title: t('screens.forecasts.sections.health'), icon: 'fitness-outline', color: '#22c55e' },
    { key: 'spiritual', title: t('screens.forecasts.sections.spiritual'), icon: 'planet-outline', color: '#a855f7' },
  ];

  const renderDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <View className="flex-1 bg-[#0f0f1e]">
      <LinearGradient colors={['#191a2f', '#0f0f1e']} className="border-b border-[#24243a] px-5 pt-16 pb-5">
        <Text className="text-3xl font-bold text-white">{t('screens.forecasts.title')}</Text>
        <Text className="mt-2 text-slate-400">{t('screens.forecasts.subtitle')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4, columnGap: 10 }}
        >
          {forecastTypes.map(type => (
            <TouchableOpacity
              key={type.type}
              className={`min-w-[140px] flex-row items-center gap-2 rounded-2xl border px-4 py-2.5 ${
                selectedType === type.type
                  ? 'border-[#6366f1] bg-[#6366f1]'
                  : 'border-[#2a2b44] bg-[#1f2033]'
              }`}
              onPress={() => setSelectedType(type.type)}
            >
              <Ionicons
                name={type.icon}
                size={18}
                color={selectedType === type.type ? '#fff' : '#cbd5e1'}
              />
              <Text
                className={`text-sm font-semibold ${
                  selectedType === type.type ? 'text-white' : 'text-slate-300'
                }`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : forecast ? (
        <ScrollView
          className="flex-1 px-5 py-4"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Card className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-400">
                {t('screens.forecasts.hero.selectedPeriod')}
              </Text>
              <Text className="mt-1 text-lg font-bold text-white">{renderDate(forecast.date)}</Text>
            </View>
            <View className="rounded-xl border border-[#3f4180] bg-[#2a2b44] px-3 py-2">
              <Text className="text-xs font-bold text-[#c7d2fe]">{selectedType.toUpperCase()}</Text>
            </View>
          </Card>

          {sectionConfig.map(
            (section) =>
              forecast.sections[section.key as keyof typeof forecast.sections] && (
                <Card key={section.key} className="mb-4 border border-[#24243a] bg-[#181a2f]">
                  <View className="mb-3 flex-row items-center gap-2">
                    <View
                      className="h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${section.color}22` }}
                    >
                      <Ionicons name={section.icon as any} size={22} color={section.color} />
                    </View>
                    <Text className="text-lg font-semibold" style={{ color: section.color }}>
                      {section.title}
                    </Text>
                  </View>
                  <Text className="text-base leading-6 text-slate-200">
                    {forecast.sections[section.key as keyof typeof forecast.sections]}
                  </Text>
                </Card>
              )
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-slate-300">
            {t('screens.forecasts.errors.noForecast')}
          </Text>
        </View>
      )}
    </View>
  );
}
