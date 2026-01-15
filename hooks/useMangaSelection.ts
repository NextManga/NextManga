import { api } from '@/services/api';
import { useEffect, useState } from 'react';

type ApiManga = {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: string;
  description: string;
  genres: string[];
  tags: string[];
  score: number;
  trending: number;
};

type ApiResponse = {
  success: boolean;
  count: number;
  data: ApiManga[];
};

type Manga = {
  id: string;
  title: string;
  cover: string;
};

const transformManga = (apiManga: ApiManga): Manga => ({
  id: apiManga.id.toString(),
  title: apiManga.title.english || apiManga.title.romaji,
  cover: apiManga.coverImage,
});

export const useMangaSelection = () => {
  const [trending, setTrending] = useState<Manga[]>([]);
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Mangas populaires
  const fetchTrending = async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(
        '/api/manga/trending?limit=12'
      );
      const transformed = response.data.map(transformManga);
      setTrending(transformed);
    } catch (error) {
      console.error('Error fetching trending:', error);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Recherche manga
  const searchMangas = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(
        `/api/manga/search?q=${encodeURIComponent(query)}&limit=5&page=1`
      );
      const transformed = response.data.map(transformManga);
      setResults(transformed);
    } catch (error) {
      console.error('Error searching mangas:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return {
    trending,
    results,
    loading,
    searchMangas,
  };
};
