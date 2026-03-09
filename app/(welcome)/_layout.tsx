import { Stack } from 'expo-router';

export default function WelcomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step1" options={{ headerShown: false }} />
      <Stack.Screen name="step2" options={{ headerShown: false }} />
      <Stack.Screen name="step3" options={{ headerShown: false }} />
    </Stack>
  );
}
