const API_URL = 'https://nextmanga-backend.onrender.com';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Maps API manga response to RecommendationItem format
 */
const mapToRecommendationItem = (item: any): RecommendationItem => {
  return {
    id: String(item.id || item.mangaId || ''),
    title: typeof item.title === 'object' ? (item.title.romaji || item.title.english || item.title) : item.title,
    cover: item.coverImage || item.cover || 'https://via.placeholder.com/130x200?text=No+Image',
    rating: item.averageScore ? Math.round(item.averageScore) / 10 : item.matchScore ? item.matchScore / 100 : 4.0,
    genres: item.genres,
    description: item.description
  };
};

export interface CreateUserPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  preferences?: {
    genres?: string[];
    moods?: string[];
    themes?: string[];
    targetAudience?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface HistoryItem {
  mangaId: string;
  title: string;
  cover?: string;
  status: 'planned' | 'reading' | 'completed' | 'paused';
  rating?: number;
  progress?: number;
  currentChapter?: number;
  totalChapters?: number;
  lastReadAt?: string;
  tags?: string[];
}

export interface RecommendationItem {
  id: string;
  title: string;
  cover: string;
  rating: number;
  genres?: string[];
  description?: string;
}

export interface LoginResponse {
  token?: string;
  user?: UserProfile;
  _id?: string;
  email?: string;
}

export interface MangaStats {
  success: boolean;
  mangaId: number;
  title: string;
  stats: {
    averageScore: number;
    totalVotes: number;
    popularity: number;
    favourites: number;
    trending: number;
    rankings: any[];
    scoreDistribution: {
      '5stars': number;
      '4stars': number;
      '3stars': number;
      '2stars': number;
      '1star': number;
    };
  };
}

export interface MangaDetailResponse {
  success: boolean;
  data: {
    id: number;
    title: {
      romaji?: string;
      english?: string;
      native?: string;
    } | string;
    coverImage: string;
    description?: string;
    genres: string[];
    status: string;
    chapters?: number;
    volumes?: number;
    averageScore?: number;
    popularity?: number;
    favourites?: number;
    startDate?: {
      year?: number;
      month?: number;
      day?: number;
    };
    tags?: any[];
    staff?: {
      edges: Array<{
        role: string;
        node: {
          name: {
            full: string;
          };
        };
      }>;
    };
  };
}

export interface LibraryStatus {
  inLibrary: boolean;
  isFavorite: boolean;
  status?: 'reading' | 'planned' | 'completed' | 'dropped' | 'paused';
  rating?: number;
  progress?: number;
}

export interface AddToLibraryPayload {
  mangaId: string;
  title: string;
  status: 'planned' | 'reading' | 'completed' | 'dropped';
  rating?: number | null;
  progress?: number;
}

export interface ToggleFavoritePayload {
  title: string;
  score?: number | null;
  notes?: string;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      console.log(`🔵 GET Request: ${API_URL}${endpoint}`);
      const res = await fetch(`${API_URL}${endpoint}`);

