import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const AUTH_STORAGE_KEY = '@nextmanga_auth';
const USER_STORAGE_KEY = '@nextmanga_user';

export interface UserProfile {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  preferences?: {
    genres?: string[];
    moods?: string[];
    themes?: string[];
    targetAudience?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  userId: string | null;
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (userId: string, token: string, userData?: UserProfile) => Promise<void>;
  setUser: (user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données d'authentification sauvegardées au montage
  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const [authData, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
      ]);

      if (authData) {
        const { userId: savedUserId, token: savedToken } = JSON.parse(authData);
        setUserId(savedUserId);
        setToken(savedToken);
        console.log('🔐 Auth data loaded from storage');
      }

      if (userData) {
        const savedUser = JSON.parse(userData);
        setUserState(savedUser);
        console.log('👤 User data loaded from storage');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l\'authentification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuth = async (id: string, authToken: string, userData?: UserProfile) => {
    setUserId(id);
    setToken(authToken);
    if (userData) {
      setUserState(userData);
    }

    // Persister les données
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId: id, token: authToken })),
        userData && AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData)),
      ]);
      console.log('💾 Auth data saved to storage');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de l\'authentification:', error);
    }
  };

  const setUser = async (userData: UserProfile) => {
    setUserState(userData);

    // Persister les données
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('💾 User data saved to storage');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des données utilisateur:', error);
    }
  };

  const logout = async () => {
    setUserId(null);
    setToken(null);
    setUserState(null);

    // Effacer les données sauvegardées
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_STORAGE_KEY),
        AsyncStorage.removeItem(USER_STORAGE_KEY),
      ]);
      console.log('🗑️ Auth data cleared from storage');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'authentification:', error);
    }
  };

  const value = {
    userId,
    token,
    user,
    isLoading,
    isAuthenticated: !!userId && !!token,
    setAuth,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
