import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { TFunction } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { LanguageCode } from '@/i18n';
import { api } from '@/services/api';

const HEADER_HEIGHT = 280;

const formatMemberSince = (dateString: string | undefined, locale: string, t: TFunction) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);

  return t('profile.memberSince', { date: formattedDate });
};

type SettingItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'value' | 'toggle' | 'link';
  value?: string;
  onPress?: () => void;
};

const SettingRow = ({
  title,
  description,
  icon,
  type,
  value,
  onPress,
  toggleValue,
  onToggle,
  colors: settingColors,
}: SettingItem & {
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  colors: ReturnType<typeof useThemeColors>;
}) => {
  const content = (
    <View style={styles.settingRowContent}>
      <View style={[styles.settingIcon, { backgroundColor: settingColors.primary + '15' }]}>
        <Ionicons name={icon} size={20} color={settingColors.primary} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: settingColors.textPrimary }]}>{title}</Text>
        <Text style={[styles.settingDescription, { color: settingColors.textSecondary }]}>{description}</Text>
      </View>
      <View style={styles.settingAction}>
        {type === 'toggle' && (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: settingColors.gray200, true: settingColors.primary }}
            thumbColor="#FFFFFF"
          />
        )}
        {type === 'value' && (
          <View style={styles.settingValueWrapper}>
            <Text style={[styles.settingValue, { color: settingColors.primary }]}>{value}</Text>
            <Ionicons name="chevron-forward" size={18} color={settingColors.textTertiary} />
          </View>
        )}
        {type === 'link' && <Ionicons name="chevron-forward" size={18} color={settingColors.textTertiary} />}
      </View>
    </View>
  );

  if (type === 'toggle') {
    return <View style={[styles.settingRow, { borderBottomColor: settingColors.border }]}>{content}</View>;
  }

  return (
    <Pressable
      android_ripple={{ color: settingColors.primary + '15' }}
      onPress={onPress}
      style={[styles.settingRow, { borderBottomColor: settingColors.border }]}
    >
      {content}
    </Pressable>
  );
};

