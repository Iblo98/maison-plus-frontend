'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import fr from '../messages/fr.json';
import en from '../messages/en.json';

const traductions = { fr, en };

const LangueContext = createContext();

export function LangueProvider({ children }) {
  const [langue, setLangue] = useState('fr');

  useEffect(() => {
    const langueStockee = localStorage.getItem('langue') || 'fr';
    setLangue(langueStockee);
  }, []);

  const changerLangue = (nouvelleLangue) => {
    setLangue(nouvelleLangue);
    localStorage.setItem('langue', nouvelleLangue);
  };

  const t = (cle) => {
    const parties = cle.split('.');
    let valeur = traductions[langue];
    for (const partie of parties) {
      valeur = valeur?.[partie];
    }
    return valeur || cle;
  };

  return (
    <LangueContext.Provider value={{ langue, changerLangue, t }}>
      {children}
    </LangueContext.Provider>
  );
}

export const useLangue = () => useContext(LangueContext);