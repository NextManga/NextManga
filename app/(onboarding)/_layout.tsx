import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="genres" options={{headerShown: false}} />
      <Stack.Screen name="mangas" options={{headerShown: false}} />
    </Stack>
  );
}