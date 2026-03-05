import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const SIGNUP_STORAGE_KEY = '@nextmanga_signup_form';

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  genres: string[];
  selectedMangas: string[];
}

interface SignUpContextType {
  formData: SignUpData;
  error: string | null;
  isLoading: boolean;
  updateFormData: (data: Partial<SignUpData>) => void;
  setFormError: (message: string | null) => void;
  setLoading: (loading: boolean) => void;
  resetForm: () => void;
}

const initialState: SignUpData = {
  email: '',
  password: '',
  displayName: '',
  genres: [],
  selectedMangas: [],
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<SignUpData>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les données sauvegardées au montage
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(SIGNUP_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        console.log('📋 SignUp data loaded from storage:', parsedData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'inscription:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  const updateFormData = async (data: Partial<SignUpData>) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    
    // Sauvegarder les données
    try {
      await AsyncStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(newFormData));
      console.log('💾 SignUp data saved:', newFormData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };

  const setFormError = (message: string | null) => {
    setError(message);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const resetForm = async () => {
    setFormData(initialState);
    setError(null);
    setIsLoading(false);
    
    // Effacer les données sauvegardées
    try {
      await AsyncStorage.removeItem(SIGNUP_STORAGE_KEY);
      console.log('🗑️ SignUp data cleared from storage');
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  };

  return (
    <SignUpContext.Provider
      value={{
        formData,
        error,
        isLoading,
        updateFormData,
        setFormError,
        setLoading,
        resetForm,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUpForm = () => {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUpForm must be used within a SignUpProvider');
  }
  return context;
};

