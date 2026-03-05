import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import { SignUpProvider } from '@/contexts/SignUpContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

export const unstable_settings = {
  anchor: '(welcome)',
};

function RootLayoutContent() {
  const { theme } = useTheme();
  const { isOnboardingCompleted, isLoading } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    if (isLoading) return;

    const inWelcome = segments[0] === '(welcome)';

    if (!isOnboardingCompleted && !inWelcome) {
      // User hasn't completed onboarding, redirect to welcome
      router.replace('/(welcome)/step1');
    } else if (isOnboardingCompleted && inWelcome) {
      // User completed onboarding but is still in welcome, redirect to auth
      router.replace('/(auth)/sign_in');
    }
  }, [isOnboardingCompleted, isLoading, segments]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="manga" options={{ headerShown: false }} />
        <Stack.Screen name="library" options={{ headerShown: false }} />
        <Stack.Screen name="category/[type]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <NotificationProvider>
      <OnboardingProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SignUpProvider>
                <RootLayoutContent />
              </SignUpProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </OnboardingProvider>
    </NotificationProvider>
  );
}
