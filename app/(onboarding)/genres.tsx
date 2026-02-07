import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

import { GenreCard } from '@/components/onboarding/GenreCard';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { AppButton } from '@/components/ui/AppButton';
import { GENRES } from '@/constants/genres';
import { useAuth } from '@/contexts/AuthContext';
import { useSignUpForm } from '@/contexts/SignUpContext';
import { api } from '@/services/api';



export default function GenresScreen() {
    const { formData, updateFormData } = useSignUpForm();
    const { userId, token, user, setUser } = useAuth();
    const isEditingProfile = !!userId && !!token; // Si authentifié, on édite le profil
    
    const [selected, setSelected] = useState<string[]>(formData.genres);
    const [isSaving, setIsSaving] = useState(false);
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const HORIZONTAL_PADDING = 24 * 2;
    const GAP = 12;

    const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING - GAP) / 2;

    // ✅ Charger les genres depuis le profil si on est authentifié
    useEffect(() => {
        if (isEditingProfile && user?.preferences?.genres) {
            setSelected(user.preferences.genres);
        }
    }, [isEditingProfile, user]);

    const toggleGenre = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handleContinue = async () => {
        if (isEditingProfile) {
            // ✅ Mode édition profil: sauvegarder sur l'API
            try {
                setIsSaving(true);
                const updatedProfile = await api.updateUserPreferences(
                    userId,
                    { genres: selected },
                    token
                );
                setUser(updatedProfile);
                Alert.alert('Succès', 'Vos préférences ont été mises à jour !', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } catch (error) {
                console.error('Erreur lors de la mise à jour des préférences:', error);
                Alert.alert('Erreur', 'Impossible de sauvegarder vos préférences.');
            } finally {
                setIsSaving(false);
            }
        } else {
            // Mode onboarding: sauvegarder dans le contexte
            updateFormData({ genres: selected });
            router.push('/(onboarding)/mangas');
        }
    };

    return (
        <View style={styles.container}>
            <OnboardingHeader
                step={isEditingProfile ? "Édition" : "Étape 1/2"}
                onBack={() => router.back()}
                onSkip={isEditingProfile ? undefined : () => router.replace('/')}
            />

            <Text style={styles.title}>Quels genres aimez-vous ?</Text>
            <Text style={styles.subtitle}>
                Sélectionnez au moins 3 genres pour personnaliser vos recommandations
            </Text>

            <FlatList
                data={GENRES}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => (
                    <GenreCard
                        {...item}
                        selected={selected.includes(item.id)}
                        onPress={() => toggleGenre(item.id)}
                        width={CARD_WIDTH}
                    />
                )}
            />

            <View style={styles.bottom}>
                <Text style={[styles.counter, selected.length < 3 && styles.counterError]}>
                    {selected.length} genres sélectionnés
                </Text>

                <AppButton
                    title={isSaving ? "Sauvegarde..." : (isEditingProfile ? "Enregistrer" : "Continuer")}
                    onPress={handleContinue}
                    disabled={selected.length < 3 || isSaving}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
        marginBottom: 24,
    },
    grid: {
        paddingHorizontal: 24,
    },
    bottom: {
        padding: 24,
    },
    counter: {
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 12,
    },
    counterError: {
        color: '#EF4444',
    },
});
