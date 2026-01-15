import { Ionicons } from '@expo/vector-icons';
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
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAvatarPress} style={styles.avatar}>
        <Ionicons name="person-circle" size={40} color="#6366F1" />
      </TouchableOpacity>

      <View style={styles.greeting}>
        <Text style={styles.hello}>Bonjour, {userName} 👋</Text>
        <Text style={styles.subtitle}>Découvrez de nouveaux mangas</Text>
      </View>

      <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={24} color="#1F2937" />
        {notificationCount > 0 && (
          <View style={styles.badge}>
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
    backgroundColor: '#FFFFFF',
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
    borderWidth: 2,
    borderColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    flex: 1,
    marginLeft: 12,
  },
  hello: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
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
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
