/**
 * PALETTES DE THÈME - CLAIR ET SOMBRE
 * Définit les couleurs pour chaque thème
 */

export const themePalettes = {
  light: {
    // Fond principal
    background: '#FFFFFF',
    surfacePrimary: '#FFFFFF',
    surfaceSecondary: '#F9FAFB',
    surfaceElevated: '#F3F4F6',

    // Texte
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textDisabled: '#D1D5DB',

    // Accents
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    secondary: '#06B6D4',
    secondaryLight: '#22D3EE',
    secondaryDark: '#0891B2',

    // Bordures
    border: '#E5E7EB',
    borderFocus: '#6366F1',

    // États
    success: '#10B981',
    successLight: '#34D399',
    error: '#EF4444',
    errorLight: '#F87171',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    info: '#3B82F6',
    infoLight: '#60A5FA',

    // Grays
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },

  dark: {
    // Fond principal
    background: '#111827',
    surfacePrimary: '#1F2937',
    surfaceSecondary: '#111827',
    surfaceElevated: '#374151',

    // Texte
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textDisabled: '#4B5563',

    // Accents
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    
    secondary: '#22D3EE',
    secondaryLight: '#67E8F9',
    secondaryDark: '#06B6D4',

    // Bordures
    border: '#374151',
    borderFocus: '#818CF8',

    // États
    success: '#10B981',
    successLight: '#34D399',
    error: '#EF4444',
    errorLight: '#F87171',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    info: '#60A5FA',
    infoLight: '#93C5FD',

    // Grays
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
  },
};

export type ThemePalette = typeof themePalettes.light;
