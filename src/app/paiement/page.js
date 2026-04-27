'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CreditCard, Shield, CheckCircle, Home, Phone } from 'lucide-react';
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

      const pays = utilisateur?.pays || 'BF';
      const commResponse = await api.get(
        `/paiements/commission?prix=${a.prix}&categorie=${a.categorie}&type_transaction=${a.type_transaction}&pays=${pays}`
      );
      setCommission(commResponse.data);
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
      const response = await api.post('/paiements/initier', {
        annonce_id: annonceId,
        vendeur_id: annonce.utilisateur_id
      });

      const data = response.data;

      if (data.url_paiement) {
        window.location.href = data.url_paiement;
      } else {
        toast.success('Paiement initié en mode test !');
        setPaiementReussi(true);
      }
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setPaiementEnCours(false);
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix);

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
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-green-700 text-sm font-medium">Récapitulatif :</p>
              <p className="text-green-600 text-sm">• Annonce : {annonce?.titre}</p>
              <p className="text-green-600 text-sm">• Montant payé : {formaterPrix(annonce?.prix)} {commission?.devise}</p>
              <p className="text-green-600 text-sm">• Propriétaire reçoit : {formaterPrix(commission?.montant_vendeur)} {commission?.devise}</p>
            </div>
            <Link href="/dashboard"
              className="w-full block bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition text-center">
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Paiement sécurisé</h1>

        <div className="grid grid-cols-1 gap-6">

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
                  <p className="text-orange-500 font-bold mt-1">
                    {formaterPrix(annonce.prix)} XOF
                    {annonce.type_transaction === 'location' && ' /mois'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {commission && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif du paiement</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Montant total</span>
                  <span className="font-semibold text-gray-800">
                    {formaterPrix(commission.prix)} {commission.devise}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Commission Maison+</span>
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
                  Paiement sécurisé via {commission.zone <= 2 ? 'CinetPay' : 'Flutterwave'}
                </p>
              </div>
            </div>
          )}

          {commission && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Mode de paiement</h2>
              {commission?.zone <= 2 ? (
                <div className="space-y-3">
                  {[
                    { nom: 'Orange Money', icone: '📱' },
                    { nom: 'Moov Money', icone: '📱' },
                    { nom: 'Coris Money', icone: '📱' },
                    { nom: 'MobiCash', icone: '📱' },
                    { nom: 'Carte Visa/Mastercard', icone: '💳' },
                  ].map((mode) => (
                    <div key={mode.nom}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition">
                      <span className="text-xl">{mode.icone}</span>
                      <span className="text-gray-700 font-medium">{mode.nom}</span>
                      <span className="ml-auto text-xs text-gray-400">via CinetPay</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { nom: 'Carte Visa/Mastercard', icone: '💳' },
                    { nom: 'PayPal', icone: '🅿️' },
                    { nom: 'MTN Mobile Money', icone: '📱' },
                  ].map((mode) => (
                    <div key={mode.nom}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition">
                      <span className="text-xl">{mode.icone}</span>
                      <span className="text-gray-700 font-medium">{mode.nom}</span>
                      <span className="ml-auto text-xs text-gray-400">via Flutterwave</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-6">
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
                  Payer {commission ? `${formaterPrix(commission.prix)} ${commission.devise}` : ''}
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
