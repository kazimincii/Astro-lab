/**
 * useScreenProfile Hook
 * 
 * Screens için profil bilgisi sağlar
 * route.params.profileId veya context'ten alır
 */

import { useRoute } from '@react-navigation/native';
import { useProfile } from '@/contexts/ProfileContext';

export const useScreenProfile = () => {
  const route = useRoute<any>();
  const { selectedProfile } = useProfile();

  // route.params'dan profileId al, yoksa context'ten selectedProfile.id al
  const profileId = route.params?.profileId || selectedProfile?.id;
  const profile = selectedProfile;

  return {
    profileId,
    profile,
    hasProfile: !!profileId || !!profile,
  };
};
