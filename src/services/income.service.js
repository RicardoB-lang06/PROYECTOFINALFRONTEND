const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const incomeService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ingresos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },
  create: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ingresos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  update: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ingresos/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  delete: async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ingresos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  }
};