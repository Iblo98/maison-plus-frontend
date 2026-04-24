'use client';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function PrixDevise({ prix, className = '' }) {
  const [taux, setTaux] = useState(600);
  const [afficherUSD, setAfficherUSD] = useState(false);

  useEffect(() => {
    chargerTaux();
  }, []);

  const chargerTaux = async () => {
    try {
      const response = await api.get('/devise/taux');
      setTaux(response.data.taux.USD_TO_XOF);
    } catch (err) {
      console.error('Erreur taux:', err);
    }
  };

  const prixUSD = (prix / taux).toFixed(2);
  const prixXOF = new Intl.NumberFormat('fr-FR').format(prix);

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span className="font-bold text-orange-500">
        {afficherUSD ? `$${prixUSD}` : `${prixXOF} XOF`}
      </span>
      <button
        onClick={() => setAfficherUSD(!afficherUSD)}
        className="text-xs text-blue-500 hover:underline text-left mt-0.5"
      >
        {afficherUSD
          ? `≈ ${prixXOF} XOF`
          : `≈ $${prixUSD} USD`
        }
      </button>
    </div>
  );
}