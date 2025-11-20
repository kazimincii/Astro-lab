import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: new Date(),
    birthTime: '',
    birthPlace: '',
    relationship: '',
    isMainProfile: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const createMutation = useMutation({
    mutationFn: profilesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setModalVisible(false);
      resetForm();
      Alert.alert(
        t('screens.profiles.success.title'),
        t('screens.profiles.success.message'),
      );
    },
    onError: (err: any) => {
      Alert.alert(
        t('screens.profiles.errors.createFailed'),
        err.message || t('screens.profiles.errors.tryAgain'),
      );
    },
  });

  const profiles = data ?? [];
  const errorMessage =
    error instanceof Error ? error.message : t('screens.profiles.errors.unableToLoad');

  const resetForm = () => {
    setFormData({
      name: '',
      birthDate: new Date(),
      birthTime: '',
      birthPlace: '',
      relationship: '',
      isMainProfile: false,
    });
  };

  const handleAddProfile = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert(t('screens.profiles.errors.validation'), t('screens.profiles.errors.nameRequired'));
      return;
    }
    if (!formData.birthPlace.trim()) {
      Alert.alert(t('screens.profiles.errors.validation'), t('screens.profiles.errors.placeRequired'));
      return;
    }
    if (!formData.birthTime.trim()) {
      Alert.alert(t('screens.profiles.errors.validation'), t('screens.profiles.errors.timeRequired'));
      return;
    }

    createMutation.mutate({
      name: formData.name.trim(),
      birthDate: formData.birthDate.toISOString(),
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace.trim(),
      relationship: formData.relationship.trim() || undefined,
      isMainProfile: formData.isMainProfile,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, birthDate: selectedDate });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setFormData({ ...formData, birthTime: `${hours}:${minutes}` });
    }
  };

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

      {/* Add Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={colors.cosmic.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('screens.profiles.addProfile')}</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('screens.profiles.form.name')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('screens.profiles.form.namePlaceholder')}
                placeholderTextColor={colors.cosmic.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* Birth Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('screens.profiles.form.birthDate')} *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.cosmic.text} />
                <Text style={styles.dateButtonText}>
                  {formData.birthDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.birthDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Birth Time */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('screens.profiles.form.birthTime')} *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.cosmic.text} />
                <Text style={styles.dateButtonText}>
                  {formData.birthTime || t('screens.profiles.form.selectTime')}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>

            {/* Birth Place */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('screens.profiles.form.birthPlace')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('screens.profiles.form.placePlaceholder')}
                placeholderTextColor={colors.cosmic.textSecondary}
                value={formData.birthPlace}
                onChangeText={(text) => setFormData({ ...formData, birthPlace: text })}
              />
            </View>

            {/* Relationship */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('screens.profiles.form.relationship')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('screens.profiles.form.relationshipPlaceholder')}
                placeholderTextColor={colors.cosmic.textSecondary}
                value={formData.relationship}
                onChangeText={(text) => setFormData({ ...formData, relationship: text })}
              />
            </View>

            {/* Main Profile Toggle */}
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Ionicons name="star" size={20} color={colors.cosmic.gold} />
                <Text style={styles.label}>{t('screens.profiles.form.mainProfile')}</Text>
              </View>
              <Switch
                value={formData.isMainProfile}
                onValueChange={(value) => setFormData({ ...formData, isMainProfile: value })}
                trackColor={{ false: colors.cosmic.border, true: colors.cosmic.purple }}
                thumbColor={formData.isMainProfile ? colors.cosmic.gold : colors.cosmic.textSecondary}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, createMutation.isPending && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color={colors.cosmic.text} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={colors.cosmic.text} />
                  <Text style={styles.submitButtonText}>{t('screens.profiles.form.submit')}</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.cosmic.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cosmic.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.cosmic.text,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cosmic.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cosmic.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.cosmic.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.cosmic.border,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cosmic.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cosmic.border,
  },
  dateButtonText: {
    color: colors.cosmic.text,
    fontSize: 15,
    marginLeft: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 8,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cosmic.purple,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    color: colors.cosmic.text,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
