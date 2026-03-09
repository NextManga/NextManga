import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type NotificationType = 'theme' | 'language';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  value: string;
  createdAt: number;
};

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (type: NotificationType, value: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_STORAGE_KEY = 'nextmanga_notifications';

const loadNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const saved = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved) as NotificationItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => !!item && typeof item.id === 'string');
  } catch (error) {
    console.warn('Erreur lors du chargement des notifications:', error);
    return [];
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const saved = await loadNotifications();
      if (isMounted) {
        setNotifications(saved);
        setIsReady(true);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = async (items: NotificationItem[]) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des notifications:', error);
    }
  };

  const addNotification = async (type: NotificationType, value: string) => {
    const nextItem: NotificationItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      value,
      createdAt: Date.now(),
    };

    setNotifications((prev) => {
      const nextItems = [nextItem, ...prev].slice(0, 50);
      void persist(nextItems);
      return nextItems;
    });
  };

  const clearNotifications = async () => {
    setNotifications([]);
    await persist([]);
  };

  if (!isReady) {
    return null;
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
