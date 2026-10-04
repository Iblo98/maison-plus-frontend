'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import toast from 'react-hot-toast';

// Lit la date d'expiration (champ "exp") du jeton, sans vérifier la signature :
// c'est le serveur qui fait foi, ceci évite juste d'afficher un faux état connecté.
const jetonExpire = (token) => {
  try {
    const charge = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(charge));
    return typeof exp === 'number' && exp * 1000 < Date.now();
  } catch (e) {
    return false;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStocke = localStorage.getItem('utilisateur');
    const token = localStorage.getItem('token');
    if (userStocke && token) {
      if (jetonExpire(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
        toast.error('Votre session a expiré. Veuillez vous reconnecter.', { id: 'session-expiree' });
      } else {
        setUtilisateur(JSON.parse(userStocke));
      }
    }
    setChargement(false);
  }, []);

  const connexion = async (email, mot_de_passe) => {
    const response = await api.post('/auth/connexion', { email, mot_de_passe });
    const { token, utilisateur } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    setUtilisateur(utilisateur);
    return utilisateur;
  };

  const inscription = async (donnees) => {
    const response = await api.post('/auth/inscription', donnees);
    const { token, utilisateur } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    setUtilisateur(utilisateur);
    return { token, utilisateur };
};

  const deconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateur(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{
      utilisateur,
      chargement,
      connexion,
      inscription,
      deconnexion
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
