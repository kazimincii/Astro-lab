import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme/colors';
import { profilesApi } from '@/api/profiles';
import { forecastsApi, DailyForecastResponse } from '@/api/forecasts';

type Profile = {
  id: string;
  name: string;
  sunSign?: string | null;
  isMainProfile?: boolean;
};

export default function TodayScreen({ navigation }: any) {
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
    if (!list.length) {
      return undefined;
    }
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

  const handleRefresh = useCallback(() => {
    refetchProfiles();
    if (mainProfile?.id) {
      refetchForecast();
    }
  }, [refetchProfiles, refetchForecast, mainProfile?.id]);

  const renderLoading = (message: string) => (
    <View style={styles.centerContent}>
      <ActivityIndicator color={colors.cosmic.purple} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );

  const renderError = (message: string, action?: () => void) => (
    <View style={styles.centerContent}>
      <Text style={styles.errorText}>{message}</Text>
      {action && (
        <TouchableOpacity style={styles.primaryButton} onPress={action}>
          <Text style={[styles.primaryButtonText, styles.primaryButtonTextSolo]}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyProfiles = () => (
    <View style={styles.centerContent}>
      <Ionicons name="people-outline" size={64} color={colors.cosmic.textSecondary} />
      <Text style={styles.emptyTitle}>Profiles needed</Text>
      <Text style={styles.emptySubtitle}>
        Add at least one profile to receive personalized daily insights.
      </Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Profiles')}
      >
        <Ionicons name="add" size={18} color={colors.cosmic.text} />
        <Text style={styles.primaryButtonText}>Create profile</Text>
      </TouchableOpacity>
    </View>
  );

  const luckyNumbers = (forecast?.luckyNumbers ?? []).slice(0, 4);
  const transits = forecast?.planetaryTransits
    ? Object.values(forecast.planetaryTransits)
    : [];

  const pageContent = () => {
    if (areProfilesLoading && !profilesData) {
      return renderLoading('Preparing your space...');
    }

    if (isProfilesError) {
      const message =
        profilesError instanceof Error
          ? profilesError.message
          : 'Unable to load profiles.';
      return renderError(message, refetchProfiles);
    }

    if (!mainProfile) {
      return renderEmptyProfiles();
    }

    if (isForecastError) {
      const message =
        forecastError instanceof Error
          ? forecastError.message
          : 'Unable to generate forecast.';
      return renderError(message, refetchForecast);
    }

    if (isForecastLoading || !forecast) {
      return renderLoading("Casting today's chart...");
    }

    return (
      <>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionLabel}>Today&apos;s Forecast</Text>
              <Text style={styles.cardTitle}>{mainProfile.name}</Text>
              <Text style={styles.cardSubtitle}>
                {forecast.sunSign} · {new Date(forecast.date).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => navigation.navigate('Profiles')}
            >
              <Ionicons name="swap-horizontal" size={18} color={colors.cosmic.text} />
              <Text style={styles.smallButtonText}>Switch</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.generalText}>{forecast.generalForecast}</Text>
        </View>

        <View style={[styles.card, styles.scoreCard]}>
          <Text style={styles.sectionLabel}>Energy Scores</Text>
          <View style={styles.scoreRow}>
            {renderScore('Love', forecast.loveScore)}
            {renderScore('Career', forecast.careerScore)}
            {renderScore('Health', forecast.healthScore, true)}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Focus Areas</Text>
          {renderSection('Love', forecast.loveForecast)}
          {renderSection('Career', forecast.careerForecast)}
          {renderSection('Health', forecast.healthForecast)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Lucky Signals</Text>
          <View style={styles.luckyRow}>
            <View style={styles.luckyBlock}>
              <Text style={styles.luckyLabel}>Numbers</Text>
              <Text style={styles.luckyValue}>
                {luckyNumbers.length ? luckyNumbers.join(' · ') : '—'}
              </Text>
            </View>
            <View style={styles.luckyBlock}>
              <Text style={styles.luckyLabel}>Color</Text>
              <View style={styles.colorTag}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: forecast.luckyColor || colors.cosmic.purple },
                  ]}
                />
                <Text style={styles.luckyValue}>{forecast.luckyColor ?? 'N/A'}</Text>
              </View>
            </View>
            <View style={[styles.luckyBlock, styles.luckyBlockLast]}>
              <Text style={styles.luckyLabel}>Gem</Text>
              <Text style={styles.luckyValue}>{forecast.luckyGem ?? 'N/A'}</Text>
            </View>
          </View>
        </View>

        {!!transits.length && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Planetary Transits</Text>
            {transits.map(transit => (
              <View key={`${transit.planet}-${transit.theme}`} style={styles.transitItem}>
                <View style={styles.transitIcon}>
                  <Ionicons
                    name="planet-outline"
                    size={18}
                    color={colors.cosmic.text}
                  />
                </View>
                <View style={styles.transitContent}>
                  <Text style={styles.transitTitle}>
                    {transit.planet}: {transit.theme}
                  </Text>
                  <Text style={styles.transitText}>{transit.guidance}</Text>
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
      style={styles.container}
      refreshControl={
        <RefreshControl
          tintColor={colors.cosmic.text}
      refreshing={isProfilesRefetching || isForecastRefetching}
          onRefresh={handleRefresh}
        />
      }
    >
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.dateLabel}>{new Date().toDateString()}</Text>
        </View>
      </View>

      {pageContent()}
    </ScrollView>
  );
}

const renderScore = (label: string, value?: number | null, isLast?: boolean) => (
  <View style={[styles.scoreChip, isLast && styles.scoreChipLast]}>
    <Text style={styles.scoreLabel}>{label}</Text>
    <Text style={styles.scoreValue}>
      {value !== null && value !== undefined ? value.toFixed(1) : '—'}
    </Text>
  </View>
);

const renderSection = (title: string, content?: string) => (
  <View style={styles.sectionRow}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionText}>{content ?? 'Awaiting download...'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.bg,
  },
  pageHeader: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.cosmic.text,
  },
  dateLabel: {
    color: colors.cosmic.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.cosmic.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#24243a',
  },
  sectionLabel: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  cardSubtitle: {
    color: colors.cosmic.textSecondary,
    marginTop: 4,
  },
  generalText: {
    color: colors.cosmic.text,
    lineHeight: 22,
  },
  scoreCard: {
    paddingBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  scoreChip: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2f2f45',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    alignItems: 'center',
  },
  scoreLabel: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
  },
  scoreValue: {
    color: colors.cosmic.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  scoreChipLast: {
    marginRight: 0,
  },
  sectionRow: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.cosmic.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionText: {
    color: colors.cosmic.textSecondary,
    lineHeight: 20,
  },
  luckyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  luckyBlock: {
    flex: 1,
    marginRight: 12,
  },
  luckyBlockLast: {
    marginRight: 0,
  },
  luckyLabel: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
  },
  luckyValue: {
    color: colors.cosmic.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  colorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ffffff22',
  },
  transitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transitContent: {
    flex: 1,
  },
  transitTitle: {
    color: colors.cosmic.text,
    fontWeight: '600',
  },
  transitText: {
    color: colors.cosmic.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  centerContent: {
    marginHorizontal: 16,
    marginTop: 32,
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.cosmic.card,
    borderWidth: 1,
    borderColor: '#24243a',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.cosmic.textSecondary,
  },
  errorText: {
    color: colors.cosmic.text,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.cosmic.text,
    marginTop: 16,
  },
  emptySubtitle: {
    color: colors.cosmic.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cosmic.purple,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 16,
  },
  primaryButtonText: {
    color: colors.cosmic.text,
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryButtonTextSolo: {
    marginLeft: 0,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  smallButtonText: {
    color: colors.cosmic.text,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
});
