import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { MangaCard } from '@/components/onboarding/MangaCard';
import { MangaSearchBar } from '@/components/onboarding/MangaSearchBar';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { SelectedMangaChips } from '@/components/onboarding/SelectedMangaChips';
import { AppButton } from '@/components/ui/AppButton';
import { useDebounce } from '../hooks/useDebounce';
import { useMangaSelection } from '../hooks/useMangaSelection';


export default function MangasScreen() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query);
  const { trending, results, loading, searchMangas } = useMangaSelection();

  useEffect(() => {
    searchMangas(debouncedQuery);
  }, [debouncedQuery]);

  const data = query.length > 0 ? results : trending;

  const toggle = (title: string) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader
        step="Étape 2/2"
        onBack={() => router.back()}
        onSkip={() => router.replace('/')}
      />

      <Text style={styles.title}>Quels mangas avez-vous déjà lus ?</Text>
      <Text style={styles.subtitle}>
        Cela nous aide à mieux vous recommander de nouveaux titres
      </Text>

      <MangaSearchBar
        value={query}
        onChange={setQuery}
        onClear={() => setQuery('')}
      />

      <SelectedMangaChips
        items={selected}
        onRemove={(title) =>
          setSelected(selected.filter((t) => t !== title))
        }
      />

      {loading && <ActivityIndicator style={{ marginVertical: 20 }} />}

      {!loading && (
        <FlatList
          data={data}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MangaCard
              title={item.title}
              cover={item.cover}
              selected={selected.includes(item.title)}
              onPress={() => toggle(item.title)}
            />
          )}
        />
      )}

      <View style={styles.bottom}>
        <Text style={styles.counter}>
          {selected.length} mangas sélectionnés
        </Text>

        <View style={styles.actions}>
          <AppButton
            title="Retour"
            variant="outline"
            onPress={router.back}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
          <AppButton
            title="Terminer"
            onPress={() => router.replace('/')}
            style={styles.finishButton}
            textStyle={styles.finishButtonText}
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

  section: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 24,
    marginBottom: 12,
    marginTop: 8,
    fontWeight: '500',
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