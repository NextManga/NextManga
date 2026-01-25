import { useState } from 'react';

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  genres: string[];
  selectedMangas: string[];
}

const initialState: SignUpData = {
  email: '',
  password: '',
  displayName: '',
  genres: [],
  selectedMangas: [],
};

export const useSignUpForm = () => {
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

  return {
    formData,
    error,
    isLoading,
    updateFormData,
    setFormError,
    setLoading,
    resetForm,
  };
};
