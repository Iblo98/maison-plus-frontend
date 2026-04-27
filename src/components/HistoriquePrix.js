'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import api from '../lib/api';

export default function HistoriquePrix({ annonceId }) {
  const [historique, setHistorique] = useState([]);
  const [prixActuel, setPrixActuel] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (annonceId) chargerHistorique();
  }, [annonceId]);

  const chargerHistorique = async () => {
    try {
      const response = await api.get(`/historique-prix/${annonceId}`);
      setHistorique(response.data.historique || []);
      setPrixActuel(response.data.prix_actuel);
    } catch (err) {
      console.error('Erreur historique prix:', err);
    } finally {
      setChargement(false);
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const getVariation = (ancien, nouveau) => {
    const diff = ((nouveau - ancien) / ancien) * 100;
    return diff.toFixed(1);
  };

  if (chargement) return null;
  if (historique.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-600" />
        Historique des prix
      </h2>

      <div className="space-y-3">
        {/* Prix actuel */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div>
            <p className="text-xs text-blue-500 font-medium">Prix actuel</p>
            <p className="font-bold text-blue-700 text-lg">{formaterPrix(prixActuel)}</p>
          </div>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Actuel</span>
        </div>

        {/* Historique */}
        {[...historique].reverse().map((h, index) => {
          const variation = getVariation(h.ancien_prix, h.nouveau_prix);
          const estHausse = parseFloat(variation) > 0;
          const estBaisse = parseFloat(variation) < 0;

          return (
            <div key={h.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-400">{formaterDate(h.created_at)}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gray-500 text-sm line-through">
                    {formaterPrix(h.ancien_prix)}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {formaterPrix(h.nouveau_prix)}
                  </span>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                estHausse
                  ? 'bg-red-50 text-red-500'
                  : estBaisse
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {estHausse ? <TrendingUp size={12} /> :
                 estBaisse ? <TrendingDown size={12} /> :
                 <Minus size={12} />}
                {estHausse ? '+' : ''}{variation}%
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        💡 Une baisse de prix = bonne opportunité !
      </p>
    </div>
  );
}