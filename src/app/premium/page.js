'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Crown, Check, Zap, Building, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Premium() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [abonnement, setAbonnement] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [souscription, setSouscription] = useState(false);

  const plans = [
    {
      id: 'starter',
      nom: 'Starter',
      prix: 5000,
      periode: '/mois',
      icone: Star,
      couleur: 'blue',
      avantages: [
        '10 annonces actives',
        'Badge Pro sur le profil',
        'Statistiques avancées',
        'Support prioritaire'
      ]
    },
    {
      id: 'business',
      nom: 'Business',
      prix: 15000,
      periode: '/mois',
      icone: Zap,
      couleur: 'purple',
      populaire: true,
      avantages: [
        '50 annonces actives',
        'Badge Pro Gold',
        'Statistiques avancées',
        '5 sponsorisations offertes',
        'Support prioritaire 24/7'
      ]
    },
    {
      id: 'enterprise',
      nom: 'Enterprise',
      prix: 40000,
      periode: '/mois',
      icone: Crown,
      couleur: 'yellow',
      avantages: [
        'Annonces illimitées',
        'Badge Pro Platinum',
        'Statistiques avancées',
        '20 sponsorisations offertes',
        'Accès API',
        'Support dédié'
      ]
    }
  ];

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      chargerAbonnement();
    }
  }, [utilisateur, authChargement]);

  const chargerAbonnement = async () => {
    try {
      const response = await api.get('/abonnements/mon-abonnement');
      setAbonnement(response.data);
    } catch (err) {
      console.error('Erreur abonnement:', err);
    } finally {
      setChargement(false);
    }
  };

  const souscrire = async (planId) => {
    setSouscription(planId);
    try {
      const response = await api.post('/abonnements/souscrire', { plan: planId });
      toast.success(response.data.message);
      chargerAbonnement();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    } finally {
      setSouscription(false);
    }
  };

  const annuler = async () => {
    if (!confirm('Annuler votre abonnement ?')) return;
    try {
      await api.post('/abonnements/annuler');
      toast.success('Abonnement annulé');
      chargerAbonnement();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const getBadgePlan = (plan) => {
    const badges = {
      gratuit: { label: 'Gratuit', color: 'bg-gray-100 text-gray-600' },
      starter: { label: 'Pro', color: 'bg-blue-100 text-blue-600' },
      business: { label: 'Pro Gold', color: 'bg-purple-100 text-purple-600' },
      enterprise: { label: 'Pro Platinum', color: 'bg-yellow-100 text-yellow-600' }
    };
    return badges[plan] || badges.gratuit;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Plans Premium Agences</h1>
          <p className="text-gray-500">
            Boostez votre activité immobilière avec nos plans professionnels
          </p>
        </div>

        {/* Abonnement actuel */}
        {!chargement && abonnement && (
          <div className={`rounded-2xl p-6 mb-8 ${
            abonnement.plan_actuel === 'gratuit'
              ? 'bg-gray-100'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${abonnement.plan_actuel === 'gratuit' ? 'text-gray-500' : 'text-blue-100'}`}>
                  Votre plan actuel
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    abonnement.plan_actuel === 'gratuit'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-white bg-opacity-20 text-white'
                  }`}>
                    {getBadgePlan(abonnement.plan_actuel).label}
                  </span>
                  {abonnement.badge_pro && <span>✅</span>}
                </div>
                <p className={`text-sm mt-2 ${abonnement.plan_actuel === 'gratuit' ? 'text-gray-500' : 'text-blue-100'}`}>
                  {abonnement.nb_annonces_actuelles}/{abonnement.nb_annonces_max} annonces utilisées
                </p>
              </div>
              {abonnement.plan_actuel !== 'gratuit' && (
                <button onClick={annuler}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                  Annuler
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icone;
            const estActuel = abonnement?.plan_actuel === plan.id;

            return (
              <div key={plan.id}
                className={`relative bg-white rounded-2xl p-6 shadow-sm ${
                  plan.populaire ? 'ring-2 ring-purple-500 shadow-lg' : ''
                } ${estActuel ? 'ring-2 ring-green-500' : ''}`}>

                {plan.populaire && !estActuel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ Populaire
                  </div>
                )}

                {estActuel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ✅ Plan actuel
                  </div>
                )}

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
                <p className="text-3xl font-black text-gray-800 mb-4">
                  {plan.prix.toLocaleString('fr-FR')}
                  <span className="text-base font-normal text-gray-400"> XOF{plan.periode}</span>
                </p>

                <div className="space-y-2 mb-6">
                  {plan.avantages.map((avantage, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{avantage}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => souscrire(plan.id)}
                  disabled={estActuel || souscription === plan.id}
                  className={`w-full py-3 rounded-xl font-medium transition ${
                    estActuel
                      ? 'bg-green-50 text-green-600 cursor-default'
                      : plan.couleur === 'purple'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : plan.couleur === 'yellow'
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50`}>
                  {souscription === plan.id ? 'Activation...' :
                   estActuel ? '✅ Plan actuel' :
                   'Choisir ce plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Plan gratuit */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <Building size={32} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 mb-1">Plan Gratuit</h3>
          <p className="text-gray-500 text-sm mb-3">
            3 annonces actives • Fonctionnalités de base
          </p>
          {abonnement?.plan_actuel === 'gratuit' && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              ✅ Plan actuel
            </span>
          )}
        </div>
      </div>
    </div>
  );
}