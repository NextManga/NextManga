import { ThemePalette, themePalettes } from '@/constants/themePalettes';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Hook pour accéder aux couleurs du thème actuel
 * Retourne automatiquement les bonnes couleurs selon le mode light/dark
 */
export const useThemeColors = (): ThemePalette => {
  const { theme } = useTheme();
  return themePalettes[theme];
};
