import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const ONBOARDING_STORAGE_KEY = '@nextmanga_onboarding_completed';

interface OnboardingContextType {
  isOnboardingCompleted: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  const loadOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      setIsOnboardingCompleted(value === 'true');
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      setIsOnboardingCompleted(false);
    } catch (error) {
      console.error('Failed to reset onboarding status:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingCompleted,
        isLoading,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
