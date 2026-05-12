'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CreditCard, Shield, CheckCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function PaiementContent() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [annonce, setAnnonce] = useState(null);
  const [commission, setCommission] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [paiementEnCours, setPaiementEnCours] = useState(false);
  const [paiementReussi, setPaiementReussi] = useState(false);
  const [modeSelectionne, setModeSelectionne] = useState('Orange Money');

  const annonceId = searchParams.get('annonce');

  useEffect(() => {
    if (!utilisateur) { router.push('/connexion'); return; }
    if (annonceId) chargerAnnonce();
  }, [utilisateur, annonceId]);

  const chargerAnnonce = async () => {
    try {
      const response = await api.get(`/annonces/${annonceId}`);
      const a = response.data.annonce;
      setAnnonce(a);
      // Commission simulée 5%
      setCommission({
        prix: parseFloat(a.prix),
        commission: Math.round(parseFloat(a.prix) * 0.05),
        montant_vendeur: Math.round(parseFloat(a.prix) * 0.95),
        devise: 'XOF',
        zone: 1
      });
    } catch (erreur) {
      toast.error('Erreur chargement annonce');
    } finally {
      setChargement(false);
    }
  };

  const lancerPaiement = async () => {
    if (!utilisateur) { router.push('/connexion'); return; }
    setPaiementEnCours(true);
    try {
      // Simulation paiement — 2 secondes de délai
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Paiement simulé avec succès ! 🎉');
      setPaiementReussi(true);
    } catch (erreur) {
      toast.error('Erreur lors du paiement');
    } finally {
      setPaiementEnCours(false);
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix);

  const modesPaiement = [
    { nom: 'Orange Money', icone: '📱' },
    { nom: 'Moov Money', icone: '📱' },
    { nom: 'Coris Money', icone: '📱' },
    { nom: 'MobiCash', icone: '📱' },
    { nom: 'Carte Visa/Mastercard', icone: '💳' },
  ];

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-64 bg-gray-200 rounded-2xl mb-4"/>
          <div className="h-48 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  if (paiementReussi) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h1>
            <p className="text-gray-500 mb-6">
              Votre paiement a été confirmé. Le propriétaire a été notifié.
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left space-y-1">
              <p className="text-green-700 text-sm font-medium mb-2">Récapitulatif :</p>
              <p className="text-green-600 text-sm">• Annonce : {annonce?.titre}</p>
              <p className="text-green-600 text-sm">
                • Montant payé : {formaterPrix(commission?.prix)} {commission?.devise}
              </p>
              <p className="text-green-600 text-sm">
                • Mode : {modeSelectionne}
              </p>
              <p className="text-green-600 text-sm">
                • Propriétaire reçoit : {formaterPrix(commission?.montant_vendeur)} {commission?.devise}
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard"
                className="w-full block bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition text-center">
                Retour au dashboard
              </Link>
              <Link href="/"
                className="w-full block border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-center">
                Retour à l&apos;accueil
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

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <CreditCard size={24} className="text-blue-600" />
          Paiement sécurisé
        </h1>

        <div className="grid grid-cols-1 gap-6">

          {/* Détails annonce */}
          {annonce && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Détails de l&apos;annonce</h2>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                  {annonce.photo_principale ? (
                    <img src={annonce.photo_principale} alt={annonce.titre}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home size={32} className="text-blue-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{annonce.titre}</h3>
                  <p className="text-gray-500 text-sm">{annonce.quartier}, {annonce.ville}</p>
                  <p className="text-blue-600 font-bold mt-1">
                    {formaterPrix(annonce.prix)} XOF
                    {annonce.type_transaction === 'location' && ` /${annonce.periode || 'mois'}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Récapitulatif paiement */}
          {commission && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Montant total</span>
                  <span className="font-semibold text-gray-800">
                    {formaterPrix(commission.prix)} {commission.devise}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Commission Maison+ (5%)</span>
                  <span className="text-orange-500 font-medium">
                    -{formaterPrix(commission.commission)} {commission.devise}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold text-gray-800">Propriétaire reçoit</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formaterPrix(commission.montant_vendeur)} {commission.devise}
                  </span>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                <Shield size={16} className="text-blue-600 flex-shrink-0" />
                <p className="text-blue-700 text-xs">
                  Paiement sécurisé — Mode démonstration
                </p>
              </div>
            </div>
          )}

          {/* Mode de paiement */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Mode de paiement</h2>
            <div className="space-y-3">
              {modesPaiement.map((mode) => (
                <button key={mode.nom}
                  onClick={() => setModeSelectionne(mode.nom)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition ${
                    modeSelectionne === mode.nom
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-100 hover:border-blue-200'
                  }`}>
                  <span className="text-xl">{mode.icone}</span>
                  <span className={`font-medium ${
                    modeSelectionne === mode.nom ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {mode.nom}
                  </span>
                  {modeSelectionne === mode.nom && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton payer */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 mb-4">
              <p className="text-yellow-700 text-sm text-center font-medium">
                🧪 Mode démonstration — Aucun vrai paiement ne sera effectué
              </p>
            </div>
            <button onClick={lancerPaiement} disabled={paiementEnCours}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-3">
              {paiementEnCours ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CreditCard size={22} />
                  Payer {commission ? `${formaterPrix(commission.prix)} ${commission.devise}` : ''} via {modeSelectionne}
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-sm">
              <Shield size={14} />
              <span>Paiement 100% sécurisé et crypté</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Paiement() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <PaiementContent />
    </Suspense>
  );
}