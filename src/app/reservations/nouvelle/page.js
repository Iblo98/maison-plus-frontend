'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Home, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function NouvelleReservationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { utilisateur, chargement: authChargement } = useAuth();
  const annonceId = searchParams.get('annonce');
  const [annonce, setAnnonce] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [form, setForm] = useState({
    date_debut: '',
    date_fin: '',
    message: ''
  });
  const [estimation, setEstimation] = useState(null);

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      if (annonceId) chargerAnnonce();
    }
  }, [utilisateur, authChargement, annonceId]);

  useEffect(() => {
    if (form.date_debut && form.date_fin && annonce) {
      calculerEstimation();
    }
  }, [form.date_debut, form.date_fin]);

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

  const calculerEstimation = () => {
    if (!annonce) return;
    const debut = new Date(form.date_debut);
    const fin = new Date(form.date_fin);
    const nbJours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
    if (nbJours <= 0) return;

    let prixJournalier = parseFloat(annonce.prix);
    if (annonce.periode === 'mois') prixJournalier = parseFloat(annonce.prix) / 30;
    else if (annonce.periode === 'semaine') prixJournalier = parseFloat(annonce.prix) / 7;
    else if (annonce.periode === 'annee') prixJournalier = parseFloat(annonce.prix) / 365;

    setEstimation({
      nbJours,
      prixTotal: Math.round(prixJournalier * nbJours)
    });
  };

  const soumettre = async (e) => {
    e.preventDefault();
    if (!form.date_debut || !form.date_fin) {
      toast.error('Choisissez les dates');
      return;
    }
    setEnvoi(true);
    try {
      await api.post('/reservations', {
        annonce_id: annonceId,
        ...form
      });
      toast.success('Demande de réservation envoyée ! 📅');
      router.push('/reservations');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    } finally {
      setEnvoi(false);
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/annonces/${annonceId}`} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={24} className="text-orange-500" />
            Nouvelle réservation
          </h1>
        </div>

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
              <p className="text-blue-600 font-bold text-sm">
                {formaterPrix(annonce.prix)}/{annonce.periode || 'mois'}
              </p>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={soumettre} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Choisissez vos dates</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d&apos;arrivée <span className="text-red-500">*</span>
              </label>
              <input type="date" value={form.date_debut}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({...form, date_debut: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de départ <span className="text-red-500">*</span>
              </label>
              <input type="date" value={form.date_fin}
                min={form.date_debut || new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({...form, date_fin: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* Estimation prix */}
          {estimation && estimation.nbJours > 0 && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-orange-700 font-medium">Estimation du coût</p>
                  <p className="text-orange-500 text-sm">{estimation.nbJours} jours</p>
                </div>
                <p className="text-2xl font-black text-orange-600">
                  {formaterPrix(estimation.prixTotal)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message au propriétaire
            </label>
            <textarea value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              rows={3} placeholder="Présentez-vous et expliquez votre besoin..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Link href={`/annonces/${annonceId}`}
              className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-center">
              Annuler
            </Link>
            <button type="submit" disabled={envoi}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50">
              {envoi ? 'Envoi...' : '📅 Envoyer la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NouvelleReservation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <NouvelleReservationContent />
    </Suspense>
  );
}