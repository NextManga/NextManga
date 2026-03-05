import { useOnboarding } from '@/contexts/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeStep3() {
  const router = useRouter();
  const { t } = useTranslation();
  const { completeOnboarding } = useOnboarding();

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.replace('/(auth)/sign_in');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#7C3AED', '#EC4899']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Hero Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Ionicons name="checkmark-circle" size={120} color="#FFFFFF" />
          </View>
          <View style={styles.floatingIcon1}>
            <Ionicons name="trophy" size={32} color="#FBBF24" />
          </View>
          <View style={styles.floatingIcon2}>
            <Ionicons name="bookmark" size={28} color="#22D3EE" />
          </View>
          <View style={styles.floatingIcon3}>
            <Ionicons name="time" size={24} color="#10B981" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('ui.welcome.step3.title')}</Text>
          <Text style={styles.subtitle}>{t('ui.welcome.step3.subtitle')}</Text>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EC4899', '#7C3AED']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>{t('ui.welcome.getStarted')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7C3AED',
  },
  gradient: {
    flex: 1,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  illustrationCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  floatingIcon1: {
    position: 'absolute',
    top: '32%',
    right: '16%',
  },
  floatingIcon2: {
    position: 'absolute',
    top: '46%',
    left: '14%',
  },
  floatingIcon3: {
    position: 'absolute',
    top: '40%',
    left: '18%',
    transform: [{ translateY: 20 }],
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    minHeight: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#EC4899',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
