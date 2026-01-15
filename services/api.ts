const API_URL = 'https://nextmanga-backend.onrender.com';

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${API_URL}${endpoint}`);

    if (!res.ok) {
      throw new Error('Erreur API');
    }

    return res.json();
  },
};
