import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeStep1() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleNext = () => {
    router.push('/(welcome)/step2');
  };

  const handleSkip = () => {
    router.replace('/(auth)/sign_in');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Hero Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Ionicons name="book" size={120} color="#FFFFFF" />
          </View>
          <View style={styles.floatingIcon1}>
            <Ionicons name="sparkles" size={32} color="#EC4899" />
          </View>
          <View style={styles.floatingIcon2}>
            <Ionicons name="star" size={28} color="#22D3EE" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('ui.welcome.step1.title')}</Text>
          <Text style={styles.subtitle}>{t('ui.welcome.step1.subtitle')}</Text>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Next Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>{t('ui.welcome.next')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Skip Link */}
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>{t('ui.welcome.skip')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366F1',
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
    top: '35%',
    right: '20%',
  },
  floatingIcon2: {
    position: 'absolute',
    top: '45%',
    left: '15%',
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
    backgroundColor: '#6366F1',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366F1',
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
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