      console.log(`📊 Response Status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.log('❌ Error Response:', errorData);
        throw new Error(errorData?.message || `Erreur API (${res.status})`);
      }

      return res.json();
    } catch (error: any) {
      console.error('❌ GET Request Failed:', error);
      throw error;
    }
  },

  post: async <T = any>(endpoint: string, body: any): Promise<T> => {
    try {
      console.log(`🟢 POST Request: ${API_URL}${endpoint}`);
      console.log('📤 Request Body:', JSON.stringify(body, null, 2));

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(`📊 Response Status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.log('❌ Error Response Text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        const errorMessage = errorData?.message || errorData?.error || `Erreur API (${res.status})`;
        console.log('❌ Error Message:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log('✅ Response Success:', data);
      return data;
    } catch (error: any) {
      console.error('❌ POST Request Failed:', error);
      throw error;
    }
  },

  delete: async <T = any>(endpoint: string, token?: string): Promise<T> => {
    try {
      console.log(`🔴 DELETE Request: ${API_URL}${endpoint}`);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      console.log(`📊 Response Status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.log('❌ Error Response:', errorData);
        throw new Error(errorData?.message || `Erreur API (${res.status})`);
      }

      return res.json();
    } catch (error: any) {
      console.error('❌ DELETE Request Failed:', error);
      throw error;
    }
  },

  authenticatedGet: async <T>(endpoint: string, token: string): Promise<T> => {
    try {
      console.log(`🔵 GET Request (Auth): ${API_URL}${endpoint}`);
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`📊 Response Status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.log('❌ Error Response:', errorData);
        throw new Error(errorData?.message || `Erreur API (${res.status})`);
      }

      return res.json();
    } catch (error: any) {
      console.error('❌ GET Request Failed:', error);
      throw error;
    }
  },

  authenticatedPost: async <T = any>(endpoint: string, body: any, token: string): Promise<T> => {
    try {
      console.log(`🟢 POST Request (Auth): ${API_URL}${endpoint}`);
      console.log('📤 Request Body:', JSON.stringify(body, null, 2));

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log(`📊 Response Status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.log('❌ Error Response Text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        const errorMessage = errorData?.message || errorData?.error || `Erreur API (${res.status})`;
        console.log('❌ Error Message:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log('✅ Response Success:', data);
      return data;
    } catch (error: any) {
      console.error('❌ POST Request Failed:', error);
      throw error;
    }
  },

  createUser: async (payload: CreateUserPayload): Promise<UserProfile> => {
    return api.post<UserProfile>('/api/users', payload);
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const endpoints = ['/api/auth/login', '/api/users/login'];
    let lastError: any;

    for (const endpoint of endpoints) {
      try {
        console.log(`🟢 POST Request: ${API_URL}${endpoint}`);
        console.log('📤 Request Body:', JSON.stringify(payload, null, 2));

        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log(`📊 Response Status: ${res.status}`);

        if (!res.ok) {
          const errorText = await res.text();
          console.log('❌ Error Response Text:', errorText);

          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText };
          }

          const errorMessage =
            errorData?.message ||
            errorData?.error ||
            `Erreur API (${res.status})`;
          console.log('❌ Error Message:', errorMessage);

          const error = new Error(errorMessage) as Error & { status?: number };
          error.status = res.status;
          throw error;
        }

        const data = await res.json();
        console.log('✅ Response Success:', data);
        return data as LoginResponse;
      } catch (error: any) {
        const status = error?.status;
        const message = error?.message || '';
        if (status === 404 || message.includes('Route not found')) {
          lastError = error;
          continue;
        }
        throw error;
      }
    }

    throw lastError || new Error('All login endpoints failed');
  },

  getUser: async (userId: string, token: string): Promise<UserProfile> => {
    return api.authenticatedGet<UserProfile>(`/api/users/${userId}`, token);
  },

  getHistory: async (userId: string, token: string): Promise<HistoryItem[]> => {
    return api.authenticatedGet<HistoryItem[]>(`/api/users/${userId}/history`, token);
  },

  getRecommendations: async (userId: string, token: string): Promise<RecommendationItem[]> => {
    return api.authenticatedGet<RecommendationItem[]>(`/api/recommendations/history`, token);
  },

  addToHistory: async (userId: string, data: any, token: string): Promise<any> => {
    return api.authenticatedPost<any>(`/api/users/${userId}/history`, data, token);
  },

  updateHistory: async (userId: string, mangaId: string, data: any, token: string): Promise<any> => {
    return api.authenticatedPost<any>(`/api/users/${userId}/history/${mangaId}`, data, token);
  },

  // ============================================
  // MANGA DETAIL ENDPOINTS
  // ============================================

  getMangaDetail: async (mangaId: string): Promise<MangaDetailResponse> => {
    return api.get<MangaDetailResponse>(`/api/manga/${mangaId}`);
  },

  getMangaStats: async (mangaId: string): Promise<MangaStats> => {
    return api.get<MangaStats>(`/api/manga/${mangaId}/stats`);
  },

  getLibraryStatus: async (mangaId: string, token: string): Promise<LibraryStatus> => {
    return api.authenticatedGet<LibraryStatus>(`/api/user/library/status/${mangaId}`, token);
  },

  addToLibrary: async (payload: AddToLibraryPayload, token: string): Promise<any> => {
    return api.authenticatedPost<any>(`/api/user/library/add`, payload, token);
  },

  toggleFavorite: async (mangaId: string, payload: ToggleFavoritePayload, token: string): Promise<any> => {
    return api.authenticatedPost<any>(`/api/user/favorites/toggle/${mangaId}`, payload, token);
  },

  removeFromLibrary: async (mangaId: string, token: string): Promise<any> => {
    return api.delete<any>(`/api/user/library/remove/${mangaId}`, token);
  },

  // ============================================
  // EXPLORE ENDPOINTS (Trending, New, Popular)
  // ============================================

  // ✅ GET Trending mangas
  getTrendingMangas: async (): Promise<RecommendationItem[]> => {
    try {
      console.log(`🔵 GET Request: ${API_URL}/api/manga/trending`);
      const res = await fetch(`${API_URL}/api/manga/trending`);
      console.log(`📊 Response Status: ${res.status}`);
      if (!res.ok) throw new Error(`Erreur API (${res.status})`);
      const response = await res.json();
      console.log(`📦 Trending Response - Success:`, response.success, `Count:`, response.count);
      
      // API retourne { success, count, data: [...] }
      const items = response.data || [];
      return Array.isArray(items) ? items.map(mapToRecommendationItem) : [];
    } catch (err) {
      console.warn('Impossible de charger les tendances:', err);
      return [];
    }
  },

  // ✅ GET New releases
  getNewReleases: async (page: number = 1, limit: number = 20): Promise<RecommendationItem[]> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      console.log(`🔵 GET Request: ${API_URL}/api/manga/new?${params.toString()}`);
      const res = await fetch(`${API_URL}/api/manga/new?${params.toString()}`);
      console.log(`📊 Response Status: ${res.status}`);
      if (!res.ok) throw new Error(`Erreur API (${res.status})`);
      const response = await res.json();
      console.log(`📦 New Releases Response - Success:`, response.success, `Count:`, response.count);

      const items = response.data || [];
      return Array.isArray(items) ? items.map(mapToRecommendationItem) : [];
    } catch (err) {
      console.warn('Impossible de charger les nouveautés:', err);
      return [];
    }
  },

  // ✅ GET Popular mangas (alias pour compatibilité)
  getPopularMangas: async (): Promise<RecommendationItem[]> => {
    try {
      console.log(`🔵 GET Request: ${API_URL}/api/manga/trending`);
      const res = await fetch(`${API_URL}/api/manga/trending`);
      console.log(`📊 Response Status: ${res.status}`);
      if (!res.ok) throw new Error(`Erreur API (${res.status})`);
      const response = await res.json();
      console.log(`📦 Popular Response - Success:`, response.success, `Count:`, response.count);
      
      const items = response.data || [];
      return Array.isArray(items) ? items.map(mapToRecommendationItem) : [];
    } catch (err) {
      console.warn('Impossible de charger les mangas populaires:', err);
      return [];
    }
  },

  // ✅ POST Recommandations pour un manga spécifique (via seedMangaId)
  getRecommendationsForManga: async (mangaId: string, token?: string): Promise<RecommendationItem[]> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      console.log(`🟠 POST Request: ${API_URL}/api/recommendations/preview`);
      console.log(`📤 Request Body: { seedMangaId: "${mangaId}", limit: 6 }`);
      const res = await fetch(`${API_URL}/api/recommendations/preview`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          seedMangaId: mangaId,
          limit: 6
        })
      });
      console.log(`📊 Response Status: ${res.status}`);
      if (!res.ok) {
        const errorData = await res.text();
        console.log(`❌ Error Response: ${errorData}`);
        throw new Error(`Erreur API (${res.status})`);
      }
      const response = await res.json();
      console.log(`📦 Recommendations Response - Success:`, response.success, `Items:`, response.items?.length || 0);
      
      // API retourne { success, items: [{ mangaId, title, matchScore }] }
      const items = response.items || [];
      return Array.isArray(items) ? items.map(mapToRecommendationItem) : [];
    } catch (err) {
      console.warn('Impossible de charger les recommandations:', err);
      return [];
    }
  },

  // ✅ Recommandations IA personnalisées (user)
  getRecommendationsMangas: async (token: string, limit: number = 20): Promise<RecommendationItem[]> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      console.log(`🟠 POST Request: ${API_URL}/api/recommendations/user`);
      console.log(`📤 Request Body: { limit: ${limit} }`);
      const res = await fetch(`${API_URL}/api/recommendations/user`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ limit }),
      });
      console.log(`📊 Response Status: ${res.status}`);
      if (!res.ok) {
        const errorData = await res.text();
        console.log(`❌ Error Response: ${errorData}`);
        throw new Error(`Erreur API (${res.status})`);
      }
      const response = await res.json();
      console.log(`📦 Recommendations User Response - Success:`, response.success, `Count:`, response.count);

      const items = response.items || [];
      return Array.isArray(items) ? items.map(mapToRecommendationItem) : [];
    } catch (err) {
      console.warn('Impossible de charger les recommandations personnalisées:', err);
      return [];
    }
  },
};
