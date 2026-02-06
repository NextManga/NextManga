import React, { createContext, ReactNode, useContext, useState } from 'react';

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
  setAuth: (userId: string, token: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = (id: string, authToken: string) => {
    setUserId(id);
    setToken(authToken);
  };

  const setUser = (userData: UserProfile) => {
    setUserState(userData);
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    setUserState(null);
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
