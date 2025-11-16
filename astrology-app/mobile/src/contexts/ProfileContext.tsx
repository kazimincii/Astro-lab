import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { profilesApi } from '@/api/profiles';

export interface Profile {
  id: string;
  name: string;
  sunSign?: string | null;
  moonSign?: string | null;
  risingSign?: string | null;
  relationship?: string | null;
  isMainProfile?: boolean;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
}

interface ProfileContextType {
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile | null) => void;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the main profile on mount
  useEffect(() => {
    loadMainProfile();
  }, []);

  const loadMainProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profiles = await profilesApi.getAll();

      // Find the main profile or use the first one
      const mainProfile = profiles.find((p: Profile) => p.isMainProfile) || profiles[0];

      if (mainProfile) {
        setSelectedProfile(mainProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load profiles'));
      console.error('Error loading main profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!selectedProfile) {
      await loadMainProfile();
      return;
    }

    try {
      const updated = await profilesApi.getOne(selectedProfile.id);
      setSelectedProfile(updated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh profile'));
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        selectedProfile,
        setSelectedProfile,
        isLoading,
        error,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
