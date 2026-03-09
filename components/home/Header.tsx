import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  userName?: string;
  notificationCount?: number;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
};

export const Header = ({ 
  userName = 'John', 
  notificationCount = 3,
  onAvatarPress,
  onNotificationPress 
}: Props) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const displayName = userName || t('ui.home.defaultUser');

  return (
    <View style={[styles.container, { backgroundColor: colors.surfacePrimary }]}>
      <TouchableOpacity onPress={onAvatarPress} style={styles.avatar}>
        <Ionicons name="person-circle" size={40} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.greeting}>
        <Text style={[styles.hello, { color: colors.textSecondary }]}>
          {t('ui.header.hello', { name: displayName })}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textPrimary }]}>
          {t('ui.header.subtitle')}
        </Text>
      </View>

      <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        {notificationCount > 0 && (
          <View style={[styles.badge, { borderColor: colors.surfacePrimary }]}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    flex: 1,
    marginLeft: 12,
  },
  hello: {
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
