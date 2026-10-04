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

// Session expirée : le serveur répond 401 alors qu'un jeton a été envoyé.
// On ignore les routes /auth/ : là, un 401 signifie "mauvais mot de passe".
const gererSessionExpiree = (status, url) => {
  if (typeof window === 'undefined') return;
  if (status !== 401 || !getToken() || url.startsWith('/auth/')) return;
  localStorage.removeItem('token');
  localStorage.removeItem('utilisateur');
  if (!window.location.pathname.startsWith('/connexion')) {
    window.location.href = '/connexion?session=expiree';
  }
};

// Lecture commune des réponses : JSON tolérant + gestion de la session expirée
const lireReponse = async (response, url) => {
  let data = {};
  try { data = await response.json(); } catch (e) { /* réponse non JSON */ }
  if (!response.ok) {
    gererSessionExpiree(response.status, url);
    throw { response: { data, status: response.status } };
  }
  return { data };
};

const api = {
  get: async (url) => {
    const response = await fetch(`${API_URL}${url}`, { headers: headers() });
    return lireReponse(response, url);
  },

  post: async (url, body) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    return lireReponse(response, url);
  },

  put: async (url, body) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    });
    return lireReponse(response, url);
  },

  // Envoi de fichiers (multipart/form-data).
  // Pas de Content-Type ici : le navigateur le génère avec le bon "boundary".
  upload: async (url, formData) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: { ...(getToken() && { Authorization: `Bearer ${getToken()}` }) },
      body: formData,
    });
    return lireReponse(response, url);
  },

  delete: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: headers(),
    });
    return lireReponse(response, url);
  },
};

export default api;
