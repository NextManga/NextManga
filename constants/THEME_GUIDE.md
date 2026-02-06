# 🎨 Guide du Système de Thème NextManga

## Vue d'ensemble

Le système de thème centralisé de NextManga garantit la cohérence visuelle dans toute l'application. Tous les tokens de design (couleurs, typographie, espacements, etc.) sont définis dans `constants/theme.ts`.

---

## 📦 Import

```typescript
// Import complet
import theme from '@/constants/theme';

// Imports spécifiques
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
```

---

## 🎨 Couleurs

### Couleurs Principales

```typescript
colors.primary         // #6366F1 - Purple principal
colors.primaryLight    // #818CF8 - Pour dark mode
colors.primaryDark     // #4F46E5 - Variante foncée

colors.secondary       // #06B6D4 - Cyan
colors.secondaryLight  // #22D3EE
colors.secondaryDark   // #0891B2
```

### Couleurs de Fond

```typescript
colors.background               // #FFFFFF
colors.backgroundDark           // #111827
colors.backgroundSecondary      // #F9FAFB
colors.backgroundSecondaryDark  // #1F2937
```

### Couleurs de Texte

```typescript
colors.textPrimary       // #1F2937 - Texte principal
colors.textSecondary     // #6B7280 - Texte secondaire
colors.textTertiary      // #9CA3AF - Texte tertiaire
colors.textDisabled      // #D1D5DB - Texte désactivé
```

### États Sémantiques

```typescript
colors.success    // #10B981
colors.warning    // #F59E0B
colors.error      // #EF4444
colors.info       // #3B82F6
```

### Exemple d'utilisation

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  title: {
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
  },
  errorMessage: {
    color: colors.error,
  },
});
```

---

## ✍️ Typographie

### Tailles de Police

```typescript
typography.fontSize.xs       // 11
typography.fontSize.sm       // 12
typography.fontSize.base     // 14
typography.fontSize.md       // 15
typography.fontSize.lg       // 16
typography.fontSize.xl       // 18
typography.fontSize.heading1 // 32
typography.fontSize.heading2 // 28
```

### Styles Prédéfinis

```typescript
typography.styles.h1        // Heading 1 (32px, bold)
typography.styles.h2        // Heading 2 (28px, bold)
typography.styles.body      // Body text (15px)
typography.styles.caption   // Caption (12px)
typography.styles.button    // Button text (15px, semibold)
```

### Poids de Police

```typescript
typography.fontWeight.regular   // '400'
typography.fontWeight.medium    // '500'
typography.fontWeight.semiBold  // '600'
typography.fontWeight.bold      // '700'
```

### Exemple d'utilisation

```typescript
const styles = StyleSheet.create({
  title: {
    ...typography.styles.h1,
    // Ou manuellement :
    fontSize: typography.fontSize.heading1,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
});
```

---

## 📏 Espacements

```typescript
spacing.xs     // 4
spacing.sm     // 8
spacing.md     // 12
spacing.base   // 16 (recommandé par défaut)
spacing.lg     // 20
spacing.xl     // 24
spacing.xxl    // 32
spacing.xxxl   // 40
spacing.huge   // 48
spacing.massive // 64
```

### Exemple d'utilisation

```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.base,        // 16
    marginBottom: spacing.xl,     // 24
  },
  card: {
    padding: spacing.lg,          // 20
    gap: spacing.md,              // 12
  },
});
```

---

## 🔲 Rayons de Bordure

```typescript
borderRadius.none   // 0
borderRadius.xs     // 4
borderRadius.sm     // 6
borderRadius.md     // 8
borderRadius.base   // 12 (recommandé)
borderRadius.lg     // 16
borderRadius.xl     // 20
borderRadius.full   // 9999 (cercle)
```

### Exemple d'utilisation

```typescript
const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.base,  // 12
  },
  avatar: {
    borderRadius: borderRadius.full,  // cercle complet
  },
  card: {
    borderRadius: borderRadius.lg,    // 16
  },
});
```

---

## 🌑 Ombres

```typescript
shadows.none      // Pas d'ombre
shadows.sm        // Ombre légère
shadows.base      // Ombre standard
shadows.md        // Ombre moyenne
shadows.lg        // Ombre large
shadows.xl        // Ombre extra large

// Ombres colorées
shadows.primaryGlow   // Ombre purple
shadows.successGlow   // Ombre verte
```

### Exemple d'utilisation

```typescript
const styles = StyleSheet.create({
  card: {
    ...shadows.base,
    // Contient automatiquement :
    // shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation
  },
  button: {
    ...shadows.primaryGlow,
  },
});
```

---

## 📐 Dimensions

```typescript
// Hauteurs de composants
dimensions.buttonHeight.base    // 48
dimensions.inputHeight.base     // 48
dimensions.headerHeight         // 120
dimensions.tabBarHeight         // 80

// Touch targets
dimensions.minTouchTarget       // 44 (minimum recommandé)
```

---

## ⚡ Animations

```typescript
animations.duration.fast     // 150ms
animations.duration.normal   // 200ms
animations.duration.slow     // 300ms

animations.easing.default    // 'ease-out'
animations.easing.spring     // 'spring'
```

---

## 🎭 Opacités

```typescript
opacity.disabled   // 0.5
opacity.hover      // 0.8
opacity.pressed    // 0.6
opacity.overlay    // 0.5
```

---

## 💡 Bonnes Pratiques

### ✅ À FAIRE

```typescript
// Utiliser les tokens du thème
backgroundColor: colors.primary
padding: spacing.base
borderRadius: borderRadius.base
...shadows.base

// Utiliser les styles prédéfinis
...typography.styles.h1
```

### ❌ À ÉVITER

```typescript
// Éviter les valeurs en dur
backgroundColor: '#6366F1'  // ❌
padding: 16                 // ❌
borderRadius: 12            // ❌

// Préférer :
backgroundColor: colors.primary  // ✅
padding: spacing.base           // ✅
borderRadius: borderRadius.base // ✅
```

---

## 🌗 Support Dark Mode

Le système de thème inclut des variantes pour le dark mode :

```typescript
import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme();
const bgColor = colorScheme === 'dark' 
  ? colors.backgroundDark 
  : colors.background;
```

---

## 🔧 Extension du Thème

Pour ajouter de nouvelles valeurs, éditez `constants/theme.ts` :

```typescript
// Ajouter une nouvelle couleur
export const colors = {
  // ... couleurs existantes
  tertiary: '#F97316',  // Nouvelle couleur
};

// Ajouter un nouvel espacement
export const spacing = {
  // ... espacements existants
  giant: 80,  // Nouvel espacement
};
```

---

## 📱 Exemple Complet

```typescript
import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.base,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.base,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.base,
  },
  title: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    height: dimensions.buttonHeight.base,
    borderRadius: borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  buttonText: {
    ...typography.styles.button,
    color: colors.white,
  },
});
```

---

## 🎯 Résumé

Le système de thème NextManga centralise :
- ✅ **Couleurs** - Palette complète avec variantes dark mode
- ✅ **Typographie** - Tailles, poids et styles prédéfinis
- ✅ **Espacements** - Échelle cohérente de 4px à 64px
- ✅ **Rayons** - Coins arrondis standardisés
- ✅ **Ombres** - Collection d'ombres avec variantes colorées
- ✅ **Dimensions** - Hauteurs et largeurs standard
- ✅ **Animations** - Durées et easings
- ✅ **Opacités** - Valeurs pour différents états

Toujours utiliser ces tokens plutôt que des valeurs en dur pour garantir la cohérence ! 🎨
