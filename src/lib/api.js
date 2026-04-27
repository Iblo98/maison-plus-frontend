const API_URL = 'https://maison-plus-backend.onrender.com/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const api = {
  get: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },

  post: async (url, body) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },

  put: async (url, body) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },

  delete: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
  },
};

export default api;
