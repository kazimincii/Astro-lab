import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../contexts/ProfileContext';
import { screenRequiresProfile } from '../navigation/screenParams';

/**
 * useProfileNavigation Hook
 *
 * Automatically adds profileId parameter to profile-dependent screens
 * Usage: const { navigateWithProfile } = useProfileNavigation();
 *        navigateWithProfile('BiorhythmScreen');
 */
export const useProfileNavigation = () => {
  const navigation = useNavigation<any>();
  const { selectedProfile } = useProfile();

  const navigateWithProfile = (
    screenName: string,
    params?: Record<string, any>
  ) => {
    if (!selectedProfile) {
      console.warn('No profile selected. Please select a profile first.');
      // Navigate to profiles screen to select one
      navigation.navigate('Profiles');
      return;
    }

    // If screen requires profile, add profileId
    if (screenRequiresProfile(screenName)) {
      navigation.navigate(screenName, {
        ...params,
        profileId: selectedProfile.id,
      });
    } else {
      // Global screen, no profileId needed
      navigation.navigate(screenName, params);
    }
  };

  return {
    navigateWithProfile,
    selectedProfile,
    hasProfile: !!selectedProfile,
  };
};
