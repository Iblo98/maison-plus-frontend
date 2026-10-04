const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maison-plus-backend.onrender.com/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

const api = {
  get: async (url) => {
    const response = await fetch(`${API_URL}${url}`, { headers: headers() });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },

  post: async (url, body) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },

  put: async (url, body) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },

  // Envoi de fichiers (multipart/form-data).
  // Pas de Content-Type ici : le navigateur le génère avec le bon "boundary".
  upload: async (url, formData) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: { ...(getToken() && { Authorization: `Bearer ${getToken()}` }) },
      body: formData,
    });
    let data = {};
    try { data = await response.json(); } catch (e) { /* réponse non JSON */ }
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },

  delete: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: headers(),
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },
};

export default api;