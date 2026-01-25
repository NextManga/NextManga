import React, { createContext, ReactNode, useContext, useState } from 'react';

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

  const updateFormData = (data: Partial<SignUpData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const setFormError = (message: string | null) => {
    setError(message);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const resetForm = () => {
    setFormData(initialState);
    setError(null);
    setIsLoading(false);
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
