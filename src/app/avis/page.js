'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Star, Home, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function AvisContent() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const annonceId = searchParams.get('annonce');
  const [annonce, setAnnonce] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [note, setNote] = useState(0);
  const [noteHover, setNoteHover] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [avisExistant, setAvisExistant] = useState(false);

  useEffect(() => {
    if (!utilisateur) { router.push('/connexion'); return; }
    if (annonceId) chargerAnnonce();
  }, [utilisateur, annonceId]);

  const chargerAnnonce = async () => {
    try {
      const [annonceRes, avisRes] = await Promise.all([
        api.get(`/annonces/${annonceId}`),
        api.get(`/avis/annonce/${annonceId}`)
      ]);
      setAnnonce(annonceRes.data.annonce);
      const dejaNote = avisRes.data.avis?.find(a => a.auteur_id === utilisateur?.id);
      if (dejaNote) setAvisExistant(true);
    } catch (err) {
      toast.error('Annonce introuvable');
      router.push('/');
    } finally {
      setChargement(false);
    }
  };

  const soumettre = async () => {
    if (note === 0) { toast.error('Choisissez une note'); return; }
    if (commentaire.trim().length < 10) { toast.error('Commentaire trop court (min 10 caractères)'); return; }
    setEnvoi(true);
    try {
      await api.post('/avis', {
        annonce_id: annonceId,
        destinataire_id: annonce.utilisateur_id,
        note,
        commentaire
      });
      toast.success('Avis publié ! Merci pour votre retour.');
      router.push(`/annonces/${annonceId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    } finally {
      setEnvoi(false);
    }
  };

  const labels = ['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'];
  const couleurs = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Star size={24} className="text-yellow-500" />
          Laisser un avis
        </h1>

        {/* Annonce */}
        {annonce && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
              {annonce.photo_principale ? (
                <img src={annonce.photo_principale} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home size={24} className="text-blue-300" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{annonce.titre}</h3>
              <p className="text-gray-500 text-sm">{annonce.quartier}, {annonce.ville}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Vendeur : {annonce.prenom} {annonce.nom}
              </p>
            </div>
          </div>
        )}

        {avisExistant ? (
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <Star size={48} className="text-yellow-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">Avis déjà publié</h2>
            <p className="text-gray-500 mb-4">Vous avez déjà laissé un avis pour cette annonce.</p>
            <Link href={`/annonces/${annonceId}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Retour à l&apos;annonce
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

            {/* Étoiles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Note <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((etoile) => (
                  <button key={etoile} type="button"
                    onClick={() => setNote(etoile)}
                    onMouseEnter={() => setNoteHover(etoile)}
                    onMouseLeave={() => setNoteHover(0)}
                    className="transition-transform hover:scale-110">
                    <Star
                      size={40}
                      className={`transition ${
                        etoile <= (noteHover || note)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {(noteHover || note) > 0 && (
                  <span className={`ml-2 font-medium ${couleurs[noteHover || note]}`}>
                    {labels[noteHover || note]}
                  </span>
                )}
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire <span className="text-red-500">*</span>
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={4}
                placeholder="Décrivez votre expérience avec ce vendeur/propriétaire... (minimum 10 caractères)"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {commentaire.length} caractères {commentaire.length < 10 ? `(${10 - commentaire.length} restants)` : '✓'}
              </p>
            </div>

            <div className="flex gap-3">
              <Link href={`/annonces/${annonceId}`}
                className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-center">
                Annuler
              </Link>
              <button onClick={soumettre} disabled={envoi || note === 0}
                className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-medium hover:bg-yellow-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {envoi ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                ) : (
                  <>
                    <Send size={18} />
                    Publier l&apos;avis
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Avis() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <AvisContent />
    </Suspense>
  );
}