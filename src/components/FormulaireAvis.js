'use client';
import { useState } from 'react';
import Etoiles from './Etoiles';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function FormulaireAvis({ annonceId, destinataireId, onSuccess }) {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [chargement, setChargement] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    if (note === 0) {
      toast.error('Sélectionnez une note');
      return;
    }
    if (commentaire.trim().length < 10) {
      toast.error('Le commentaire doit contenir au moins 10 caractères');
      return;
    }

    setChargement(true);
    try {
      await api.post('/avis', {
        annonce_id: annonceId,
        destinataire_id: destinataireId,
        note,
        commentaire
      });
      toast.success('Avis publié !');
      setNote(0);
      setCommentaire('');
      if (onSuccess) onSuccess();
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur');
    } finally {
      setChargement(false);
    }
  };

  const labels = {
    1: 'Très mauvais',
    2: 'Mauvais',
    3: 'Correct',
    4: 'Bien',
    5: 'Excellent !'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Laisser un avis</h3>

      <form onSubmit={soumettre} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <Etoiles note={note} taille={32} modifiable={true} onChange={setNote} />
            {note > 0 && (
              <span className="text-sm font-medium text-yellow-600">
                {labels[note]}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commentaire <span className="text-red-500">*</span>
          </label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Décrivez votre expérience avec ce propriétaire..."
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition resize-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            {commentaire.length} / minimum 10 caractères
          </p>
        </div>

        <button type="submit" disabled={chargement || note === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
          {chargement ? 'Publication...' : 'Publier l\'avis'}
        </button>
      </form>
    </div>
  );
}
