import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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

import { UserProfile, useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

const HEADER_HEIGHT = 280;

const THEME_OPTIONS = ['Clair', 'Sombre', 'Automatique'];
const LANGUAGE_OPTIONS = ['Français', 'English', 'Español', '日本語'];

const formatMemberSince = (dateString?: string) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const months = [
    'Janvier',
    'Fevrier',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Aout',
    'Septembre',
    'Octobre',
    'Novembre',
    'Decembre',
  ];

  return `Membre depuis ${months[date.getMonth()]} ${date.getFullYear()}`;
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
}: SettingItem & {
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}) => {
  const content = (
    <View style={styles.settingRowContent}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color="#6366F1" />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingAction}>
        {type === 'toggle' && (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
            thumbColor="#FFFFFF"
          />
        )}
        {type === 'value' && (
          <View style={styles.settingValueWrapper}>
            <Text style={styles.settingValue}>{value}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        )}
        {type === 'link' && <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
      </View>
    </View>
  );

  if (type === 'toggle') {
    return <View style={styles.settingRow}>{content}</View>;
  }

  return (
    <Pressable
      android_ripple={{ color: 'rgba(99, 102, 241, 0.08)' }}
      onPress={onPress}
      style={styles.settingRow}
    >
      {content}
    </Pressable>
  );
};

