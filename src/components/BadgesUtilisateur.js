'use client';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function BadgesUtilisateur({ utilisateurId, afficherScore = true }) {
  const [badges, setBadges] = useState([]);
  const [score, setScore] = useState(0);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (utilisateurId) chargerBadges();
  }, [utilisateurId]);

  const chargerBadges = async () => {
    try {
      const response = await api.get(`/badges/${utilisateurId}`);
      setBadges(response.data.badges || []);
      setScore(response.data.score_confiance || 0);
    } catch (err) {
      console.error('Erreur badges:', err);
    } finally {
      setChargement(false);
    }
  };

  const getCouleurScore = (score) => {
    if (score >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 50) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 30) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getLabelScore = (score) => {
    if (score >= 80) return 'Très fiable';
    if (score >= 50) return 'Fiable';
    if (score >= 30) return 'En cours';
    return 'Nouveau';
  };

  if (chargement) return null;
  if (badges.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Score de confiance */}
      {afficherScore && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium ${getCouleurScore(score)}`}>
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
              <circle cx="18" cy="18" r="15.9"
                fill="none" stroke="#E5E7EB" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9"
                fill="none" stroke="currentColor" strokeWidth="3"
                strokeDasharray={`${score} ${100 - score}`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {score}
            </span>
          </div>
          <div>
            <p className="font-bold">Score de confiance</p>
            <p className="text-xs opacity-75">{getLabelScore(score)}</p>
          </div>
        </div>
      )}

      {/* Liste des badges */}
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <div key={badge.id}
            title={badge.label}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              badge.couleur === 'gold'
                ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                : badge.couleur === 'yellow'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                : badge.couleur === 'green'
                ? 'bg-green-50 border-green-200 text-green-600'
                : badge.couleur === 'purple'
                ? 'bg-purple-50 border-purple-200 text-purple-600'
                : badge.couleur === 'orange'
                ? 'bg-orange-50 border-orange-200 text-orange-600'
                : 'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
            <span>{badge.icone}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}