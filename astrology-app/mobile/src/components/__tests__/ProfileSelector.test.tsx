import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ProfileSelector } from '../ProfileSelector';
import { useProfile } from '@/contexts/ProfileContext';
import { profilesApi } from '@/api/profiles';

const mockProfiles = [
  {
    id: '1',
    name: 'John Doe',
    sunSign: 'Aries',
    moonSign: 'Taurus',
      risingSign: 'Gemini',
      relationship: 'Self',
      isMainProfile: true,
    },
  {
    id: '2',
    name: 'Jane Smith',
    sunSign: 'Leo',
    moonSign: 'Virgo',
    risingSign: 'Libra',
    relationship: 'Partner',
    isMainProfile: false,
  },
];

// Mock dependencies
jest.mock('@/contexts/ProfileContext');
jest.mock('@/api/profiles');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: mockProfiles,
    isLoading: false,
    error: null,
  })),
}));

const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;
const mockProfilesApi = profilesApi as jest.Mocked<typeof profilesApi>;

describe('ProfileSelector', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfile.mockReturnValue({
      selectedProfile: mockProfiles[0],
      setSelectedProfile: jest.fn(),
      isLoading: false,
      error: null,
      refreshProfile: jest.fn(),
    });
    mockProfilesApi.getAll.mockResolvedValue(mockProfiles);
  });

  describe('Full mode', () => {
    it('should render full selector with selected profile', () => {
      const { getByText, getAllByText } = render(<ProfileSelector />);

      expect(getByText('Reading For:')).toBeTruthy();
      expect(getAllByText('John Doe')[0]).toBeTruthy();
      expect(getByText('Aries')).toBeTruthy();
    });

    it('should open modal when selector is pressed', () => {
      const { getByText, queryByText, getAllByText } = render(<ProfileSelector />);

      expect(queryByText('Select Profile')).toBeNull();

      act(() => {
        fireEvent.press(getAllByText('John Doe')[0]);
      });

      expect(getByText('Select Profile')).toBeTruthy();
    });

    it('should display all profiles in modal', async () => {
      const { getByText, getAllByText } = render(<ProfileSelector />);

      act(() => {
        fireEvent.press(getAllByText('John Doe')[0]);
      });

      await waitFor(() => {
        expect(getAllByText('John Doe')[0]).toBeTruthy();
        expect(getByText('Jane Smith')).toBeTruthy();
      });
    });

    it('should select profile when pressed', async () => {
      const setSelectedProfile = jest.fn();
      mockUseProfile.mockReturnValue({
        selectedProfile: mockProfiles[0],
        setSelectedProfile,
        isLoading: false,
        error: null,
        refreshProfile: jest.fn(),
      });

      const { getByText, getAllByText } = render(<ProfileSelector />);

      act(() => {
        fireEvent.press(getAllByText('John Doe')[0]);
      });
      act(() => {
        const janeButton = getAllByText('Jane Smith')[0];
        fireEvent.press(janeButton);
      });

      expect(setSelectedProfile).toHaveBeenCalledWith(mockProfiles[1]);
    });

    it('should close modal when close button is pressed', () => {
      const { getByText, queryByText } = render(<ProfileSelector />);

      act(() => {
        fireEvent.press(getAllByText('John Doe')[0]);
      });
      expect(getByText('Select Profile')).toBeTruthy();

      // mocked icon renders text "close" via jest.setup mock
      const closeButton = getByText('close');
      act(() => {
        fireEvent.press(closeButton);
      });

      expect(queryByText('Select Profile')).toBeNull();
    });
  });

  describe('Compact mode', () => {
    it('should render compact selector', () => {
      const { getByText, queryByText } = render(<ProfileSelector compact />);

      expect(getAllByText('John Doe')[0]).toBeTruthy();
      expect(queryByText('Reading For:')).toBeNull();
    });

    it('should show "Select Profile" when no profile is selected', () => {
      mockUseProfile.mockReturnValue({
        selectedProfile: null,
        setSelectedProfile: jest.fn(),
        isLoading: false,
        error: null,
        refreshProfile: jest.fn(),
      });

      const { getByText } = render(<ProfileSelector compact />);

      expect(getByText('Select Profile')).toBeTruthy();
    });
  });

  describe('Loading state', () => {
    it('should show loading indicator when profiles are loading', () => {
      const useQuery = require('@tanstack/react-query').useQuery;
      useQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      const { getByTestId } = render(<ProfileSelector />);
      const { findByTestId } = render(<ProfileSelector />);

      // Open modal
      const selector = getByText('Reading For:');
      if (selector) {
        fireEvent.press(selector);
      }

      // Should show loading indicator in modal
      // (This depends on your implementation)
    });
  });

  describe('Profile display', () => {
    it('should display profile with sun sign and relationship', async () => {
      const { getByText } = render(<ProfileSelector />);

      fireEvent.press(getAllByText('John Doe')[0]);

      await waitFor(() => {
        expect(getByText(/Aries/)).toBeTruthy();
        expect(getByText(/Self/)).toBeTruthy();
      });
    });

    it('should handle profile without sun sign gracefully', async () => {
      const profilesWithoutSign = [
        {
          ...mockProfiles[0],
          sunSign: null,
        },
      ];

      mockProfilesApi.getAll.mockResolvedValue(profilesWithoutSign);

      const { getByText } = render(<ProfileSelector />);

      fireEvent.press(getAllByText('John Doe')[0]);

      await waitFor(() => {
        expect(getByText(/Unknown sign/)).toBeTruthy();
      });
    });
  });

  describe('Profile selection', () => {
    it('should highlight selected profile in modal', async () => {
      const { getByText } = render(<ProfileSelector />);

      fireEvent.press(getAllByText('John Doe')[0]);

      await waitFor(() => {
        const selectedItem = getAllByText('John Doe')[0].parent;
        // Check if selected item has special styling
        // (This depends on your implementation)
      });
    });
  });
});

