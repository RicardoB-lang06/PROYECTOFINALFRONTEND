const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Auth Service Login Error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};