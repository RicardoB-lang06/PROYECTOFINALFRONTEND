const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const deductionService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/deducciones`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },
  create: async (data) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deducciones`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  
  if (!res.ok) {
    throw new Error(result.error || 'Error al guardar en el servidor');
  }

  return result;
},
update: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/deducciones/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  delete: async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deducciones/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 204) {
      return true; 
    }

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al eliminar deducción');
    }

    return await res.json();
  }

};