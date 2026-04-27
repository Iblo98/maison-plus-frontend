'use client';
import { useState, useEffect } from 'react';
import Etoiles from './Etoiles';
import api from '../lib/api';

export default function ListeAvis({ utilisateurId }) {
  const [avis, setAvis] = useState([]);
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (utilisateurId) chargerAvis();
  }, [utilisateurId]);

  const chargerAvis = async () => {
    try {
      const response = await api.get(`/avis/utilisateur/${utilisateurId}`);
      setAvis(response.data.avis || []);
      setStats(response.data.statistiques);
    } catch (err) {
      console.error('Erreur avis:', err);
    } finally {
      setChargement(false);
    }
  };

  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (chargement) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1,2].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"/>)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistiques globales */}
      {stats && parseInt(stats.total) > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-black text-gray-800">{stats.moyenne || '0'}</p>
              <Etoiles note={parseFloat(stats.moyenne || 0)} taille={16} />
              <p className="text-xs text-gray-400 mt-1">{stats.total} avis</p>
            </div>

            {/* Barres de progression */}
            <div className="flex-1 space-y-1.5">
              {[
                { label: '5', count: stats.cinq },
                { label: '4', count: stats.quatre },
                { label: '3', count: stats.trois },
                { label: '2', count: stats.deux },
                { label: '1', count: stats.un },
              ].map(({ label, count }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-2">{label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Liste des avis */}
      {avis.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-400">Aucun avis pour le moment</p>
        </div>
      ) : (
        avis.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                {a.auteur_photo ? (
                  <img src={a.auteur_photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-600 font-bold text-sm">
                    {a.auteur_prenom?.[0]}{a.auteur_nom?.[0]}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800 text-sm">
                    {a.auteur_prenom} {a.auteur_nom}
                  </p>
                  <span className="text-gray-400 text-xs">{formaterDate(a.created_at)}</span>
                </div>
                <Etoiles note={a.note} taille={14} />
                {a.annonce_titre && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Pour : {a.annonce_titre}
                  </p>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{a.commentaire}</p>
          </div>
        ))
      )}
    </div>
  );
}
