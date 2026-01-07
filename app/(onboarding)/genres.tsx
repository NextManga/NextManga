import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

import { GenreCard } from '@/components/onboarding/GenreCard';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { AppButton } from '@/components/ui/AppButton';
import { GENRES } from '@/constants/genres';



export default function GenresScreen() {
    const [selected, setSelected] = useState<string[]>([]);
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const HORIZONTAL_PADDING = 24 * 2;
    const GAP = 12;

    const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING - GAP) / 2;

    const toggleGenre = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    return (
        <View style={styles.container}>
            <OnboardingHeader
                step="Étape 1/2"
                onBack={() => router.back()}
                onSkip={() => router.replace('/')}
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
                <Text style={styles.counter}>
                    {selected.length} genres sélectionnés
                </Text>

                <AppButton
                    title="Continuer"
                    onPress={() => router.push('/(onboarding)/manga_prefs')}
                    disabled={selected.length < 3}
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
});
