/**
 * SYSTÈME DE THÈME GLOBAL NEXTMANGA
 * Centralisation de tous les tokens de design pour maintenir la cohérence visuelle
 */

import { Platform } from 'react-native';

// ============================================================================
// COULEURS
// ============================================================================

export const colors = {
  // Couleurs principales
  primary: '#6366F1',        // Purple principal
  primaryLight: '#818CF8',   // Purple clair (dark mode)
  primaryDark: '#4F46E5',    // Purple foncé
  
  secondary: '#06B6D4',      // Cyan
  secondaryLight: '#22D3EE',
  secondaryDark: '#0891B2',
  
  // Couleurs de fond
  background: '#FFFFFF',
  backgroundDark: '#111827',
  backgroundAppI:'#A9A9A9',
  backgroundSecondary: '#F9FAFB',
  backgroundSecondaryDark: '#1F2937',
  
  // Couleurs de surface/cartes
  surface: '#FFFFFF',
  surfaceDark: '#1F2937',
  surfaceElevated: '#F3F4F6',
  surfaceElevatedDark: '#374151',
  
  // Couleurs de texte
  textPrimary: '#1F2937',
  textPrimaryDark: '#F9FAFB',
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  textTertiary: '#9CA3AF',
  textTertiaryDark: '#6B7280',
  textDisabled: '#D1D5DB',
  
  // Couleurs utilitaires
  white: '#FFFFFF',
  black: '#000000',
  
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
  
  // États sémantiques
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Bordures
  border: '#E5E7EB',
  borderDark: '#374151',
  borderFocus: '#6366F1',
  
  // Accents de couleur (badges, tags)
  accent: {
    purple: '#6366F1',
    blue: '#3B82F6',
    cyan: '#06B6D4',
    green: '#10B981',
    yellow: '#F59E0B',
    orange: '#F97316',
    red: '#EF4444',
    pink: '#EC4899',
  },
};

// Legacy support (pour compatibilité avec le code existant)
export const Colors = {
  light: {
    text: colors.textPrimary,
    background: colors.background,
    tint: colors.primary,
    icon: colors.gray500,
    tabIconDefault: colors.gray500,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.textPrimaryDark,
    background: colors.backgroundDark,
    tint: colors.primaryLight,
    icon: colors.gray400,
    tabIconDefault: colors.gray400,
    tabIconSelected: colors.primaryLight,
  },
};

// ============================================================================
// TYPOGRAPHIE
// ============================================================================

export const typography = {
  // Tailles de police
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    heading1: 32,
    heading2: 28,
    heading3: 24,
    heading4: 20,
    heading5: 18,
    heading6: 16,
  },
  
  // Hauteurs de ligne
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Poids de police
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  
  // Styles de texte prédéfinis
  styles: {
    h1: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 38,
      color: colors.textPrimary,
    },
    h2: {
      fontSize: 28,
      fontWeight: '800' as const,
      lineHeight: 34,
      color: colors.textPrimary,
    },
    h3: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 30,
      color: colors.textPrimary,
    },
    h4: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 26,
      color: colors.textPrimary,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
      color: colors.textPrimary,
    },
    bodyBold: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 22,
      color: colors.textPrimary,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      color: colors.textSecondary,
    },
    button: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
  },
};

// Fonts système
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ============================================================================
// ESPACEMENTS
// ============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

// ============================================================================
// RAYONS DE BORDURE
// ============================================================================

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  base: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
  pill: 9999,
};

// ============================================================================
// OMBRES
// ============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  // Ombres colorées (pour les éléments actifs)
  primaryGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successGlow: {
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

// ============================================================================
// DIMENSIONS
// ============================================================================

export const dimensions = {
  // Hauteurs de composants
  buttonHeight: {
    sm: 36,
    base: 48,
    lg: 56,
  },
  inputHeight: {
    sm: 36,
    base: 48,
    lg: 56,
  },
  headerHeight: 120,
  tabBarHeight: 80,
  
  // Largeurs
  maxContentWidth: 1200,
  sidebarWidth: 280,
  
  // Touch targets minimums
  minTouchTarget: 44,
};

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    verySlow: 500,
  },
  easing: {
    default: 'ease-out',
    spring: 'spring',
    linear: 'linear',
  },
};

// ============================================================================
// OPACITÉS
// ============================================================================

export const opacity = {
  disabled: 0.5,
  hover: 0.8,
  pressed: 0.6,
  overlay: 0.5,
};

// ============================================================================
// THÈME COMPLET (Export par défaut)
// ============================================================================

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  dimensions,
  animations,
  opacity,
  fonts: Fonts,
};

export default theme;