export default function ProfileScreen() {
  const { user, userId, token, logout, setUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // ⚠️ Préférences UI (theme/language/notifications) stockées localement - pas encore disponibles sur l'API backend
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(user ?? null);

  const displayName = profile?.displayName || user?.displayName || '';
  const email = profile?.email || user?.email || '';
  const memberSince = formatMemberSince(profile?.createdAt || user?.createdAt);
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

  const preferences: SettingItem[] = [
    {
      id: 'theme',
      title: 'Thème',
      description: "Apparence de l'application",
      icon: 'moon',
      type: 'value',
      value: selectedTheme || '—',
      onPress: () => setIsThemeModalVisible(true),
    },
    {
      id: 'language',
      title: 'Langue',
      description: 'Language / 言語',
      icon: 'globe-outline',
      type: 'value',
      value: selectedLanguage || '—',
      onPress: () => setIsLanguageModalVisible(true),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alertes et rappels',
      icon: 'notifications-outline',
      type: 'toggle',
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      description: 'Sécurité et données',
      icon: 'lock-closed-outline',
      type: 'link',
      onPress: () => Alert.alert('Confidentialité', 'Bientôt disponible.'),
    },
  ];

  const supportItems: SettingItem[] = [
    {
      id: 'about',
      title: 'À propos de NextManga',
      description: 'Version et informations',
      icon: 'information-circle-outline',
      type: 'link',
      onPress: () => Alert.alert('À propos', 'Version 1.0.0'),
    },
    {
      id: 'contact',
      title: 'Contactez-nous',
      description: 'Support et assistance',
      icon: 'mail-outline',
      type: 'link',
      onPress: () => Alert.alert('Contact', 'support@nextmanga.app'),
    },
    {
      id: 'terms',
      title: "Conditions d'utilisation",
      description: 'CGU et mentions légales',
      icon: 'document-text-outline',
      type: 'link',
      onPress: () => Alert.alert('CGU', 'Bientôt disponible.'),
    },
    {
      id: 'privacyPolicy',
      title: 'Politique de confidentialité',
      description: 'Protection de vos données',
      icon: 'shield-checkmark-outline',
      type: 'link',
      onPress: () => Alert.alert('Politique', 'Bientôt disponible.'),
    },
    {
      id: 'rate',
      title: "Évaluer l'application",
      description: 'Donnez votre avis',
      icon: 'star-outline',
      type: 'link',
      onPress: () => Alert.alert('Merci', 'On compte sur vous !'),
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
    Alert.alert('Se déconnecter ?', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
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
      '⚠️ Supprimer le compte ?\n',
      'Cette action est IRRÉVERSIBLE. Toutes vos données seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive' },
      ]
    );
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await Haptics.selectionAsync();
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <LinearGradient
          colors={['#6366F1', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { height: headerHeight, paddingTop: insets.top }]}
        >
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Alert.alert('Réglages', 'Page des réglages à venir.')}
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
              <View style={styles.avatarCircle}>
                {profile?.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitials}>{initials}</Text>
                )}
              </View>
              <View style={styles.avatarCamera}
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
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Impossible de charger le profil</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={[styles.skeletonBlock, styles.skeletonAvatar]} />
            <View style={[styles.skeletonBlock, styles.skeletonLine]} />
            <View style={[styles.skeletonBlock, styles.skeletonLineSmall]} />
            <View style={[styles.skeletonBlock, styles.skeletonRow]} />
            <View style={[styles.skeletonBlock, styles.skeletonRow]} />
          </View>
        ) : (
          <View style={styles.contentWrapper}>
            <Text style={styles.sectionTitle}>Préférences</Text>
            <View style={styles.sectionCard}>
              {preferences.map((item) => (
                <SettingRow
                  key={item.id}
                  {...item}
                  toggleValue={item.id === 'notifications' ? notificationsEnabled : undefined}
                  onToggle={item.id === 'notifications' ? handleNotificationToggle : undefined}
                />
              ))}
            </View>

            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Mes genres préférés</Text>
            <Text style={styles.sectionSubtitle}>Utilisés pour vos recommandations</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreList}
            >
              {genreTags.length > 0 ? (
                genreTags.map((tag) => (
                  <TouchableOpacity key={tag} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#6366F1', '#818CF8']}
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
                  <Text style={styles.genreEmptyText}>Aucun genre selectionne</Text>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.editPreferences}
              onPress={() => router.push('/(onboarding)/genres')}
            >
              <Text style={styles.editPreferencesText}>✏️ Modifier mes préférences</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Support & Informations</Text>
            <View style={styles.sectionCard}>
              {supportItems.map((item) => (
                <SettingRow key={item.id} {...item} />
              ))}
            </View>

            <View style={styles.bottomSection}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount}>
                <Text style={styles.deleteAccountText}>Supprimer mon compte</Text>
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
        <Pressable style={styles.modalOverlay} onPress={() => setIsPhotoModalVisible(false)}>
          <Pressable style={styles.bottomSheet} onPress={() => null}>
            <Text style={styles.sheetTitle}>Photo de profil</Text>
            <TouchableOpacity style={styles.sheetItem}>
              <Text style={styles.sheetItemText}>📷 Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem}>
              <Text style={styles.sheetItemText}>🖼️ Choisir depuis galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem}>
              <Text style={styles.sheetItemText}>🗑️ Supprimer la photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={() => setIsPhotoModalVisible(false)}>
              <Text style={styles.sheetItemText}>❌ Annuler</Text>
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
        <View style={styles.centeredModalOverlay}>
          <View style={styles.centeredModal}>
            <Text style={styles.modalTitle}>Apparence</Text>
            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioRow}
                onPress={() => setSelectedTheme(option)}
              >
                <Ionicons
                  name={selectedTheme === option ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color="#6366F1"
                />
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsThemeModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Appliquer</Text>
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
        <View style={styles.centeredModalOverlay}>
          <View style={styles.centeredModal}>
            <Text style={styles.modalTitle}>Choisir une langue</Text>
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioRow}
                onPress={() => setSelectedLanguage(option)}
              >
                <Ionicons
                  name={selectedLanguage === option ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color="#6366F1"
                />
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsLanguageModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Appliquer</Text>
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#EEF2FF',
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
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutText: {
    color: '#EF4444',
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  sheetItem: {
    height: 60,
    justifyContent: 'center',
  },
  sheetItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  centeredModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centeredModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    columnGap: 12,
  },
  radioLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: '#6366F1',
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
