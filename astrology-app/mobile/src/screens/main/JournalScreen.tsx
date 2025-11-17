import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { journalApi, JournalEntry, MoodLevel, MoodStats } from '@/api/journal';

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({});
  const [editMode, setEditMode] = useState(false);

  const moodEmojis = {
    [MoodLevel.VERY_BAD]: { emoji: '😢', color: '#ef4444', label: 'Very Bad' },
    [MoodLevel.BAD]: { emoji: '😕', color: '#f59e0b', label: 'Bad' },
    [MoodLevel.NEUTRAL]: { emoji: '😐', color: '#6b7280', label: 'Neutral' },
    [MoodLevel.GOOD]: { emoji: '🙂', color: '#10b981', label: 'Good' },
    [MoodLevel.VERY_GOOD]: { emoji: '😄', color: '#10b981', label: 'Very Good' },
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entriesData, statsData] = await Promise.all([
        journalApi.getUserEntries(),
        journalApi.getMoodStats(30),
      ]);
      setEntries(entriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = () => {
    setCurrentEntry({
      entryDate: new Date().toISOString().split('T')[0],
      mood: MoodLevel.NEUTRAL,
      content: '',
      tags: [],
    });
    setEditMode(false);
    setShowEntryModal(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setEditMode(true);
    setShowEntryModal(true);
  };

  const handleSaveEntry = async () => {
    try {
      if (!currentEntry.mood || !currentEntry.content) {
        Alert.alert('Missing Information', 'Please select a mood and write some content');
        return;
      }

      if (editMode && currentEntry.id) {
        await journalApi.updateEntry(currentEntry.id, currentEntry);
      } else {
        await journalApi.createEntry(
          currentEntry.entryDate!,
          currentEntry.mood,
          currentEntry.content,
          currentEntry.tags || []
        );
      }

      setShowEntryModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to save entry:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await journalApi.deleteEntry(entryId);
            loadData();
          } catch (error) {
            console.error('Failed to delete entry:', error);
            Alert.alert('Error', 'Failed to delete entry');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Journal</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateEntry}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Mood Stats */}
        {stats && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>30-Day Mood Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.averageMood.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Mood</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalEntries}</Text>
                <Text style={styles.statLabel}>Entries</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>
                  {moodEmojis[Math.round(stats.averageMood) as MoodLevel]?.emoji || '😐'}
                </Text>
                <Text style={styles.statLabel}>Overall</Text>
              </View>
            </View>
          </View>
        )}

        {/* Entries List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="#6b7280" />
              <Text style={styles.emptyText}>No journal entries yet</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleCreateEntry}>
                <Text style={styles.emptyButtonText}>Create Your First Entry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => handleEditEntry(entry)}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.entryDate}>
                    <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                    <Text style={styles.entryDateText}>
                      {new Date(entry.entryDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  {entry.mood && (
                    <View style={styles.moodBadge}>
                      <Text style={styles.moodEmoji}>{moodEmojis[entry.mood]?.emoji}</Text>
                      <Text style={[styles.moodLabel, { color: moodEmojis[entry.mood]?.color }]}>
                        {moodEmojis[entry.mood]?.label}
                      </Text>
                    </View>
                  )}
                </View>
                {entry.content && (
                  <Text style={styles.entryContent} numberOfLines={3}>
                    {entry.content}
                  </Text>
                )}
                {entry.tags && entry.tags.length > 0 && (
                  <View style={styles.tags}>
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.entryFooter}>
                  <TouchableOpacity onPress={() => handleDeleteEntry(entry.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Entry Modal */}
      <Modal
        visible={showEntryModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowEntryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEntryModal(false)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Entry' : 'New Entry'}</Text>
            <TouchableOpacity onPress={handleSaveEntry}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Mood Selector */}
            <View style={styles.moodSelector}>
              <Text style={styles.label}>How are you feeling?</Text>
              <View style={styles.moodOptions}>
                {Object.entries(moodEmojis).map(([level, info]) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.moodOption,
                      currentEntry.mood === parseInt(level) && {
                        backgroundColor: info.color + '30',
                        borderColor: info.color,
                      },
                    ]}
                    onPress={() => setCurrentEntry({ ...currentEntry, mood: parseInt(level) as MoodLevel })}
                  >
                    <Text style={styles.moodOptionEmoji}>{info.emoji}</Text>
                    <Text style={styles.moodOptionLabel}>{info.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Content Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>What's on your mind?</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your thoughts..."
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={8}
                value={currentEntry.content || ''}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, content: text })}
              />
            </View>

            {/* Tags Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Tags (comma separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="gratitude, reflection, goals..."
                placeholderTextColor="#6b7280"
                value={currentEntry.tags?.join(', ') || ''}
                onChangeText={(text) =>
                  setCurrentEntry({ ...currentEntry, tags: text.split(',').map((t) => t.trim()) })
                }
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: '#1a1b2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryDateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  entryContent: {
    fontSize: 15,
    color: '#e5e7eb',
    lineHeight: 22,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#2d2e3f',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#a78bfa',
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2d2e3f',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2e3f',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6366f1',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  moodSelector: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodOption: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#1a1b2e',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodOptionLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  inputSection: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1a1b2e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 15,
  },
  textArea: {
    backgroundColor: '#1a1b2e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 15,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});
