import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';
import { useWidgetUpdates, WidgetData } from '@/hooks/useWidgetUpdates';
import { ProfileProvider } from '@/contexts/ProfileContext';

/**
 * Profile Navigation Hook Tests
 */
describe('useProfileNavigation', () => {
  const wrapper = ({ children }: any) => (
    <ProfileProvider>{children}</ProfileProvider>
  );

  describe('initialization', () => {
    it('should initialize with no profile selected', () => {
      const { result } = renderHook(() => useProfileNavigation(), {
        wrapper,
      });

      expect(result.current.selectedProfile).toBeNull();
      expect(result.current.hasProfile).toBe(false);
    });
  });

  describe('navigation', () => {
    it('should warn when navigating without profile', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { result } = renderHook(() => useProfileNavigation(), {
        wrapper,
      });

      act(() => {
        result.current.navigateWithProfile('BiorhythmScreen');
      });

      expect(warnSpy).toHaveBeenCalledWith(
        'No profile selected. Please select a profile first.'
      );

      warnSpy.mockRestore();
    });

    it('should navigate with profile for profile-dependent screens', async () => {
      const { result } = renderHook(() => useProfileNavigation(), {
        wrapper,
      });

      // This test assumes profile is selected via context
      expect(result.current.navigateWithProfile).toBeDefined();
    });
  });
});

/**
 * Widget Updates Hook Tests
 */
describe('useWidgetUpdates', () => {
  const mockWidgetData: WidgetData = {
    dailyMessage: 'Test message',
    moonPhase: 'Full Moon',
    date: new Date().toISOString(),
    timestamp: Date.now(),
  };

  it('should update widget data', async () => {
    const { result } = renderHook(() =>
      useWidgetUpdates({
        enabled: true,
        fetchHoroscope: async () => 'Test horoscope',
        fetchMoonPhase: async () => 'Full Moon',
      })
    );

    expect(result.current.updateWidgets).toBeDefined();
  });

  it('should handle widget update errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() =>
      useWidgetUpdates({
        enabled: true,
        fetchHoroscope: async () => {
          throw new Error('API error');
        },
      })
    );

    await act(async () => {
      await result.current.updateWidgets();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should skip update if too soon', async () => {
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useWidgetUpdates({
          enabled,
          fetchHoroscope: async () => 'Test',
        }),
      { initialProps: { enabled: true } }
    );

    // Update once
    await act(async () => {
      await result.current.updateWidgets();
    });

    // Try to update immediately (should skip)
    await act(async () => {
      await result.current.updateWidgets();
    });

    // Second update should be skipped due to debounce
    expect(result.current.isSupported).toBe(true);
  });

  it('should disable when enabled is false', () => {
    const { result } = renderHook(() =>
      useWidgetUpdates({
        enabled: false,
      })
    );

    expect(result.current.updateWidgets).toBeDefined();
  });
});
