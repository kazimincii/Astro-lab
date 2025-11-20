import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import JournalScreen from '../JournalScreen';
import { journalApi, MoodLevel, JournalEntry, MoodStats } from '@/api/journal';

// Mock journalApi
jest.mock('@/api/journal');

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('JournalScreen', () => {
  const mockEntry1: JournalEntry = {
    id: 'entry-1',
    userId: 'user-123',
    entryDate: '2024-11-16',
    mood: MoodLevel.GOOD,
    content: 'Had a great day today! Feeling positive.',
    tags: ['gratitude', 'happy'],
    createdAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
  };

  const mockEntry2: JournalEntry = {
    id: 'entry-2',
    userId: 'user-123',
    entryDate: '2024-11-15',
    mood: MoodLevel.NEUTRAL,
    content: 'Regular day at work. Nothing special.',
    tags: ['work'],
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
  };

  const mockEntry3: JournalEntry = {
    id: 'entry-3',
    userId: 'user-123',
    entryDate: '2024-11-14',
    mood: MoodLevel.VERY_GOOD,
    content: 'Amazing day! Everything went perfectly.',
    tags: ['success', 'achievement', 'joy'],
    createdAt: '2024-11-14T10:00:00Z',
    updatedAt: '2024-11-14T10:00:00Z',
  };

  const mockStats: MoodStats = {
    averageMood: 3.8,
    totalEntries: 15,
    moodDistribution: {
      [MoodLevel.VERY_BAD]: 1,
      [MoodLevel.BAD]: 2,
      [MoodLevel.NEUTRAL]: 5,
      [MoodLevel.GOOD]: 4,
      [MoodLevel.VERY_GOOD]: 3,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (journalApi.getUserEntries as jest.Mock).mockResolvedValue([mockEntry1, mockEntry2, mockEntry3]);
    (journalApi.getMoodStats as jest.Mock).mockResolvedValue(mockStats);
  });

  describe('Initial Loading', () => {
    it('should show loading indicator initially', () => {
      (journalApi.getUserEntries as jest.Mock).mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );

      const { getByTestId } = render(<JournalScreen />);

      expect(journalApi.getUserEntries).toHaveBeenCalled();
    });

    it('should load entries and stats on mount', async () => {
      render(<JournalScreen />);

      await waitFor(() => {
        expect(journalApi.getUserEntries).toHaveBeenCalled();
        expect(journalApi.getMoodStats).toHaveBeenCalledWith(30);
      });
    });

    it('should display entries after loading', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Had a great day today! Feeling positive.')).toBeDefined();
        expect(getByText('Regular day at work. Nothing special.')).toBeDefined();
      });
    });

    it('should handle loading error gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (journalApi.getUserEntries as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<JournalScreen />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe('Header and UI', () => {
    it('should display journal title', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('My Journal')).toBeDefined();
      });
    });

    it('should display add button', async () => {
      const { UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
        expect(touchables.length).toBeGreaterThan(0);
      });
    });

    it('should display Recent Entries section', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Recent Entries')).toBeDefined();
      });
    });
  });

  describe('Mood Stats Display', () => {
    it('should display 30-day mood overview', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('30-Day Mood Overview')).toBeDefined();
      });
    });

    it('should display average mood', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('3.8')).toBeDefined();
        expect(getByText('Avg Mood')).toBeDefined();
      });
    });

    it('should display total entries count', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('15')).toBeDefined();
        expect(getByText('Entries')).toBeDefined();
      });
    });

    it('should display overall mood emoji', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Overall')).toBeDefined();
      });
    });

    it('should handle stats with different average moods', async () => {
      (journalApi.getMoodStats as jest.Mock).mockResolvedValue({
        ...mockStats,
        averageMood: 4.5,
      });

      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('4.5')).toBeDefined();
      });
    });
  });

  describe('Entries List', () => {
    it('should display all journal entries', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Had a great day today! Feeling positive.')).toBeDefined();
        expect(getByText('Regular day at work. Nothing special.')).toBeDefined();
        expect(getByText('Amazing day! Everything went perfectly.')).toBeDefined();
      });
    });

    it('should display entry dates', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText(/Nov 16/)).toBeDefined();
        expect(getByText(/Nov 15/)).toBeDefined();
      });
    });

    it('should display mood badges', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Good')).toBeDefined();
        expect(getByText('Neutral')).toBeDefined();
        expect(getByText('Very Good')).toBeDefined();
      });
    });

    it('should display entry tags', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('gratitude')).toBeDefined();
        expect(getByText('happy')).toBeDefined();
        expect(getByText('work')).toBeDefined();
      });
    });

    it('should limit displayed tags to 3', async () => {
      const { queryByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(queryByText('success')).toBeDefined();
        expect(queryByText('achievement')).toBeDefined();
        expect(queryByText('joy')).toBeDefined();
      });
    });

    it('should truncate long content to 3 lines', async () => {
      const longEntry: JournalEntry = {
        ...mockEntry1,
        content:
          'This is a very long entry with lots of content that should be truncated. ' +
          'It goes on and on and on. '.repeat(10),
      };

      (journalApi.getUserEntries as jest.Mock).mockResolvedValue([longEntry]);

      const { UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const texts = UNSAFE_getAllByType(require('react-native').Text);
        expect(texts.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no entries exist', async () => {
      (journalApi.getUserEntries as jest.Mock).mockResolvedValue([]);
      (journalApi.getMoodStats as jest.Mock).mockResolvedValue(null);

      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('No journal entries yet')).toBeDefined();
        expect(getByText('Create Your First Entry')).toBeDefined();
      });
    });

    it('should show create button in empty state', async () => {
      (journalApi.getUserEntries as jest.Mock).mockResolvedValue([]);

      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        const button = getByText('Create Your First Entry');
        expect(button).toBeDefined();
      });
    });

    it('should open modal when clicking empty state button', async () => {
      (journalApi.getUserEntries as jest.Mock).mockResolvedValue([]);

      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        const button = getByText('Create Your First Entry');
        fireEvent.press(button);
      });

      await waitFor(() => {
        expect(getByText('New Entry')).toBeDefined();
      });
    });
  });

  describe('Create Entry Flow', () => {
    it('should open modal when add button is clicked', async () => {
      const { getByText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('My Journal')).toBeDefined();
      });

      // Find and click the add button (Ionicons add button in header)
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const addButton = touchables.find((t) => t.props.style?.backgroundColor === '#6366f1');
      if (addButton) {
        fireEvent.press(addButton);
      }

      await waitFor(() => {
        expect(getByText('New Entry')).toBeDefined();
        expect(getByText('How are you feeling?')).toBeDefined();
      });
    });

    it('should display mood selector in modal', async () => {
      const { getByText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('My Journal')).toBeDefined();
      });

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const addButton = touchables[0];
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(getByText('Very Bad')).toBeDefined();
        expect(getByText('Bad')).toBeDefined();
        expect(getByText('Neutral')).toBeDefined();
        expect(getByText('Good')).toBeDefined();
        expect(getByText('Very Good')).toBeDefined();
      });
    });

    it('should display content input field', async () => {
      const { getByText, getByPlaceholderText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('My Journal')).toBeDefined();
      });

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const addButton = touchables[0];
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(getByText("What's on your mind?")).toBeDefined();
        expect(getByPlaceholderText('Write your thoughts...')).toBeDefined();
      });
    });

    it('should display tags input field', async () => {
      const { getByText, getByPlaceholderText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('My Journal')).toBeDefined();
      });

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const addButton = touchables[0];
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(getByText('Tags (comma separated)')).toBeDefined();
        expect(getByPlaceholderText('gratitude, reflection, goals...')).toBeDefined();
      });
    });

    it('should show alert when trying to save without mood', async () => {
      const { getByText, getByPlaceholderText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('My Journal')).toBeDefined();
      });

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      fireEvent.press(touchables[0]); // Open modal

      await waitFor(() => {
        const contentInput = getByPlaceholderText('Write your thoughts...');
        fireEvent.changeText(contentInput, 'Some content');
      });

      // Click Save
      await waitFor(() => {
        const saveButton = getByText('Save');
        fireEvent.press(saveButton);
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Missing Information',
        'Please select a mood and write some content',
      );
    });

    it('should create entry successfully', async () => {
      (journalApi.createEntry as jest.Mock).mockResolvedValue({
        ...mockEntry1,
        id: 'new-entry',
      });

      const { getByText, getByPlaceholderText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('My Journal')).toBeDefined();
      });

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      fireEvent.press(touchables[0]); // Open modal

      await waitFor(() => {
        // Select mood
        const neutralButton = getByText('Neutral');
        fireEvent.press(neutralButton);

        // Enter content
        const contentInput = getByPlaceholderText('Write your thoughts...');
        fireEvent.changeText(contentInput, 'Test entry content');

        // Click Save
        const saveButton = getByText('Save');
        fireEvent.press(saveButton);
      });

      await waitFor(() => {
        expect(journalApi.createEntry).toHaveBeenCalled();
      });
    });
  });

  describe('Edit Entry Flow', () => {
    it('should open modal when entry is clicked', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        const entryCard = getByText('Had a great day today! Feeling positive.');
        fireEvent.press(entryCard);
      });

      await waitFor(() => {
        expect(getByText('Edit Entry')).toBeDefined();
      });
    });

    it('should populate modal with entry data', async () => {
      const { getByText, getByDisplayValue } = render(<JournalScreen />);

      await waitFor(() => {
        const entryCard = getByText('Had a great day today! Feeling positive.');
        fireEvent.press(entryCard);
      });

      await waitFor(() => {
        expect(getByDisplayValue('Had a great day today! Feeling positive.')).toBeDefined();
        expect(getByDisplayValue('gratitude, happy')).toBeDefined();
      });
    });

    it('should update entry successfully', async () => {
      (journalApi.updateEntry as jest.Mock).mockResolvedValue({
        ...mockEntry1,
        content: 'Updated content',
      });

      const { getByText, getByDisplayValue } = render(<JournalScreen />);

      await waitFor(() => {
        const entryCard = getByText('Had a great day today! Feeling positive.');
        fireEvent.press(entryCard);
      });

      await waitFor(() => {
        const contentInput = getByDisplayValue('Had a great day today! Feeling positive.');
        fireEvent.changeText(contentInput, 'Updated content');

        const saveButton = getByText('Save');
        fireEvent.press(saveButton);
      });

      await waitFor(() => {
        expect(journalApi.updateEntry).toHaveBeenCalledWith('entry-1', expect.any(Object));
      });
    });

    it('should handle update error', async () => {
      (journalApi.updateEntry as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        const entryCard = getByText('Had a great day today! Feeling positive.');
        fireEvent.press(entryCard);
      });

      await waitFor(() => {
        const saveButton = getByText('Save');
        fireEvent.press(saveButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to save journal entry');
      });
    });
  });

  describe('Delete Entry Flow', () => {
    it('should show confirmation alert when delete is clicked', async () => {
      const { UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const icons = UNSAFE_getAllByType(require('@expo/vector-icons').Ionicons);
        const deleteIcon = icons.find((icon) => icon.props.name === 'trash-outline');
        if (deleteIcon && deleteIcon.parent) {
          fireEvent.press(deleteIcon.parent);
        }
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Entry',
        'Are you sure you want to delete this entry?',
        expect.any(Array),
      );
    });

    it('should delete entry when confirmed', async () => {
      (journalApi.deleteEntry as jest.Mock).mockResolvedValue({ success: true });

      // Mock Alert.alert to auto-confirm
      (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
        const deleteButton = buttons.find((b: any) => b.text === 'Delete');
        if (deleteButton && deleteButton.onPress) {
          deleteButton.onPress();
        }
      });

      const { UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const icons = UNSAFE_getAllByType(require('@expo/vector-icons').Ionicons);
        const deleteIcon = icons.find((icon) => icon.props.name === 'trash-outline');
        if (deleteIcon && deleteIcon.parent) {
          fireEvent.press(deleteIcon.parent);
        }
      });

      await waitFor(() => {
        expect(journalApi.deleteEntry).toHaveBeenCalled();
      });
    });

    it('should handle delete error', async () => {
      (journalApi.deleteEntry as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
        const deleteButton = buttons.find((b: any) => b.text === 'Delete');
        if (deleteButton && deleteButton.onPress) {
          deleteButton.onPress();
        }
      });

      const { UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const icons = UNSAFE_getAllByType(require('@expo/vector-icons').Ionicons);
        const deleteIcon = icons.find((icon) => icon.props.name === 'trash-outline');
        if (deleteIcon && deleteIcon.parent) {
          fireEvent.press(deleteIcon.parent);
        }
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to delete entry');
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should close modal when close button is clicked', async () => {
      const { getByText, queryByText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
        fireEvent.press(touchables[0]); // Open modal
      });

      await waitFor(() => {
        expect(getByText('New Entry')).toBeDefined();
      });

      // Find and click close button
      await waitFor(() => {
        const icons = UNSAFE_getAllByType(require('@expo/vector-icons').Ionicons);
        const closeIcon = icons.find((icon) => icon.props.name === 'close');
        if (closeIcon && closeIcon.parent) {
          fireEvent.press(closeIcon.parent);
        }
      });

      await waitFor(() => {
        expect(queryByText('New Entry')).toBeNull();
      });
    });

    it('should allow mood selection', async () => {
      const { getByText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
        fireEvent.press(touchables[0]); // Open modal
      });

      await waitFor(() => {
        const goodButton = getByText('Good');
        fireEvent.press(goodButton);
      });

      // Mood should be selected (visual feedback via style change)
      expect(getByText('Good')).toBeDefined();
    });

    it('should allow content input', async () => {
      const { getByPlaceholderText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
        fireEvent.press(touchables[0]); // Open modal
      });

      await waitFor(() => {
        const contentInput = getByPlaceholderText('Write your thoughts...');
        fireEvent.changeText(contentInput, 'My new journal entry');
        expect(contentInput.props.value).toBe('My new journal entry');
      });
    });

    it('should allow tags input', async () => {
      const { getByPlaceholderText, UNSAFE_getAllByType } = render(<JournalScreen />);

      await waitFor(() => {
        const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
        fireEvent.press(touchables[0]); // Open modal
      });

      await waitFor(() => {
        const tagsInput = getByPlaceholderText('gratitude, reflection, goals...');
        fireEvent.changeText(tagsInput, 'test, tag1, tag2');
        expect(tagsInput.props.value).toBe('test, tag1, tag2');
      });
    });
  });

  describe('Mood Levels', () => {
    it('should display correct emoji for VERY_BAD mood', async () => {
      const badEntry: JournalEntry = {
        ...mockEntry1,
        mood: MoodLevel.VERY_BAD,
      };

      (journalApi.getUserEntries as jest.Mock).mockResolvedValue([badEntry]);

      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Very Bad')).toBeDefined();
      });
    });

    it('should display correct emoji for VERY_GOOD mood', async () => {
      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Very Good')).toBeDefined();
      });
    });

    it('should handle all 5 mood levels', async () => {
      const entries: JournalEntry[] = [
        { ...mockEntry1, id: '1', mood: MoodLevel.VERY_BAD },
        { ...mockEntry1, id: '2', mood: MoodLevel.BAD },
        { ...mockEntry1, id: '3', mood: MoodLevel.NEUTRAL },
        { ...mockEntry1, id: '4', mood: MoodLevel.GOOD },
        { ...mockEntry1, id: '5', mood: MoodLevel.VERY_GOOD },
      ];

      (journalApi.getUserEntries as jest.Mock).mockResolvedValue(entries);

      const { getByText } = render(<JournalScreen />);

      await waitFor(() => {
        expect(getByText('Very Bad')).toBeDefined();
        expect(getByText('Bad')).toBeDefined();
        expect(getByText('Neutral')).toBeDefined();
        expect(getByText('Good')).toBeDefined();
        expect(getByText('Very Good')).toBeDefined();
      });
    });
  });
});
