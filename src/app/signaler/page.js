'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Home, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function SignalerContent() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const annonceId = searchParams.get('annonce');
  const [annonce, setAnnonce] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [raison, setRaison] = useState('');
  const [description, setDescription] = useState('');
  const [envoye, setEnvoye] = useState(false);

  useEffect(() => {
    if (!utilisateur) { router.push('/connexion'); return; }
    if (annonceId) chargerAnnonce();
  }, [utilisateur, annonceId]);

  const chargerAnnonce = async () => {
    try {
      const response = await api.get(`/annonces/${annonceId}`);
      setAnnonce(response.data.annonce);
    } catch (err) {
      toast.error('Annonce introuvable');
      router.push('/');
    } finally {
      setChargement(false);
    }
  };

  const soumettre = async () => {
    if (!raison) { toast.error('Choisissez une raison'); return; }
    setEnvoi(true);
    try {
      await api.post('/signalements', {
        annonce_id: annonceId,
        raison,
        description
      });
      setEnvoye(true);
      toast.success('Signalement envoyé !');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    } finally {
      setEnvoi(false);
    }
  };

  const raisons = [
    { id: 'annonce_frauduleuse', label: '🚨 Annonce frauduleuse', desc: 'Cette annonce semble être une arnaque' },
    { id: 'prix_incorrect', label: '💰 Prix incorrect', desc: 'Le prix affiché est trompeur ou faux' },
    { id: 'photos_incorrectes', label: '📷 Photos incorrectes', desc: 'Les photos ne correspondent pas au bien' },
    { id: 'bien_inexistant', label: '🏚️ Bien inexistant', desc: 'Ce bien n\'existe pas réellement' },
    { id: 'arnaque', label: '⚠️ Arnaque', desc: 'Tentative d\'escroquerie confirmée' },
    { id: 'contenu_inapproprie', label: '🚫 Contenu inapproprié', desc: 'Contenu choquant ou illégal' },
    { id: 'autre', label: '📝 Autre raison', desc: 'Autre problème non listé' },
  ];

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

  if (envoye) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={32} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Signalement envoyé !</h1>
            <p className="text-gray-500 mb-6">
              Notre équipe va examiner cette annonce dans les plus brefs délais. Merci de nous aider à maintenir la qualité de la plateforme.
            </p>
            <div className="space-y-3">
              <Link href="/"
                className="w-full block bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition text-center">
                Retour à l&apos;accueil
              </Link>
              <Link href={`/annonces/${annonceId}`}
                className="w-full block border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-center">
                Retour à l&apos;annonce
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <AlertTriangle size={24} className="text-red-500" />
          Signaler une annonce
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Aidez-nous à maintenir la qualité de Maison+ en signalant les annonces problématiques.
        </p>

        {/* Annonce */}
        {annonce && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
              {annonce.photo_principale ? (
                <img src={annonce.photo_principale} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home size={20} className="text-blue-300" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{annonce.titre}</h3>
              <p className="text-gray-400 text-xs">{annonce.quartier}, {annonce.ville}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">

          {/* Raison */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Raison du signalement <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {raisons.map((r) => (
                <button key={r.id} type="button"
                  onClick={() => setRaison(r.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition text-left ${
                    raison === r.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-100 hover:border-red-200'
                  }`}>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${raison === r.id ? 'text-red-600' : 'text-gray-700'}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                  </div>
                  {raison === r.id && (
                    <span className="text-red-500 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Donnez plus de détails sur le problème..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-red-400 transition resize-none"
            />
          </div>

          {/* Avertissement */}
          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
            <p className="text-yellow-700 text-xs">
              ⚠️ Les faux signalements peuvent entraîner la suspension de votre compte. Signalez uniquement les annonces réellement problématiques.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href={`/annonces/${annonceId}`}
              className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-center">
              Annuler
            </Link>
            <button onClick={soumettre} disabled={envoi || !raison}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {envoi ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              ) : (
                <>
                  <AlertTriangle size={18} />
                  Envoyer le signalement
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Signaler() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <SignalerContent />
    </Suspense>
  );
}