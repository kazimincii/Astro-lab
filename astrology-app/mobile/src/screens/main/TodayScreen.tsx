import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/colors';
import { profilesApi } from '@/api/profiles';
import { forecastsApi, DailyForecastResponse } from '@/api/forecasts';
import { subscriptionsApi, SubscriptionUsage } from '@/api/subscriptions';

type Profile = {
  id: string;
  name: string;
  sunSign?: string | null;
  isMainProfile?: boolean;
};

export default function TodayScreen({ navigation }: any) {
  const { t } = useTranslation();
  const {
    data: profilesData,
    isLoading: areProfilesLoading,
    isError: isProfilesError,
    error: profilesError,
    refetch: refetchProfiles,
    isRefetching: isProfilesRefetching,
  } = useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: profilesApi.getAll,
  });

  const mainProfile = useMemo(() => {
    const list = profilesData ?? [];
    if (!list.length) return undefined;
    return list.find(profile => profile.isMainProfile) ?? list[0];
  }, [profilesData]);

  const {
    data: forecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    error: forecastError,
    refetch: refetchForecast,
    isRefetching: isForecastRefetching,
  } = useQuery<DailyForecastResponse>({
    queryKey: ['forecast', mainProfile?.id],
    queryFn: () => forecastsApi.getToday(mainProfile!.id),
    enabled: Boolean(mainProfile?.id),
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: subscriptionUsage,
    isLoading: isUsageLoading,
    isError: isUsageError,
    error: usageError,
    refetch: refetchUsage,
    isRefetching: isUsageRefetching,
  } = useQuery<SubscriptionUsage>({
    queryKey: ['subscriptionUsage'],
    queryFn: subscriptionsApi.getUsage,
    staleTime: 60 * 1000,
  });

  const handleRefresh = useCallback(() => {
    refetchProfiles();
    if (mainProfile?.id) refetchForecast();
    refetchUsage();
  }, [refetchProfiles, refetchForecast, refetchUsage, mainProfile?.id]);

  const renderLoading = (message: string) => (
    <View className="mx-4 mt-8 items-center rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-6">
      <ActivityIndicator color={colors.cosmic.purple} />
      <Text className="mt-3 text-sm text-slate-400">{message}</Text>
    </View>
  );

  const renderError = (message: string, action?: () => void) => (
    <View className="mx-4 mt-8 items-center rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-6">
      <Text className="text-base text-white text-center">{message}</Text>
      {action && (
        <TouchableOpacity className="mt-4 flex-row items-center rounded-xl bg-[#6366f1] px-4 py-2.5" onPress={action}>
          <Text className="text-sm font-semibold text-white">{t('common.buttons.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyProfiles = () => (
    <View className="mx-4 mt-8 items-center rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-6">
      <Ionicons name="people-outline" size={64} color={colors.cosmic.textSecondary} />
      <Text className="mt-4 text-xl font-semibold text-white">{t('screens.today.empty.profilesNeeded')}</Text>
      <Text className="mt-2 text-center text-slate-400">
        {t('screens.today.empty.addProfileMessage')}
      </Text>
      <TouchableOpacity
        className="mt-4 flex-row items-center rounded-xl bg-[#6366f1] px-4 py-2.5"
        onPress={() => navigation.navigate('Profiles')}
      >
        <Ionicons name="add" size={18} color={colors.cosmic.text} />
        <Text className="ml-2 font-semibold text-white">{t('screens.today.empty.createProfile')}</Text>
      </TouchableOpacity>
    </View>
  );

  const luckyNumbers = (forecast?.luckyNumbers ?? []).slice(0, 4);
  const transits = forecast?.planetaryTransits ? Object.values(forecast.planetaryTransits) : [];
  const moonPhase = useMemo(() => {
    if (!forecast?.date) return { label: t('screens.today.moonPhase.phases.loading'), emoji: '○' };
    const synodicMonth = 29.53058867;
    const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const daysSinceNew =
      (new Date(forecast.date).getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phase = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;
    const index = Math.floor((phase / synodicMonth) * 8 + 0.5) % 8;
    const phases = [
      { label: t('screens.today.moonPhase.phases.newMoon'), emoji: '🌑' },
      { label: t('screens.today.moonPhase.phases.waxingCrescent'), emoji: '🌒' },
      { label: t('screens.today.moonPhase.phases.firstQuarter'), emoji: '🌓' },
      { label: t('screens.today.moonPhase.phases.waxingGibbous'), emoji: '🌔' },
      { label: t('screens.today.moonPhase.phases.fullMoon'), emoji: '🌕' },
      { label: t('screens.today.moonPhase.phases.waningGibbous'), emoji: '🌖' },
      { label: t('screens.today.moonPhase.phases.lastQuarter'), emoji: '🌗' },
      { label: t('screens.today.moonPhase.phases.waningCrescent'), emoji: '🌘' },
    ];
    return phases[index];
  }, [forecast?.date, t]);

  const renderScore = (label: string, value?: number | null) => (
    <View className="flex-1 rounded-xl border border-[#2f2f45] bg-[#1f1f33] px-4 py-3">
      <Text className="text-xs tracking-[0.8px] uppercase text-slate-400">{label}</Text>
      <Text className="mt-2 text-lg font-semibold text-white">{value != null ? value.toFixed(1) : '--'}</Text>
    </View>
  );

  const renderSection = (title: string, content?: string) => (
    <View className="mt-3">
      <Text className="text-base font-semibold text-white">{title}</Text>
      <Text className="mt-1 text-sm leading-5 text-slate-300">{content ?? t('screens.today.focusAreas.awaitingDownload')}</Text>
    </View>
  );

  const renderMembershipCard = () => {
    if (isUsageLoading && !subscriptionUsage) {
      return (
        <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
          <ActivityIndicator color={colors.cosmic.purple} />
        </View>
      );
    }

    if (isUsageError) {
      const message =
        usageError instanceof Error ? usageError.message : 'Unable to load membership details.';
      return (
        <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
          <Text className="text-xs tracking-[0.8px] uppercase text-slate-400">Membership</Text>
          <Text className="mt-2 text-sm text-white">{message}</Text>
          <TouchableOpacity
            className="mt-3 rounded-xl bg-[#6366f1] px-4 py-2.5"
            onPress={refetchUsage}
          >
            <Text className="text-sm font-semibold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!subscriptionUsage) return null;

    const planLabel =
      subscriptionUsage.plan?.charAt(0).toUpperCase() + subscriptionUsage.plan?.slice(1);
    const actionUsageText = subscriptionUsage.unlimitedActions
      ? 'Unlimited'
      : `${subscriptionUsage.actionsUsedToday}/${subscriptionUsage.dailyActionLimit}`;

    return (
      <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs tracking-[1px] uppercase text-slate-400">Membership</Text>
            <Text className="mt-1 text-2xl font-semibold text-white">{planLabel}</Text>
          </View>
          <TouchableOpacity
            className="rounded-full bg-[rgba(99,102,241,0.15)] px-3 py-2.5"
            onPress={() => navigation.navigate('MyPlan')}
          >
            <Text className="text-sm font-semibold text-white">Manage</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-4 flex-row">
          <View className="flex-1">
            <Text className="text-xs text-slate-400">Daily actions</Text>
            <Text className="mt-1 text-xl font-semibold text-white">{actionUsageText}</Text>
            {!subscriptionUsage.unlimitedActions && (
              <Text className="text-xs text-slate-400">
                {subscriptionUsage.actionsRemaining ?? 0} left today
              </Text>
            )}
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-xs text-slate-400">Profiles</Text>
            <Text className="mt-1 text-xl font-semibold text-white">
              {subscriptionUsage.profilesUsed}/{subscriptionUsage.profileLimit}
            </Text>
            <Text className="text-xs text-slate-400">Included in your plan</Text>
          </View>
        </View>
      </View>
    );
  };

  const pageContent = () => {
    if (areProfilesLoading && !profilesData) return renderLoading('Preparing your space...');
    if (isProfilesError) {
      const message = profilesError instanceof Error ? profilesError.message : 'Unable to load profiles.';
      return renderError(message, refetchProfiles);
    }
    if (!mainProfile) return renderEmptyProfiles();
    if (isForecastError) {
      const message = forecastError instanceof Error ? forecastError.message : 'Unable to generate forecast.';
      return renderError(message, refetchForecast);
    }
    if (isForecastLoading || !forecast) return renderLoading("Casting today's chart...");

    return (
      <>
        <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs tracking-[1px] uppercase text-slate-400">
                Today&apos;s Forecast
              </Text>
              <Text className="text-2xl font-semibold text-white">{mainProfile.name}</Text>
              <Text className="text-sm text-slate-400 mt-1">
                {forecast.sunSign} • {new Date(forecast.date).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center rounded-full bg-[rgba(99,102,241,0.15)] px-3 py-2"
              onPress={() => navigation.navigate('Profiles')}
            >
              <Ionicons name="swap-horizontal" size={18} color={colors.cosmic.text} />
              <Text className="ml-1 text-sm font-semibold text-white">Switch</Text>
            </TouchableOpacity>
          </View>
          <Text className="mt-3 text-base leading-6 text-white">{forecast.generalForecast}</Text>
        </View>

        <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
          <Text className="text-xs tracking-[1px] uppercase text-slate-400">Energy Scores</Text>
          <View className="mt-3 flex-row space-x-3">
            {renderScore('Love', forecast.loveScore)}
            {renderScore('Career', forecast.careerScore)}
            {renderScore('Health', forecast.healthScore)}
          </View>
        </View>

        <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
          <Text className="text-xs tracking-[1px] uppercase text-slate-400">Focus Areas</Text>
          {renderSection('Love', forecast.loveForecast)}
          {renderSection('Career', forecast.careerForecast)}
          {renderSection('Health', forecast.healthForecast)}
        </View>

        <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-xl border border-[#24243a] bg-[#1f1f33] p-4">
              <Text className="text-xs tracking-[0.8px] uppercase text-slate-400">Star Message</Text>
              <Text className="mt-1 text-lg font-bold text-white">Stay aligned, stay kind</Text>
              <Text className="mt-2 text-sm leading-5 text-slate-300">
                Ground into your routines and share encouragement. Your charts favor calm, steady momentum today.
              </Text>
            </View>
            <View className="w-32 rounded-xl border border-[#24243a] bg-[#1f1f33] p-4 items-center">
              <Text className="text-xs tracking-[0.8px] uppercase text-slate-400">Moon Phase</Text>
              <Text className="my-1 text-2xl">{moonPhase.emoji}</Text>
              <Text className="text-base font-semibold text-white text-center">{moonPhase.label}</Text>
              <Text className="mt-1 text-xs text-slate-400 text-center">Reflect + recalibrate</Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
          <Text className="text-xs tracking-[1px] uppercase text-slate-400">Lucky Signals</Text>
          <View className="mt-3 flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-xs text-slate-400">Numbers</Text>
              <Text className="mt-1 text-lg font-semibold text-white">
                {luckyNumbers.length ? luckyNumbers.join(' • ') : '--'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-400">Color</Text>
              <View className="mt-1 flex-row items-center">
                <View
                  className="mr-2 h-4 w-4 rounded-full border border-white/20"
                  style={{ backgroundColor: forecast.luckyColor || colors.cosmic.purple }}
                />
                <Text className="text-lg font-semibold text-white">{forecast.luckyColor ?? 'N/A'}</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-400">Gem</Text>
              <Text className="mt-1 text-lg font-semibold text-white">{forecast.luckyGem ?? 'N/A'}</Text>
            </View>
          </View>
        </View>

        {!!transits.length && (
          <View className="mx-4 mt-4 rounded-2xl border border-[#24243a] bg-[#1a1b2e] p-5">
            <Text className="text-xs tracking-[1px] uppercase text-slate-400">Planetary Transits</Text>
            {transits.map(transit => (
              <View key={`${transit.planet}-${transit.theme}`} className="mt-3 flex-row items-start">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-[rgba(99,102,241,0.16)]">
                  <Ionicons name="planet-outline" size={18} color={colors.cosmic.text} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-white">{`${transit.planet}: ${transit.theme}`}</Text>
                  <Text className="mt-1 text-sm leading-5 text-slate-300">{transit.guidance}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-[#0f0f1e]"
      refreshControl={
        <RefreshControl
          tintColor={colors.cosmic.text}
          refreshing={isProfilesRefetching || isForecastRefetching || isUsageRefetching}
          onRefresh={handleRefresh}
        />
      }
    >
      <LinearGradient colors={['#181a2f', '#0f0f1e']} className="border-b border-[#24243a] px-5 pt-6 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white">Today</Text>
            <Text className="mt-1 text-slate-400">{new Date().toDateString()}</Text>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-row items-center gap-2 rounded-full border border-[#2d2e3f] bg-white/5 px-3 py-2">
              <Ionicons name="planet" size={16} color="#c7d2fe" />
              <Text className="text-xs font-semibold text-white">Daily sky</Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-full border border-[#2d2e3f] bg-white/5 px-3 py-2">
              <Ionicons name="sparkles" size={16} color="#fcd34d" />
              <Text className="text-xs font-semibold text-white">Personal focus</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {renderMembershipCard()}
      {pageContent()}
    </ScrollView>
  );
}
