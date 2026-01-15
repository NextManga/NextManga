import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useState } from 'react';

import { Header } from '@/components/home/Header';
import { SearchBar } from '@/components/home/SearchBar';
import { HeroBanner } from '@/components/home/HeroBanner';
import { SectionHeader } from '@/components/home/SectionHeader';
import { MangaCardHorizontal } from '@/components/home/MangaCardHorizontal';
import { ContinueReadingCard } from '@/components/home/ContinueReadingCard';

// Mock data - À remplacer par de vraies données de l'API
const FEATURED_MANGA = {
  title: "One Piece",
  genres: ["Action", "Aventure"],
  coverImage: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx30013-BeslEMqiPhlk.jpg"
};

const AI_RECOMMENDATIONS = [
  { id: '1', title: 'Chainsaw Man', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx105778-euxXZEIfDY2u.png', rating: 4.8 },
  { id: '2', title: 'Jujutsu Kaisen', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx101517-H3TdM3g5ZUe9.jpg', rating: 4.7 },
  { id: '3', title: 'Attack on Titan', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx53390-1RsuABC34P4l.jpg', rating: 4.9 },
];

const TRENDING_MANGAS = [
  { id: '1', title: 'Blue Lock', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx106130-yPNeuSu75ey1.jpg', rating: 4.6, position: 1 },
  { id: '2', title: 'Omniscient Reader', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx119257-Pi21aq3ey9GG.jpg', rating: 4.8, position: 2 },
  { id: '3', title: 'Solo Leveling', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx105398-b673Vt5ZSuz3.jpg', rating: 4.9, position: 3 },
];

const NEW_RELEASES = [
  { id: '1', title: 'New Manga 1', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx140475-QEGtrmdvbpOv.jpg', rating: 4.5 },
  { id: '2', title: 'New Manga 2', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx140407-fJQr0fmqq1IO.png', rating: 4.4 },
];

const CONTINUE_READING = [
  { id: '1', title: 'One Piece', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx30013-BeslEMqiPhlk.jpg', currentChapter: 45, totalChapters: 100 },
  { id: '2', title: 'Naruto', cover: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx30011-9yUF1dXWgDqN.jpg', currentChapter: 32, totalChapters: 72 },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <Header
        userName="John"
        notificationCount={3}
        onAvatarPress={() => console.log('Avatar pressed')}
        // onNotificationPress={() => console.log('Notification pressed')
        onNotificationPress={() => console.log('Notification pressed')}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => console.log('Filter pressed')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <HeroBanner
          title={FEATURED_MANGA.title}
          genres={FEATURED_MANGA.genres}
          coverImage={FEATURED_MANGA.coverImage}
          onReadPress={() => console.log('Read pressed')}
          onLearnMorePress={() => console.log('Learn more pressed')}
        />

        {/* AI Recommendations Section */}
        <SectionHeader
          title="Recommandations IA ✨"
          onSeeAllPress={() => console.log('See all AI')}
        />
        <FlatList
          data={AI_RECOMMENDATIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <MangaCardHorizontal
              title={item.title}
              cover={item.cover}
              rating={item.rating}
              onPress={() => console.log('Manga pressed:', item.title)}
              onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
            />
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Trending Section */}
        <SectionHeader
          title="Tendances 🔥"
          onSeeAllPress={() => console.log('See all trending')}
        />
        <FlatList
          data={TRENDING_MANGAS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <MangaCardHorizontal
              title={item.title}
              cover={item.cover}
              rating={item.rating}
              position={item.position}
              onPress={() => console.log('Manga pressed:', item.title)}
              onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
            />
          )}
          keyExtractor={(item) => item.id}
        />

        {/* New Releases Section */}
        <SectionHeader
          title="Nouveautés"
          onSeeAllPress={() => console.log('See all new')}
        />
        <FlatList
          data={NEW_RELEASES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <MangaCardHorizontal
              title={item.title}
              cover={item.cover}
              rating={item.rating}
              badge="NOUVEAU"
              badgeColor="#06B6D4"
              onPress={() => console.log('Manga pressed:', item.title)}
              onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
            />
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Continue Reading Section */}
        <SectionHeader
          title="Continuer la lecture"
          onSeeAllPress={() => console.log('See all continue')}
        />
        <FlatList
          data={CONTINUE_READING}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <ContinueReadingCard
              title={item.title}
              cover={item.cover}
              currentChapter={item.currentChapter}
              totalChapters={item.totalChapters}
              onPress={() => console.log('Continue reading:', item.title)}
            />
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  horizontalList: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
});
