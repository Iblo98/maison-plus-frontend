'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CheckCircle, Circle, Upload, CreditCard, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KYC() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const [statut, setStatut] = useState(null);
  const [etapeActive, setEtapeActive] = useState(1);
  const [chargement, setChargement] = useState(false);

  // Formulaires
  const [photoProfil, setPhotoProfil] = useState(null);
  const [cnibRecto, setCnibRecto] = useState(null);
  const [cnibVerso, setCnibVerso] = useState(null);
  const [paiement, setPaiement] = useState({
    mobile_money_numero: '',
    mobile_money_operateur: 'Orange Money'
  });

  useEffect(() => {
    if (!utilisateur) {
      router.push('/connexion');
      return;
    }
    chargerStatut();
  }, [utilisateur]);

  const chargerStatut = async () => {
    try {
      const response = await api.get('/kyc/statut');
      setStatut(response.data);
      if (response.data.etapes.email_verifie && !response.data.etapes.photo_profil) {
        setEtapeActive(2);
      } else if (response.data.etapes.photo_profil && !response.data.etapes.cnib_soumise) {
        setEtapeActive(3);
      } else if (response.data.etapes.cnib_soumise && !response.data.etapes.paiement_configure) {
        setEtapeActive(4);
      }
    } catch (erreur) {
      console.error('Erreur chargement statut KYC:', erreur);
    }
  };

  const uploadPhotoProfil = async () => {
    if (!photoProfil) {
      toast.error('Sélectionnez une photo de profil');
      return;
    }
    setChargement(true);
    try {
      const formData = new FormData();
      formData.append('photo', photoProfil);
      const response = await fetch('https://maison-plus-backend.onrender.com/api/kyc/photo-profil', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.succes) {
        toast.success('Photo de profil uploadée !');
        setEtapeActive(3);
        chargerStatut();
      } else {
        toast.error(data.message);
      }
    } catch (erreur) {
      toast.error('Erreur upload photo');
    } finally {
      setChargement(false);
    }
  };

  const uploadCNIB = async () => {
    if (!cnibRecto || !cnibVerso) {
      toast.error('Les deux faces de la pièce d\'identité sont obligatoires');
      return;
    }
    setChargement(true);
    try {
      const formData = new FormData();
      formData.append('recto', cnibRecto);
      formData.append('verso', cnibVerso);
      const response = await fetch('https://maison-plus-backend.onrender.com/api/kyc/cnib', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.succes) {
        toast.success('Documents soumis avec succès !');
        setEtapeActive(4);
        chargerStatut();
      } else {
        toast.error(data.message);
      }
    } catch (erreur) {
      toast.error('Erreur upload documents');
    } finally {
      setChargement(false);
    }
  };

  const enregistrerPaiement = async () => {
    if (!paiement.mobile_money_numero) {
      toast.error('Numéro Mobile Money obligatoire');
      return;
    }
    setChargement(true);
    try {
      await api.post('/kyc/paiement', paiement);
      toast.success('Informations de paiement enregistrées !');
      chargerStatut();
      router.push('/dashboard');
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur');
    } finally {
      setChargement(false);
    }
  };

  const etapes = [
    { id: 1, label: 'Email vérifié', icon: Shield },
    { id: 2, label: 'Photo de profil', icon: User },
    { id: 3, label: 'Pièce d\'identité', icon: Upload },
    { id: 4, label: 'Paiement Mobile', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Vérification de compte
        </h1>
        <p className="text-gray-500 mb-8">
          Complétez votre profil pour publier des annonces sur Maison+
        </p>

        {/* Progression */}
        {statut && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progression</span>
              <span className="text-sm font-bold text-blue-600">{statut.pourcentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${statut.pourcentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Étapes */}
        <div className="flex justify-between mb-8">
          {etapes.map((etape) => {
            const Icon = etape.icon;
            const fait = statut?.etapes && (
              (etape.id === 1 && statut.etapes.email_verifie) ||
              (etape.id === 2 && statut.etapes.photo_profil) ||
              (etape.id === 3 && statut.etapes.cnib_soumise) ||
              (etape.id === 4 && statut.etapes.paiement_configure)
            );
            return (
              <div key={etape.id} className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  fait ? 'bg-green-500' : etapeActive === etape.id ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {fait
                    ? <CheckCircle size={20} className="text-white" />
                    : <Icon size={20} className={etapeActive === etape.id ? 'text-white' : 'text-gray-400'} />
                  }
                </div>
                <span className="text-xs text-gray-500 text-center max-w-16">{etape.label}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* Étape 1 — Email */}
          {etapeActive === 1 && (
            <div className="text-center py-6">
              <Shield size={48} className="text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Vérifiez votre email
              </h2>
              <p className="text-gray-500 mb-6">
                Un email de vérification a été envoyé à votre adresse. Cliquez sur le lien dans l&apos;email pour continuer.
              </p>
              <p className="text-gray-400 text-sm">
                Vérifiez aussi vos spams si vous ne trouvez pas l&apos;email.
              </p>
            </div>
          )}

          {/* Étape 2 — Photo profil */}
          {etapeActive === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Photo de profil</h2>
              <p className="text-gray-500 text-sm">
                Ajoutez une photo claire de votre visage. Elle sera visible sur vos annonces.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
                {photoProfil ? (
                  <div>
                    <img
                      src={URL.createObjectURL(photoProfil)}
                      alt="Aperçu"
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    />
                    <p className="text-green-600 font-medium">{photoProfil.name}</p>
                  </div>
                ) : (
                  <div>
                    <User size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Cliquez pour sélectionner une photo</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoProfil(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <button onClick={uploadPhotoProfil} disabled={chargement || !photoProfil}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {chargement ? 'Upload...' : 'Continuer'}
              </button>
            </div>
          )}

          {/* Étape 3 — CNIB */}
          {etapeActive === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Pièce d&apos;identité</h2>
              <p className="text-gray-500 text-sm">
                Photographiez votre CNIB ou passeport (recto et verso). Les documents sont chiffrés et sécurisés.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recto (face avant)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
                  {cnibRecto ? (
                    <p className="text-green-600 font-medium">{cnibRecto.name}</p>
                  ) : (
                    <p className="text-gray-400">Sélectionner le recto</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCnibRecto(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verso (face arrière)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
                  {cnibVerso ? (
                    <p className="text-green-600 font-medium">{cnibVerso.name}</p>
                  ) : (
                    <p className="text-gray-400">Sélectionner le verso</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCnibVerso(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              <button onClick={uploadCNIB} disabled={chargement || !cnibRecto || !cnibVerso}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {chargement ? 'Envoi...' : 'Soumettre les documents'}
              </button>
            </div>
          )}

          {/* Étape 4 — Paiement */}
          {etapeActive === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Informations de paiement</h2>
              <p className="text-gray-500 text-sm">
                Ajoutez votre Mobile Money pour recevoir des paiements. Vous pourrez modifier ces informations dans vos paramètres.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opérateur</label>
                <select
                  value={paiement.mobile_money_operateur}
                  onChange={(e) => setPaiement({...paiement, mobile_money_operateur: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition">
                  <option>Orange Money</option>
                  <option>MobiCash</option>
                  <option>Telecel Money</option>
                  <option>Coris Money</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro Mobile Money
                </label>
                <input
                  type="tel"
                  value={paiement.mobile_money_numero}
                  onChange={(e) => setPaiement({...paiement, mobile_money_numero: e.target.value})}
                  placeholder="Ex: 70000000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <p className="text-gray-400 text-xs">
                Ces informations sont privées et chiffrées. Elles ne seront jamais partagées avec d&apos;autres utilisateurs.
              </p>

              <button onClick={enregistrerPaiement} disabled={chargement || !paiement.mobile_money_numero}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50">
                {chargement ? 'Enregistrement...' : 'Terminer la vérification'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
