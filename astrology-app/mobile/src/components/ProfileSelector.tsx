import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme/colors';
import { profilesApi } from '@/api/profiles';
import { useProfile, Profile } from '@/contexts/ProfileContext';

interface ProfileSelectorProps {
  compact?: boolean;
}

export function ProfileSelector({ compact = false }: ProfileSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedProfile, setSelectedProfile } = useProfile();

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: profilesApi.getAll,
  });

  const handleSelectProfile = useCallback(
    (profile: Profile) => {
      setSelectedProfile(profile);
      setModalVisible(false);
    },
    [setSelectedProfile]
  );

  const renderProfileItem = useCallback(
    ({ item }: { item: Profile }) => {
      const isSelected = selectedProfile?.id === item.id;

      return (
        <TouchableOpacity
          style={[styles.profileItem, isSelected && styles.profileItemSelected]}
          onPress={() => handleSelectProfile(item)}
        >
          <View style={styles.profileItemContent}>
            <View>
              <Text style={styles.profileItemName}>{item.name}</Text>
              <Text style={styles.profileItemMeta}>
                {item.sunSign || 'Unknown sign'} • {item.relationship || 'Self'}
              </Text>
            </View>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={24} color={colors.cosmic.purple} />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedProfile, handleSelectProfile]
  );

  if (compact) {
    return (
      <>
        <TouchableOpacity
          style={styles.compactSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.compactText} numberOfLines={1}>
            {selectedProfile?.name || 'Select Profile'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.cosmic.textSecondary} />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Profile</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.cosmic.text} />
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={colors.cosmic.purple} />
                </View>
              ) : (
                <FlatList
                  data={profiles}
                  renderItem={renderProfileItem}
                  keyExtractor={(item) => item.id}
                  style={styles.profileList}
                />
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  return (
    <View style={styles.fullSelector}>
      <Text style={styles.label}>Reading For:</Text>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <View>
            <Text style={styles.selectedName}>{selectedProfile?.name || 'Select Profile'}</Text>
            {selectedProfile?.sunSign && (
              <Text style={styles.selectedMeta}>{selectedProfile.sunSign}</Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={24} color={colors.cosmic.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.cosmic.text} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.cosmic.purple} />
              </View>
            ) : (
              <FlatList
                data={profiles}
                renderItem={renderProfileItem}
                keyExtractor={(item) => item.id}
                style={styles.profileList}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullSelector: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cosmic.textSecondary,
    marginBottom: 8,
  },
  selectorButton: {
    backgroundColor: colors.cosmic.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#26263a',
  },
  selectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  selectedMeta: {
    fontSize: 13,
    color: colors.cosmic.textSecondary,
    marginTop: 2,
  },
  compactSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cosmic.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#26263a',
  },
  compactText: {
    fontSize: 14,
    color: colors.cosmic.text,
    marginRight: 4,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cosmic.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#26263a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  profileList: {
    padding: 16,
  },
  profileItem: {
    backgroundColor: colors.cosmic.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#26263a',
  },
  profileItemSelected: {
    borderColor: colors.cosmic.purple,
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
  },
  profileItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  profileItemMeta: {
    fontSize: 13,
    color: colors.cosmic.textSecondary,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
