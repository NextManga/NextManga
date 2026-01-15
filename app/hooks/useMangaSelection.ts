import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Manga = {
  id: string;
  title: string;
  cover: string;
};

export const useMangaSelection = () => {
  const [trending, setTrending] = useState<Manga[]>([]);
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Mangas populaires
  const fetchTrending = async () => {
    setLoading(true);
    try {
      const data = await api.get<Manga[]>(
        '/api/manga/trending?limit=10'
      );
      setTrending(data);
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
      const data = await api.get<Manga[]>(
        `/api/manga/search?q=${encodeURIComponent(query)}&limit=5&page=1`
      );
      setResults(data);
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
