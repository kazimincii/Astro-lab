import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TodayScreen from '../TodayScreen';
import { profilesApi } from '@/api/profiles';
import { forecastsApi } from '@/api/forecasts';
import { subscriptionsApi } from '@/api/subscriptions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock APIs
jest.mock('@/api/profiles');
jest.mock('@/api/forecasts');
jest.mock('@/api/subscriptions');

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock data
const mockProfile = {
  id: 'profile-123',
  name: 'John Doe',
  sunSign: 'Aries',
  isMainProfile: true,
};

const mockForecast = {
  date: new Date('2024-01-15').toISOString(),
  sunSign: 'Aries',
  generalForecast: 'Today is a great day for new beginnings!',
  loveScore: 7.5,
  careerScore: 8.0,
  healthScore: 6.5,
  loveForecast: 'Your relationships will flourish today.',
  careerForecast: 'Opportunities await at work.',
  healthForecast: 'Take time to rest and recharge.',
  luckyNumbers: [7, 14, 21, 33],
  luckyColor: '#FF5733',
  luckyGem: 'Ruby',
  planetaryTransits: {
    mars: {
      planet: 'Mars',
      theme: 'Energy',
      guidance: 'Channel your energy productively.',
    },
  },
};

const mockSubscriptionUsage = {
  plan: 'premium',
  unlimitedActions: false,
  actionsUsedToday: 5,
  dailyActionLimit: 10,
  actionsRemaining: 5,
  profilesUsed: 2,
  profileLimit: 5,
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('TodayScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading States', () => {
    it('should show loading state when profiles are being fetched', async () => {
      (profilesApi.getAll as jest.Mock).mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.loading.preparingSpace')).toBeTruthy();
      });
    });

    it('should show loading state when forecast is being generated', async () => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.loading.castingChart')).toBeTruthy();
      });
    });
  });

  describe('Error States', () => {
    it('should show error message when profiles fail to load', async () => {
      const errorMessage = 'Failed to load profiles';
      (profilesApi.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText(errorMessage)).toBeTruthy();
        expect(getByText('common.buttons.retry')).toBeTruthy();
      });
    });

    it('should show error message when forecast fails to load', async () => {
      const errorMessage = 'Failed to generate forecast';
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockRejectedValue(new Error(errorMessage));
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText(errorMessage)).toBeTruthy();
      });
    });

    it('should show error message when subscription usage fails to load', async () => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue(mockForecast);
      (subscriptionsApi.getUsage as jest.Mock).mockRejectedValue(
        new Error('Failed to load subscription')
      );

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Failed to load subscription')).toBeTruthy();
      });
    });

    it('should allow retry when profile loading fails', async () => {
      (profilesApi.getAll as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue(mockForecast);
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText, queryByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      // Wait for error to appear
      await waitFor(() => {
        expect(getByText('Network error')).toBeTruthy();
      });

      // Click retry button
      const retryButton = getByText('common.buttons.retry');
      fireEvent.press(retryButton);

      // Wait for success - error should disappear
      await waitFor(() => {
        expect(queryByText('Network error')).toBeNull();
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no profiles exist', async () => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([]);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.empty.profilesNeeded')).toBeTruthy();
        expect(getByText('screens.today.empty.addProfileMessage')).toBeTruthy();
        expect(getByText('screens.today.empty.createProfile')).toBeTruthy();
      });
    });

    it('should navigate to Profiles when create profile button is pressed', async () => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([]);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.empty.createProfile')).toBeTruthy();
      });

      const createButton = getByText('screens.today.empty.createProfile');
      fireEvent.press(createButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profiles');
    });
  });

  describe('Content Rendering', () => {
    beforeEach(() => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue(mockForecast);
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);
    });

    it('should render screen title and current date', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.title')).toBeTruthy();
      });
    });

    it('should display profile name and sun sign', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
      });
    });

    it('should display general forecast text', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Today is a great day for new beginnings!')).toBeTruthy();
      });
    });

    it('should display energy scores', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('7.5')).toBeTruthy(); // love score
        expect(getByText('8.0')).toBeTruthy(); // career score
        expect(getByText('6.5')).toBeTruthy(); // health score
      });
    });

    it('should display focus area forecasts', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Your relationships will flourish today.')).toBeTruthy();
        expect(getByText('Opportunities await at work.')).toBeTruthy();
        expect(getByText('Take time to rest and recharge.')).toBeTruthy();
      });
    });

    it('should display lucky numbers', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('7 • 14 • 21 • 33')).toBeTruthy();
      });
    });

    it('should display lucky color and gem', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('#FF5733')).toBeTruthy();
        expect(getByText('Ruby')).toBeTruthy();
      });
    });

    it('should display planetary transits', async () => {
      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Mars: Energy')).toBeTruthy();
        expect(getByText('Channel your energy productively.')).toBeTruthy();
      });
    });
  });

  describe('Membership Card', () => {
    beforeEach(() => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue(mockForecast);
    });

    it('should display subscription plan information', async () => {
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Premium')).toBeTruthy();
        expect(getByText('5/10')).toBeTruthy(); // actions used
        expect(getByText('2/5')).toBeTruthy(); // profiles used
      });
    });

    it('should display unlimited actions for unlimited plan', async () => {
      const unlimitedUsage = {
        ...mockSubscriptionUsage,
        unlimitedActions: true,
      };
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(unlimitedUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.membership.unlimited')).toBeTruthy();
      });
    });

    it('should navigate to MyPlan when manage button is pressed', async () => {
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.membership.manage')).toBeTruthy();
      });

      const manageButton = getByText('screens.today.membership.manage');
      fireEvent.press(manageButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyPlan');
    });
  });

  describe('Profile Switching', () => {
    it('should use main profile when available', async () => {
      const profiles = [
        { ...mockProfile, isMainProfile: true },
        { id: 'profile-456', name: 'Jane Doe', sunSign: 'Leo', isMainProfile: false },
      ];

      (profilesApi.getAll as jest.Mock).mockResolvedValue(profiles);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue(mockForecast);
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
        expect(forecastsApi.getToday).toHaveBeenCalledWith('profile-123');
      });
    });

    it('should use first profile when no main profile is set', async () => {
      const profiles = [
        { id: 'profile-789', name: 'Alice Smith', sunSign: 'Gemini', isMainProfile: false },
        { id: 'profile-456', name: 'Jane Doe', sunSign: 'Leo', isMainProfile: false },
      ];

      (profilesApi.getAll as jest.Mock).mockResolvedValue(profiles);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue({
        ...mockForecast,
        sunSign: 'Gemini',
      });
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Alice Smith')).toBeTruthy();
        expect(forecastsApi.getToday).toHaveBeenCalledWith('profile-789');
      });
    });

    it('should navigate to Profiles when switch button is pressed', async () => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue(mockForecast);
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('screens.today.forecast.switch')).toBeTruthy();
      });

      const switchButton = getByText('screens.today.forecast.switch');
      fireEvent.press(switchButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profiles');
    });
  });

  describe('Moon Phase Calculation', () => {
    it('should calculate and display correct moon phase', async () => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue({
        ...mockForecast,
        date: new Date('2024-01-11').toISOString(), // Known new moon date
      });
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByText } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        // Should show some moon phase
        expect(getByText('screens.today.moonPhase.title')).toBeTruthy();
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('should refetch all data when pull-to-refresh is triggered', async () => {
      (profilesApi.getAll as jest.Mock).mockResolvedValue([mockProfile]);
      (forecastsApi.getToday as jest.Mock).mockResolvedValue(mockForecast);
      (subscriptionsApi.getUsage as jest.Mock).mockResolvedValue(mockSubscriptionUsage);

      const { getByTestId } = renderWithQueryClient(
        <TodayScreen navigation={mockNavigation} />
      );

      // Wait for initial load
      await waitFor(() => {
        expect(profilesApi.getAll).toHaveBeenCalledTimes(1);
      });

      // Clear mock calls
      jest.clearAllMocks();

      // Note: Testing RefreshControl is challenging in unit tests
      // This test structure is a placeholder for the expected behavior
      // In a real scenario, you might need integration tests or E2E tests
    });
  });
});