export default function ProfileScreen() {
  const { user, userId, token, logout, setUser } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { themeMode, setThemeMode } = useTheme();
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  // ⚠️ Préférences UI (theme/language/notifications) stockées localement - pas encore disponibles sur l'API backend
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(user ?? null);

  const displayName = profile?.displayName || user?.displayName || '';
  const email = profile?.email || user?.email || '';
  const memberSince = formatMemberSince(profile?.createdAt || user?.createdAt, i18n.language, t);
  // ✅ Genres chargés depuis l'API (preferences.genres)
  const genreTags = profile?.preferences?.genres ?? [];
  const initials = useMemo(() => {
    if (!displayName) {
      return '--';
    }

    const parts = displayName.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? 'J';
    const second = parts[1]?.[0] ?? 'D';
    return `${first}${second}`.toUpperCase();
  }, [displayName]);

  const headerHeight = HEADER_HEIGHT + insets.top;

  const languageOptions = useMemo(
    () => [
      { code: 'fr' as LanguageCode, label: t('languages.fr') },
      { code: 'en' as LanguageCode, label: t('languages.en') },
    ],
    [i18n.language]
  );

  const selectedLanguageLabel =
    languageOptions.find((option) => option.code === language)?.label ?? '—';

  const preferences: SettingItem[] = [
    {
      id: 'theme',
      title: t('profile.settings.theme'),
      description: t('profile.settings.themeDescription'),
      icon: 'moon',
      type: 'value',
      value:
        themeMode === 'auto'
          ? t('profile.themeModes.auto')
          : themeMode === 'light'
            ? t('profile.themeModes.light')
            : t('profile.themeModes.dark'),
      onPress: () => setIsThemeModalVisible(true),
    },
    {
      id: 'language',
      title: t('profile.settings.language'),
      description: t('profile.settings.languageDescription'),
      icon: 'globe-outline',
      type: 'value',
      value: selectedLanguageLabel,
      onPress: () => setIsLanguageModalVisible(true),
    },
    {
      id: 'notifications',
      title: t('profile.settings.notifications'),
      description: t('profile.settings.notificationsDescription'),
      icon: 'notifications-outline',
      type: 'toggle',
    },
    {
      id: 'privacy',
      title: t('profile.settings.privacy'),
      description: t('profile.settings.privacyDescription'),
      icon: 'lock-closed-outline',
      type: 'link',
      onPress: () => Alert.alert(t('profile.alerts.privacyTitle'), t('profile.alerts.privacyMessage')),
    },
  ];

  const supportItems: SettingItem[] = [
    {
      id: 'about',
      title: t('profile.support.aboutTitle'),
      description: t('profile.support.aboutDescription'),
      icon: 'information-circle-outline',
      type: 'link',
      onPress: () => Alert.alert(t('profile.alerts.aboutTitle'), t('profile.alerts.aboutMessage')),
    },
    {
      id: 'contact',
      title: t('profile.support.contactTitle'),
      description: t('profile.support.contactDescription'),
      icon: 'mail-outline',
      type: 'link',
      onPress: () => Alert.alert(t('profile.alerts.contactTitle'), t('profile.alerts.contactMessage')),
    },
    {
      id: 'terms',
      title: t('profile.support.termsTitle'),
      description: t('profile.support.termsDescription'),
      icon: 'document-text-outline',
      type: 'link',
      onPress: () => Alert.alert(t('profile.alerts.termsTitle'), t('profile.alerts.termsMessage')),
    },
    {
      id: 'privacyPolicy',
      title: t('profile.support.privacyTitle'),
      description: t('profile.support.privacyDescription'),
      icon: 'shield-checkmark-outline',
      type: 'link',
      onPress: () => Alert.alert(t('profile.alerts.policyTitle'), t('profile.alerts.policyMessage')),
    },
    {
      id: 'rate',
      title: t('profile.support.rateTitle'),
      description: t('profile.support.rateDescription'),
      icon: 'star-outline',
      type: 'link',
      onPress: () => Alert.alert(t('profile.alerts.rateTitle'), t('profile.alerts.rateMessage')),
    },
  ];

  const loadProfile = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      const data = await api.getUser(userId, token);
      
      // Charger l'avatar local s'il existe
      const localAvatarUri = await AsyncStorage.getItem(`avatar_${userId}`);
      if (localAvatarUri) {
        data.avatarUrl = localAvatarUri;
      }
      
      setProfile(data);
      setUser(data);
    } catch (error) {
      console.warn('Impossible de charger le profil:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId, token]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfile().finally(() => setRefreshing(false));
  };

  const handleLogout = () => {
    Alert.alert(t('profile.alerts.logoutTitle'), t('profile.alerts.logoutMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.actions.logout'),
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/sign_in');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.alerts.deleteAccountTitle'),
      t('profile.alerts.deleteAccountMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive' },
      ]
    );
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await Haptics.selectionAsync();
  };

  const handleTakePhoto = async () => {
    try {
      // Demander la permission d'accès à la caméra
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('profile.alerts.cameraPermissionTitle'),
          t('profile.alerts.cameraPermissionMessage')
        );
        return;
      }

      // Ouvrir la caméra
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert(t('profile.alerts.takePhotoErrorTitle'), t('profile.alerts.takePhotoErrorMessage'));
    } finally {
      setIsPhotoModalVisible(false);
    }
  };

  const handlePickImage = async () => {
    try {
      // Demander la permission d'accès à la galerie
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('profile.alerts.galleryPermissionTitle'),
          t('profile.alerts.galleryPermissionMessage')
        );
        return;
      }

      // Ouvrir la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        legacy: true, // Force l'ancien sélecteur pour compatibilité Android
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert(t('profile.alerts.pickPhotoErrorTitle'), t('profile.alerts.pickPhotoErrorMessage'));
    } finally {
      setIsPhotoModalVisible(false);
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      // Recadrer et redimensionner l'image
      const manipResult = await manipulateAsync(
        imageUri,
        [
          { resize: { width: 400, height: 400 } }, // Redimensionner à 400x400
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      // Sauvegarder l'avatar dans AsyncStorage pour persistence
      if (userId) {
        await AsyncStorage.setItem(`avatar_${userId}`, manipResult.uri);
      }

      // Mise à jour locale
      if (profile) {
        const updatedProfile = { ...profile, avatarUrl: manipResult.uri };
        setProfile(updatedProfile);
        setUser(updatedProfile);
      }
      
      Alert.alert(t('profile.alerts.updatePhotoSuccessTitle'), t('profile.alerts.updatePhotoSuccessMessage'));
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      Alert.alert(t('profile.alerts.pickPhotoErrorTitle'), t('profile.alerts.pickPhotoErrorMessage'));
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      t('profile.alerts.removePhotoTitle'),
      t('profile.alerts.removePhotoMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Supprimer l'avatar de AsyncStorage
              if (userId) {
                await AsyncStorage.removeItem(`avatar_${userId}`);
              }
              
              // Suppression locale
              if (profile) {
                const updatedProfile = { ...profile, avatarUrl: undefined };
                setProfile(updatedProfile);
                setUser(updatedProfile);
              }
              
              setIsPhotoModalVisible(false);
              Alert.alert(t('profile.alerts.removePhotoSuccessTitle'), t('profile.alerts.removePhotoSuccessMessage'));
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert(t('profile.alerts.removePhotoErrorTitle'), t('profile.alerts.removePhotoErrorMessage'));
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { height: headerHeight, paddingTop: insets.top }]}
        >
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
            onPress={() => Alert.alert(t('profile.alerts.settingsTitle'), t('profile.alerts.settingsMessage'))}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setIsPhotoModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.avatarCircle, { borderColor: '#FFFFFF' }]}>
                {profile?.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitials}>{initials}</Text>
                )}
              </View>
              <View style={[styles.avatarCamera, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            {!!displayName && <Text style={styles.name}>{displayName}</Text>}
            {!!email && <Text style={styles.email}>{email}</Text>}
            {!!memberSince && <Text style={styles.memberSince}>{memberSince}</Text>}
          </View>
        </LinearGradient>

        {hasError && (
          <View style={[styles.errorBanner, { backgroundColor: colors.error + '15' }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{t('profile.errors.loadProfile')}</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.error + '25' }]} 
              onPress={handleRefresh}
            >
              <Text style={[styles.retryText, { color: colors.error }]}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={[styles.skeletonBlock, styles.skeletonAvatar, { backgroundColor: colors.gray200 }]} />
            <View style={[styles.skeletonBlock, styles.skeletonLine, { backgroundColor: colors.gray200 }]} />
            <View style={[styles.skeletonBlock, styles.skeletonLineSmall, { backgroundColor: colors.gray200 }]} />
            <View style={[styles.skeletonBlock, styles.skeletonRow, { backgroundColor: colors.gray200 }]} />
            <View style={[styles.skeletonBlock, styles.skeletonRow, { backgroundColor: colors.gray200 }]} />
          </View>
        ) : (
          <View style={styles.contentWrapper}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('profile.sections.preferences')}</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surfacePrimary, shadowColor: colors.textPrimary }]}>
              {preferences.map((item) => (
                <SettingRow
                  key={item.id}
                  {...item}
                  colors={colors}
                  toggleValue={item.id === 'notifications' ? notificationsEnabled : undefined}
                  onToggle={item.id === 'notifications' ? handleNotificationToggle : undefined}
                />
              ))}
            </View>

            <Text style={[styles.sectionTitle, styles.sectionSpacing, { color: colors.textPrimary }]}>
              {t('profile.sections.favoriteGenres')}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{t('profile.genres.subtitle')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreList}
            >
              {genreTags.length > 0 ? (
                genreTags.map((tag) => (
                  <TouchableOpacity key={tag} activeOpacity={0.8}>
                    <LinearGradient
                      colors={[colors.primary, colors.primaryLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.genreTag}
                    >
                      <Text style={styles.genreText}>{tag}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.genreEmptyWrapper}>
                  <Text style={[styles.genreEmptyText, { color: colors.textTertiary }]}>{t('profile.genres.empty')}</Text>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.editPreferences}
              onPress={() => router.push('/(onboarding)/genres')}
            >
              <Text style={[styles.editPreferencesText, { color: colors.primary }]}>✏️ {t('profile.genres.edit')}</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, styles.sectionSpacing, { color: colors.textPrimary }]}>
              {t('profile.sections.supportInfo')}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surfacePrimary, shadowColor: colors.textPrimary }]}>
              {supportItems.map((item) => (
                <SettingRow key={item.id} {...item} colors={colors} />
              ))}
            </View>

            <View style={styles.bottomSection}>
              <Text style={[styles.versionText, { color: colors.textTertiary }]}>
                {t('common.version')} 1.0.0
              </Text>
              <TouchableOpacity 
                style={[styles.logoutButton, { borderColor: colors.error, backgroundColor: colors.surfacePrimary }]}
                onPress={handleLogout}
              >
                <Text style={[styles.logoutText, { color: colors.error }]}>🚪 {t('profile.actions.logout')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount}>
                <Text style={[styles.deleteAccountText, { color: colors.textTertiary }]}>{t('profile.actions.deleteAccount')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={isPhotoModalVisible}
        onRequestClose={() => setIsPhotoModalVisible(false)}
      >
        <Pressable style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} onPress={() => setIsPhotoModalVisible(false)}>
          <Pressable style={[styles.bottomSheet, { backgroundColor: colors.surfacePrimary }]} onPress={() => null}>
            <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>{t('profile.photo.title')}</Text>
            <TouchableOpacity style={styles.sheetItem} onPress={handleTakePhoto}>
              <Text style={[styles.sheetItemText, { color: colors.textPrimary }]}>📷 {t('profile.photo.take')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={handlePickImage}>
              <Text style={[styles.sheetItemText, { color: colors.textPrimary }]}>🖼️ {t('profile.photo.choose')}</Text>
            </TouchableOpacity>
            {profile?.avatarUrl && (
              <TouchableOpacity style={styles.sheetItem} onPress={handleRemovePhoto}>
                <Text style={[styles.sheetItemText, { color: colors.error }]}>🗑️ {t('profile.photo.remove')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.sheetItem} onPress={() => setIsPhotoModalVisible(false)}>
              <Text style={[styles.sheetItemText, { color: colors.textSecondary }]}>❌ {t('profile.photo.cancel')}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isThemeModalVisible}
        onRequestClose={() => setIsThemeModalVisible(false)}
      >
        <View style={[styles.centeredModalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.centeredModal, { backgroundColor: colors.surfacePrimary }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('profile.modals.appearanceTitle')}</Text>
            <TouchableOpacity
              style={styles.themeOption}
              onPress={async () => await setThemeMode('light')}
            >
              <Ionicons
                name={themeMode === 'light' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>{t('profile.themeModes.light')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.themeOption}
              onPress={async () => await setThemeMode('dark')}
            >
              <Ionicons
                name={themeMode === 'dark' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>{t('profile.themeModes.dark')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.themeOption}
              onPress={async () => await setThemeMode('auto')}
            >
              <Ionicons
                name={themeMode === 'auto' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>{t('profile.themeModes.auto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsThemeModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>{t('common.apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isLanguageModalVisible}
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={[styles.centeredModalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.centeredModal, { backgroundColor: colors.surfacePrimary }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('profile.modals.languageTitle')}</Text>
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={styles.radioRow}
                onPress={() => setLanguage(option.code)}
              >
                <Ionicons
                  name={language === option.code ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsLanguageModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>{t('common.apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    width: '100%',
    justifyContent: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    backgroundColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarCamera: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
  },
  memberSince: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 24,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  retryText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  contentWrapper: {
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginHorizontal: 24,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  sectionSpacing: {
    marginTop: 40,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  settingRow: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  settingRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  settingValue: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  genreList: {
    paddingLeft: 24,
    paddingRight: 10,
    gap: 10,
  },
  genreEmptyWrapper: {
    paddingLeft: 24,
    paddingVertical: 6,
  },
  genreEmptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  genreTag: {
    height: 42,
    paddingHorizontal: 24,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  editPreferences: {
    marginTop: 16,
    alignItems: 'center',
  },
  editPreferencesText: {
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '600',
  },
  bottomSection: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  logoutButton: {
    marginTop: 24,
    height: 56,
    width: '100%',
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '700',
  },
  deleteAccountText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sheetItem: {
    height: 60,
    justifyContent: 'center',
  },
  sheetItemText: {
    fontSize: 16,
  },
  centeredModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centeredModal: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    columnGap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    columnGap: 12,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    padding: 24,
  },
  skeletonBlock: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonAvatar: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  skeletonLine: {
    height: 18,
    width: '60%',
    alignSelf: 'center',
  },
  skeletonLineSmall: {
    height: 14,
    width: '45%',
    alignSelf: 'center',
  },
  skeletonRow: {
    height: 64,
  },
});
