import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/colors';
import { profilesApi } from '@/api/profiles';

type Profile = {
  id: string;
  name: string;
  sunSign?: string | null;
  relationship?: string | null;
  isMainProfile?: boolean;
  birthDate?: string;
  birthTime?: string;
};

export default function ProfilesScreen() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: profilesApi.getAll,
  });

  const profiles = data ?? [];
  const errorMessage =
    error instanceof Error ? error.message : t('screens.profiles.errors.unableToLoad');

  const handleAddProfile = useCallback(() => {
    Alert.alert(
      t('screens.profiles.comingSoon.title'),
      t('screens.profiles.comingSoon.message'),
    );
  }, [t]);

  const renderProfile = useCallback(({ item }: { item: Profile }) => {
    const birthDate = item.birthDate
      ? new Date(item.birthDate).toLocaleDateString()
      : t('screens.profiles.metadata.unknownDate');
    const birthTime = item.birthTime?.slice(0, 5) ?? '--:--';
    const sunSignLabel = item.sunSign
      ? item.sunSign.toUpperCase()
      : t('screens.profiles.metadata.signUnknown');

    return (
      <TouchableOpacity style={styles.profileCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.profileName}>{item.name}</Text>
          {item.isMainProfile && (
            <View style={styles.mainBadge}>
              <Ionicons name="star" size={14} color={colors.cosmic.gold} />
              <Text style={styles.mainBadgeText}>{t('screens.profiles.main')}</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="sunny-outline"
            size={16}
            color={colors.cosmic.textSecondary}
          />
          <Text style={styles.metaText}>{sunSignLabel}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.cosmic.textSecondary}
          />
          <Text style={styles.metaText}>
            {birthDate} · {birthTime}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="people-outline"
            size={16}
            color={colors.cosmic.textSecondary}
          />
          <Text style={styles.metaText}>
            {item.relationship ? item.relationship : t('screens.profiles.metadata.relationshipSelf')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [t]);

  const emptyComponent = (
    <View style={styles.emptyState}>
      <Ionicons
        name="person-add-outline"
        size={64}
        color={colors.cosmic.textSecondary}
      />
      <Text style={styles.emptyText}>{t('screens.profiles.empty.title')}</Text>
      <Text style={styles.emptySubtext}>
        {t('screens.profiles.empty.message')}
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleAddProfile}>
        <Ionicons name="add" size={18} color={colors.cosmic.text} />
        <Text style={styles.primaryButtonText}>{t('screens.profiles.addProfile')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (isLoading && !isRefetching) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator color={colors.cosmic.purple} />
          <Text style={styles.loadingText}>{t('screens.profiles.loading')}</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => refetch()}>
            <Text style={[styles.primaryButtonText, styles.primaryButtonTextSolo]}>
              {t('screens.profiles.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={profiles}
        renderItem={renderProfile}
        keyExtractor={(item: Profile) => item.id}
        contentContainerStyle={
          profiles.length === 0 ? styles.listEmptyContainer : undefined
        }
        ListEmptyComponent={emptyComponent}
        refreshControl={
          <RefreshControl
            tintColor={colors.cosmic.text}
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('screens.profiles.title')}</Text>
          <Text style={styles.subtitle}>
            {t('screens.profiles.subtitle')}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
          <Ionicons name="add" size={24} color={colors.cosmic.text} />
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cosmic.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.cosmic.textSecondary,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.cosmic.purple,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: colors.cosmic.textSecondary,
    marginTop: 12,
  },
  errorText: {
    color: colors.cosmic.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cosmic.purple,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.cosmic.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.cosmic.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  listEmptyContainer: {
    flexGrow: 1,
  },
  profileCard: {
    backgroundColor: colors.cosmic.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#26263a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  mainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  mainBadgeText: {
    color: colors.cosmic.gold,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    color: colors.cosmic.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
});
