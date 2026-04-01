'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStocke = localStorage.getItem('utilisateur');
    const token = localStorage.getItem('token');
    if (userStocke && token) {
      setUtilisateur(JSON.parse(userStocke));
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
    return utilisateur;
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