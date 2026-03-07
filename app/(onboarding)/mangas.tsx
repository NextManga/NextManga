import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { MangaCard } from '@/components/onboarding/MangaCard';
import { MangaSearchBar } from '@/components/onboarding/MangaSearchBar';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { SelectedMangaChips } from '@/components/onboarding/SelectedMangaChips';
import { AppButton } from '@/components/ui/AppButton';
import { useAuth } from '@/contexts/AuthContext';
import { useSignUpForm } from '@/contexts/SignUpContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useMangaSelection } from '@/hooks/useMangaSelection';
import { api } from '@/services/api';


export default function MangasScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Array<{ id: string; title: string; cover: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedQuery = useDebounce(query);
  const { trending, results, loading, searchMangas } = useMangaSelection();
  const { formData, updateFormData, setLoading, setFormError, resetForm } = useSignUpForm();
  const { setAuth } = useAuth();

  useEffect(() => {
    searchMangas(debouncedQuery);
  }, [debouncedQuery]);

  const data = query.length > 0 ? results : trending;

  const toggle = (manga: { id: string; title: string; cover: string }) => {
    setSelected((prev) =>
      prev.some((item) => item.id === manga.id)
        ? prev.filter((item) => item.id !== manga.id)
        : [...prev, manga]
    );
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      setLoading(true);

      // Vérifier que les données requises sont présentes
      if (!formData.email || !formData.password || !formData.displayName) {
        // Déterminer quel champ manque
        const missingFields = [];
        if (!formData.displayName) missingFields.push(t('ui.auth.signUp.displayNamePlaceholder'));
        if (!formData.email) missingFields.push(t('ui.auth.signUp.emailPlaceholder'));
        if (!formData.password) missingFields.push(t('ui.auth.signUp.passwordPlaceholder'));
        
        const fieldsText = missingFields.join(', ');
        const detailedMessage = t('ui.onboarding.mangas.incompleteSignupMessage', { fields: fieldsText });
        
        Alert.alert(
          t('common.errorTitle'), 
          detailedMessage,
          [
            { 
              text: t('ui.onboarding.mangas.backToSignup'), 
              onPress: () => router.push('/(auth)/sign_up') 
            },
            { 
              text: t('common.cancel'), 
              style: 'cancel' 
            }
          ]
        );
        setIsSubmitting(false);
        setLoading(false);
        return;
      }

      console.log('📝 Envoi des données d\'inscription...', { 
        email: formData.email, 
        displayName: formData.displayName,
        password: '***' 
      });

      // Créer l'utilisateur via l'API
      const response = await api.createUser({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      });

      console.log('✅ Utilisateur créé:', response);

      // L'utilisateur a été créé, maintenant faire un login automatique pour obtenir le token
      console.log('🔐 Authentification automatique...');
      try {
        const loginResponse = await api.login({
          email: formData.email,
          password: formData.password,
        });

        console.log('✅ Login réussi:', loginResponse);

        if (loginResponse && loginResponse.token && loginResponse.user) {
          // Utiliser les données du user retourné
          const userProfile = loginResponse.user;
          const authToken = loginResponse.token;

          // Sauvegarder les genres favoris sélectionnés
          if (formData.genres && formData.genres.length > 0) {
            try {
              console.log('📝 Sauvegarde des genres favoris:', formData.genres);
              const savedGenres = await api.replaceFavoriteGenres(
                userProfile._id,
                formData.genres,
                authToken
              );
              if (savedGenres.length === 0) {
                console.warn('⚠️ Réponse vide lors de la sauvegarde des genres favoris');
              } else {
                console.log('✅ Genres favoris sauvegardés:', savedGenres);
              }
            } catch (genreError) {
              console.warn('⚠️ Erreur sauvegarde genres (non bloquant):', genreError);
              // Même si ça échoue, on continue avec l'authentification
            }
          }

          // Sauvegarder les mangas sélectionnés dans l'historique utilisateur
          if (selected.length > 0) {
            try {
              console.log('📝 Sauvegarde des mangas onboarding (history):', selected.length, 'mangas');
              await Promise.allSettled(
                selected.map((manga) =>
                  api.addToHistory(
                    userProfile._id,
                    {
                      mangaId: manga.id,
                      title: manga.title,
                      cover: manga.cover,
                      status: 'completed',
                    },
                    authToken
                  )
                )
              );
              await updateFormData({ selectedMangas: selected.map(m => m.id) });
              console.log('✅ Mangas onboarding traités pour l\'historique');
            } catch (historyError) {
              console.warn('⚠️ Erreur sauvegarde historique mangas (non bloquant):', historyError);
            }
          }

          // Authentifier l'utilisateur
          await setAuth(userProfile._id, authToken, userProfile);

          // Réinitialiser le formulaire d'inscription
          await resetForm();

          // Afficher un message de succès et rediriger vers la home
          Alert.alert(t('common.successTitle'), t('ui.onboarding.mangas.successMessage'), [
            {
              text: t('common.ok'),
              onPress: () => router.replace('/(tabs)'),
            },
          ]);
        } else {
          throw new Error('Données invalides reçues lors de l\'authentification');
        }
      } catch (loginError: any) {
        console.error('❌ Erreur lors de l\'authentification automatique:', loginError);
        const errorMessage = loginError.message || t('ui.onboarding.mangas.signupError');
        setFormError(errorMessage);
        Alert.alert(t('common.errorTitle'), `Création réussie mais erreur de connexion: ${errorMessage}`);
      }
    } catch (error: any) {
      const errorMessage = error.message || t('ui.onboarding.mangas.signupError');
      setFormError(errorMessage);
      console.error('❌ Erreur inscription:', error);
      Alert.alert(t('common.errorTitle'), errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader
        step={t('ui.onboarding.steps.step2of2')}
        onBack={() => router.back()}
        onSkip={() => router.replace('/')}
      />

      <Text style={styles.title}>{t('ui.onboarding.mangas.title')}</Text>
      <Text style={styles.subtitle}>{t('ui.onboarding.mangas.subtitle')}</Text>

      <MangaSearchBar
        value={query}
        onChange={setQuery}
        onClear={() => setQuery('')}
      />

      <SelectedMangaChips
        items={selected}
        onRemove={(mangaId) =>
          setSelected(selected.filter((item) => item.id !== mangaId))
        }
      />

      {!query && (
        <Text style={styles.sectionLabel}>{t('ui.onboarding.mangas.popular')}</Text>
      )}

      {loading && <ActivityIndicator style={{ marginVertical: 20 }} />}

      {!loading && (
        <FlatList
          data={data}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MangaCard
              title={item.title}
              cover={item.cover}
              rating={item.rating}
              selected={selected.some((selectedItem) => selectedItem.id === item.id)}
              onPress={() => toggle({ id: item.id, title: item.title, cover: item.cover })}
            />
          )}
        />
      )}

      <View style={styles.bottom}>
        <Text style={styles.counter}>
          {t('ui.onboarding.mangas.selectedCount', { count: selected.length })}
        </Text>

        <View style={styles.actions}>
          <AppButton
            title={t('common.back')}
            variant="outline"
            onPress={router.back}
            style={styles.backButton}
            textStyle={styles.backButtonText}
            disabled={isSubmitting}
          />
          <AppButton
            title={isSubmitting ? t('common.creating') : t('common.finish')}
            onPress={handleFinish}
            style={styles.finishButton}
            textStyle={styles.finishButtonText}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginHorizontal: 24,
    marginTop: 24,
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 12,
  },

  sectionLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 24,
    marginBottom: 12,
    marginTop: 8,
    fontWeight: '500',
  },

  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },

  gridContent: {
    paddingBottom: 140,
  },

  grid: {
    paddingHorizontal: 16,
    paddingBottom: 140, // espace pour le bottom fixed
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },

  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  counter: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },

  backButton: {
    width: '48%',
    height: 56,
    borderRadius: 12,
    marginTop: 0,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },

  backButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },

  finishButton: {
    width: '48%',
    height: 56,
    borderRadius: 12,
    marginTop: 0,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#1F2937',
//     marginHorizontal: 24,
//     marginTop: 24,
//   },

//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginHorizontal: 24,
//     marginTop: 8,
//     marginBottom: 12,
//   },

//   sectionLabel: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginHorizontal: 24,
//     marginBottom: 12,
//     marginTop: 8,
//     fontWeight: '500',
//   },

//   gridRow: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 24,
//   },

//   gridContent: {
//     paddingBottom: 140,
//   },

//   grid: {
//     paddingHorizontal: 16,
//     paddingBottom: 140, // espace pour le bottom fixed
//   },

//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 60,
//   },

//   emptyTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#374151',
//     marginTop: 16,
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginTop: 4,
//   },

//   bottom: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     paddingTop: 12,
//     paddingHorizontal: 24,
//     paddingBottom: 24,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },

//   counter: {
//     textAlign: 'center',
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 12,
//   },

//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 16,
//   },

//   backButton: {
//     width: '48%',
//     height: 56,
//     borderRadius: 12,
//     marginTop: 0,
//     borderWidth: 1.5,
//     borderColor: '#D1D5DB',
//     backgroundColor: '#FFFFFF',
//   },

//   backButtonText: {
//     color: '#374151',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   finishButton: {
//     width: '48%',
//     height: 56,
//     borderRadius: 12,
//     marginTop: 0,
//     backgroundColor: '#6366F1',
//     shadowColor: '#6366F1',
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 4,
//   },

//   finishButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });