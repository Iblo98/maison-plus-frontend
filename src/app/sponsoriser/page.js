'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Star, Zap, Crown, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Sponsoriser() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const annonceId = searchParams.get('annonce');

  const [annonce, setAnnonce] = useState(null);
  const [planChoisi, setPlanChoisi] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);

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
      router.push('/dashboard');
    }
  };

  const plans = [
    {
      id: 'starter',
      nom: 'Starter',
      duree: '7 jours',
      prix: 2500,
      icon: Star,
      couleur: 'blue',
      avantages: [
        'Badge "Sponsorisé" sur la carte',
        'Apparaître en tête des résultats',
        'Plus de visibilité pendant 7 jours',
        'Statistiques de vues'
      ]
    },
    {
      id: 'standard',
      nom: 'Standard',
      duree: '14 jours',
      prix: 4500,
      icon: Zap,
      couleur: 'purple',
      populaire: true,
      avantages: [
        'Badge "Sponsorisé" sur la carte',
        'Apparaître en tête des résultats',
        'Plus de visibilité pendant 14 jours',
        'Statistiques de vues',
        'Mise en avant sur la page d\'accueil'
      ]
    },
    {
      id: 'premium',
      nom: 'Premium',
      duree: '30 jours',
      prix: 8000,
      icon: Crown,
      couleur: 'yellow',
      avantages: [
        'Badge "Sponsorisé" sur la carte',
        'Apparaître en tête des résultats',
        'Plus de visibilité pendant 30 jours',
        'Statistiques de vues détaillées',
        'Mise en avant sur la page d\'accueil',
        'Notification aux utilisateurs intéressés'
      ]
    }
  ];

  const lancerSponsorisation = async () => {
    if (!planChoisi) {
      toast.error('Choisissez un plan');
      return;
    }
    setChargement(true);
    try {
      // En mode test — activer directement
      await api.post('/sponsorisations/activer-manuel', {
        annonce_id: annonceId,
        duree_jours: plans.find(p => p.id === planChoisi)?.duree.split(' ')[0]
      });

      toast.success('Annonce sponsorisée avec succès !');
      setSucces(true);
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur lors de la sponsorisation');
    } finally {
      setChargement(false);
    }
  };

  if (succes) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Annonce sponsorisée ! 🎉
            </h1>
            <p className="text-gray-500 mb-6">
              Votre annonce apparaîtra en tête des résultats et aura plus de visibilité.
            </p>
            <div className="space-y-3">
              <Link href={`/annonces/${annonceId}`}
                className="w-full block bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                Voir mon annonce
              </Link>
              <Link href="/dashboard"
                className="w-full block border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                Retour au dashboard
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

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sponsoriser une annonce</h1>
            {annonce && (
              <p className="text-gray-500 text-sm">{annonce.titre} — {annonce.ville}</p>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const estChoisi = planChoisi === plan.id;
            return (
              <div key={plan.id}
                onClick={() => setPlanChoisi(plan.id)}
                className={`relative bg-white rounded-2xl p-6 shadow-sm cursor-pointer transition-all ${
                  estChoisi
                    ? 'ring-2 ring-blue-600 shadow-lg scale-105'
                    : 'hover:shadow-md hover:scale-102'
                }`}>

                {/* Badge populaire */}
                {plan.populaire && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ Populaire
                  </div>
                )}

                {/* Icône */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  plan.couleur === 'blue' ? 'bg-blue-100' :
                  plan.couleur === 'purple' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  <Icon size={24} className={
                    plan.couleur === 'blue' ? 'text-blue-600' :
                    plan.couleur === 'purple' ? 'text-purple-600' :
                    'text-yellow-600'
                  } />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.nom}</h3>
                <p className="text-gray-400 text-sm mb-3">{plan.duree}</p>

                <p className="text-3xl font-black text-gray-800 mb-4">
                  {plan.prix.toLocaleString('fr-FR')}
                  <span className="text-base font-normal text-gray-400"> XOF</span>
                </p>

                <div className="space-y-2">
                  {plan.avantages.map((avantage, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{avantage}</span>
                    </div>
                  ))}
                </div>

                {estChoisi && (
                  <div className="mt-4 bg-blue-50 rounded-xl p-2 text-center text-blue-600 text-sm font-medium">
                    ✓ Plan sélectionné
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bouton payer */}
        {planChoisi && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800">
                  Plan {plans.find(p => p.id === planChoisi)?.nom}
                </p>
                <p className="text-gray-400 text-sm">
                  {plans.find(p => p.id === planChoisi)?.duree} de sponsorisation
                </p>
              </div>
              <p className="text-2xl font-bold text-orange-500">
                {plans.find(p => p.id === planChoisi)?.prix.toLocaleString('fr-FR')} XOF
              </p>
            </div>

            <button onClick={lancerSponsorisation} disabled={chargement}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {chargement ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Activation en cours...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Sponsoriser maintenant — {plans.find(p => p.id === planChoisi)?.prix.toLocaleString('fr-FR')} XOF
                </>
              )}
            </button>

            <p className="text-center text-gray-400 text-xs mt-3">
              Mode test — la sponsorisation est activée gratuitement pour les tests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}