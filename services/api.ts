const API_URL = 'https://nextmanga-backend.onrender.com';

export interface CreateUserPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface UserResponse {
  userId: string;
  displayName: string;
  avatarUrl: string;
  preferences: {
    themes: string[];
    moods: string[];
    vibes: string[];
    targetAudience: string;
  };
  history: any[];
  favoriteMangas: any[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  _id: string;
  email: string;
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

  createUser: async (payload: CreateUserPayload): Promise<UserResponse> => {
    return api.post<UserResponse>('/api/users', payload);
  },
};
