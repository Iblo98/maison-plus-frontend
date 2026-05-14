'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CreditCard, Shield, CheckCircle, Home, Download, Phone } from 'lucide-react';
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
  const [numeroPaiement, setNumeroPaiement] = useState('');
  const [reference, setReference] = useState('');
  const [etape, setEtape] = useState(1); // 1=choix mode, 2=saisie numéro, 3=confirmation OTP

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

  const passerEtape2 = () => {
    if (!modeSelectionne) {
      toast.error('Choisissez un mode de paiement');
      return;
    }
    setEtape(2);
  };

  const envoyerOTP = () => {
    if (!numeroPaiement || numeroPaiement.length < 8) {
      toast.error('Entrez un numéro valide');
      return;
    }
    toast.success(`Code OTP envoyé au ${numeroPaiement} (simulation)`);
    setEtape(3);
  };

  const lancerPaiement = async () => {
    if (!utilisateur) { router.push('/connexion'); return; }
    setPaiementEnCours(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Appel API pour notifications
      const response = await api.post('/paiements/initier', {
        annonce_id: annonceId,
        vendeur_id: annonce.utilisateur_id
      });

      const ref = `MP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setReference(ref);
      toast.success('🎉 Paiement confirmé !');
      setPaiementReussi(true);
    } catch (erreur) {
      toast.error('Erreur lors du paiement');
    } finally {
      setPaiementEnCours(false);
    }
  };

  const telechargerRecu = () => {
    if (!annonce || !commission) return;

    const contenu = `
REÇU DE PAIEMENT — MAISON+
============================
Référence : ${reference}
Date : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}

ACHETEUR
--------
Nom : ${utilisateur?.prenom} ${utilisateur?.nom}
Email : ${utilisateur?.email}

ANNONCE
-------
Titre : ${annonce.titre}
Ville : ${annonce.quartier ? annonce.quartier + ', ' : ''}${annonce.ville}
Type : ${annonce.type_transaction} — ${annonce.categorie}

PAIEMENT
--------
Mode : ${modeSelectionne}
Numéro : ${numeroPaiement}
Montant total : ${new Intl.NumberFormat('fr-FR').format(commission.prix)} XOF
Commission Maison+ (5%) : ${new Intl.NumberFormat('fr-FR').format(commission.commission)} XOF
Propriétaire reçoit : ${new Intl.NumberFormat('fr-FR').format(commission.montant_vendeur)} XOF

Statut : ✅ PAYÉ (Simulation)

============================
Maison+ — Votre plateforme immobilière au Burkina Faso
    `;

    const blob = new Blob([contenu], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu_${reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Reçu téléchargé !');
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix);

  const modesPaiement = [
    { nom: 'Orange Money', icone: '🟠', prefixe: '07' },
    { nom: 'Moov Money', icone: '🔵', prefixe: '01' },
    { nom: 'Coris Money', icone: '🟢', prefixe: '05' },
    { nom: 'MobiCash', icone: '🟡', prefixe: '06' },
    { nom: 'Carte Visa/Mastercard', icone: '💳', prefixe: null },
  ];

  const modeActif = modesPaiement.find(m => m.nom === modeSelectionne);

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

            {/* Reçu */}
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-green-100">
              <p className="text-green-700 text-sm font-bold mb-3">📋 Récapitulatif :</p>
              <div className="space-y-1.5 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Référence</span>
                  <span className="font-mono font-bold">{reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annonce</span>
                  <span className="font-medium text-right max-w-32 truncate">{annonce?.titre}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode</span>
                  <span className="font-medium">{modeSelectionne}</span>
                </div>
                <div className="flex justify-between">
                  <span>Numéro</span>
                  <span className="font-medium">{numeroPaiement}</span>
                </div>
                <div className="border-t border-green-200 pt-1.5 flex justify-between font-bold">
                  <span>Montant payé</span>
                  <span>{formaterPrix(commission?.prix)} XOF</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Propriétaire reçoit</span>
                  <span>{formaterPrix(commission?.montant_vendeur)} XOF</span>
                </div>
              </div>
            </div>

            {/* Télécharger reçu */}
            <button onClick={telechargerRecu}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition mb-3">
              <Download size={18} />
              Télécharger le reçu
            </button>

            <div className="space-y-2">
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

        {/* Étapes */}
        <div className="flex items-center gap-2 mb-6">
          {['Mode', 'Numéro', 'Confirmation'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                etape > i + 1 ? 'bg-green-500 text-white' :
                etape === i + 1 ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {etape > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${etape === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < 2 && <div className={`flex-1 h-1 rounded ${etape > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`}/>}
            </div>
          ))}
        </div>

        <div className="space-y-4">

          {/* Détails annonce */}
          {annonce && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                  {annonce.photo_principale ? (
                    <img src={annonce.photo_principale} alt={annonce.titre}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home size={24} className="text-blue-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{annonce.titre}</h3>
                  <p className="text-gray-500 text-sm">{annonce.quartier}, {annonce.ville}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-blue-600 font-bold">
                      {formaterPrix(annonce.prix)} XOF
                    </p>
                    <span className="text-xs text-gray-400">Commission 5% incluse</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 1 — Choix mode */}
          {etape === 1 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Choisissez votre mode de paiement</h2>
              <div className="space-y-2 mb-4">
                {modesPaiement.map((mode) => (
                  <button key={mode.nom}
                    onClick={() => setModeSelectionne(mode.nom)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition ${
                      modeSelectionne === mode.nom
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-100 hover:border-blue-200'
                    }`}>
                    <span className="text-2xl">{mode.icone}</span>
                    <span className={`font-medium flex-1 text-left ${
                      modeSelectionne === mode.nom ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {mode.nom}
                    </span>
                    {modeSelectionne === mode.nom && (
                      <span className="text-blue-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={passerEtape2}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Continuer →
              </button>
            </div>
          )}

          {/* Étape 2 — Saisie numéro */}
          {etape === 2 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Entrez votre numéro {modeSelectionne}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Un code OTP vous sera envoyé pour confirmer le paiement
              </p>

              <div className="relative mb-4">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={numeroPaiement}
                  onChange={(e) => setNumeroPaiement(e.target.value)}
                  placeholder={`Ex: ${modeActif?.prefixe || '07'}X XXX XXX`}
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition font-mono text-lg"
                  maxLength={10}
                />
              </div>

              {/* Récapitulatif montant */}
              {commission && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Montant</span>
                    <span className="font-semibold">{formaterPrix(commission.prix)} XOF</span>
                  </div>
                  <div className="flex justify-between text-orange-500">
                    <span>Commission (5%)</span>
                    <span>-{formaterPrix(commission.commission)} XOF</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold border-t border-gray-200 pt-2">
                    <span>Propriétaire reçoit</span>
                    <span>{formaterPrix(commission.montant_vendeur)} XOF</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setEtape(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                  ← Retour
                </button>
                <button onClick={envoyerOTP}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                  Recevoir le code OTP
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 — Confirmation OTP */}
          {etape === 3 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Confirmez le paiement
              </h2>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-4">
                <p className="text-blue-700 text-sm">
                  📱 Un code OTP a été envoyé au <strong>{numeroPaiement}</strong> (simulation)
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 mb-4">
                <p className="text-yellow-700 text-sm text-center font-medium">
                  🧪 Mode démonstration — Aucun vrai paiement
                </p>
              </div>

              {/* Récapitulatif final */}
              {commission && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  <p className="font-bold text-gray-700 mb-2">Récapitulatif final :</p>
                  <div className="flex justify-between text-gray-600">
                    <span>Mode</span>
                    <span className="font-medium">{modeSelectionne}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Numéro</span>
                    <span className="font-mono font-medium">{numeroPaiement}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2">
                    <span>Montant à débiter</span>
                    <span className="text-blue-600">{formaterPrix(commission.prix)} XOF</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setEtape(2)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                  ← Retour
                </button>
                <button onClick={lancerPaiement} disabled={paiementEnCours}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {paiementEnCours ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Confirmer et payer
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Shield size={14} />
            <span>Paiement 100% sécurisé et crypté</span>
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