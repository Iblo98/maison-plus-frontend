'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Home, Eye, Plus, Trash2, CheckCircle, Clock, XCircle, Camera, Settings, Star, TrendingUp, Edit, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageCropper from '../../components/ImageCropper';
import Lightbox from '../../components/Lightbox';

export default function Dashboard() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [profil, setProfil] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [uploadingProfil, setUploadingProfil] = useState(false);
  const [uploadingCouverture, setUploadingCouverture] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropType, setCropType] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxTitre, setLightboxTitre] = useState('');
  const [reservationsOuvertes, setReservationsOuvertes] = useState(true);
  const [contreProposition, setContreProposition] = useState({});
  const [showContreProposition, setShowContreProposition] = useState(null);

  useEffect(() => {
    if (!authChargement && !utilisateur) router.push('/connexion');
    if (utilisateur) chargerDonnees();
  }, [utilisateur, authChargement]);

  const chargerDonnees = async () => {
    try {
      const [profilRes, annoncesRes, reservationsRes] = await Promise.all([
        api.get('/profil/moi'),
        api.get('/profil/moi/annonces'),
        api.get('/reservations/recues').catch(() => ({ data: { reservations: [] } }))
      ]);
      setProfil(profilRes.data);
      setAnnonces(annoncesRes.data.annonces || []);
      setReservations(reservationsRes.data.reservations || []);
    } catch (erreur) {
      toast.error('Erreur chargement des données');
    } finally {
      setChargement(false);
    }
  };

  const ouvrirCropProfil = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    const url = URL.createObjectURL(fichier);
    setCropImage(url);
    setCropType('profil');
  };

  const ouvrirCropCouverture = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    const url = URL.createObjectURL(fichier);
    setCropImage(url);
    setCropType('couverture');
  };

  const uploadApresCrop = async (blob) => {
    const endpoint = cropType === 'profil' ? 'photo-profil' : 'photo-couverture';
    const setter = cropType === 'profil' ? setUploadingProfil : setUploadingCouverture;
    setCropImage(null);
    setter(true);
    try {
      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');
      const response = await fetch(`https://maison-plus-backend.onrender.com/api/kyc/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await response.json();
      if (data.succes) {
        toast.success(cropType === 'profil' ? 'Photo de profil mise à jour !' : 'Photo de couverture mise à jour !');
        chargerDonnees();
        if (cropType === 'profil') {
          const user = JSON.parse(localStorage.getItem('utilisateur') || '{}');
          user.photo_profil = data.photo_url;
          localStorage.setItem('utilisateur', JSON.stringify(user));
          window.location.reload();
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Erreur upload photo');
    } finally {
      setter(false);
    }
  };

  const supprimerAnnonce = async (id) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete(`/annonces/${id}`);
      toast.success('Annonce supprimée !');
      setAnnonces(annonces.filter(a => a.id !== id));
    } catch (erreur) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const marquerStatut = async (id, statut) => {
    try {
      await api.put(`/annonces/${id}/statut`, { statut });
      const messages = {
        'loue': '🏠 Annonce marquée comme louée !',
        'vendu': '🔑 Annonce marquée comme vendue !',
        'publiee': '✅ Annonce remise en ligne !'
      };
      toast.success(messages[statut]);
      chargerDonnees();
    } catch (erreur) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const gererReservation = async (reservationId, action, dates = null) => {
    try {
      await api.put(`/reservations/${reservationId}/statut`, {
        statut: action,
        dates_proposees: dates
      });
      const messages = {
        'acceptee': '✅ Réservation acceptée ! Le locataire va être invité à payer.',
        'refusee': '❌ Réservation refusée.',
        'contre_proposition': '📅 Contre-proposition envoyée au locataire !'
      };
      toast.success(messages[action]);
      setShowContreProposition(null);
      setContreProposition({});
      chargerDonnees();
    } catch (erreur) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const getStatutBadge = (statut) => {
    const config = {
      'publiee': { label: 'Publiée', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
      'en_attente': { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
      'rejetee': { label: 'Rejetée', icon: XCircle, color: 'text-red-600 bg-red-50' },
      'vendu': { label: 'Vendu', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
      'loue': { label: 'Loué', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    };
    return config[statut] || { label: statut, icon: Clock, color: 'text-gray-600 bg-gray-50' };
  };

  const getStatutReservation = (statut) => {
    const config = {
      'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
      'acceptee': { label: 'Acceptée', color: 'bg-green-100 text-green-700' },
      'paiement_requis': { label: 'Paiement requis', color: 'bg-blue-100 text-blue-700' },
      'payee': { label: 'Payée', color: 'bg-purple-100 text-purple-700' },
      'confirmee': { label: 'Confirmée', color: 'bg-green-100 text-green-700' },
      'refusee': { label: 'Refusée', color: 'bg-red-100 text-red-700' },
      'contre_proposition': { label: 'Contre-proposition', color: 'bg-orange-100 text-orange-700' },
      'annulee': { label: 'Annulée', color: 'bg-gray-100 text-gray-700' },
    };
    return config[statut] || { label: statut, color: 'bg-gray-100 text-gray-700' };
  };

  const reservationsEnAttente = reservations.filter(r => r.statut === 'en_attente');

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl mb-6"/>
          <div className="h-64 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  const photoCouverture = profil?.profil?.photo_couverture;
  const photoProfil = profil?.profil?.photo_profil_url || utilisateur?.photo_profil;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Carte profil */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
            {photoCouverture && (
              <img src={photoCouverture} alt="Couverture"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => { setLightboxImage(photoCouverture); setLightboxTitre('Photo de couverture'); }}
              />
            )}
            <label className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer hover:bg-opacity-70 transition">
              {uploadingCouverture ? <span>Upload...</span> : (
                <><Camera size={14} /><span>Changer la couverture</span></>
              )}
              <input type="file" accept="image/*" onChange={ouvrirCropCouverture}
                className="hidden" disabled={uploadingCouverture} />
            </label>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 overflow-hidden shadow-md cursor-pointer"
                  onClick={() => { if (photoProfil) { setLightboxImage(photoProfil); setLightboxTitre('Photo de profil'); }}}>
                  {photoProfil ? (
                    <img src={photoProfil} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-3xl">
                        {utilisateur?.prenom?.[0]}{utilisateur?.nom?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-1.5 cursor-pointer hover:bg-gray-700 transition shadow">
                  {uploadingProfil ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  ) : <Camera size={14} />}
                  <input type="file" accept="image/*" onChange={ouvrirCropProfil}
                    className="hidden" disabled={uploadingProfil} />
                </label>
              </div>

              <div className="flex items-center gap-2 mt-14">
                <Link href="/statistiques"
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  <TrendingUp size={16} />
                  Statistiques
                </Link>
                <Link href="/parametres"
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  <Settings size={16} />
                  Paramètres
                </Link>
                <Link href="/publier"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                  <Plus size={16} />
                  Nouvelle annonce
                </Link>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {utilisateur?.prenom} {utilisateur?.nom}
              </h1>
              <p className="text-gray-500 text-sm">{utilisateur?.email}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                utilisateur?.statut === 'actif' || utilisateur?.statut === 'verifie'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-yellow-50 text-yellow-600'
              }`}>
                {utilisateur?.statut === 'actif' ? 'Compte actif'
                  : utilisateur?.statut === 'verifie' ? 'Compte vérifié'
                  : 'En attente de vérification'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {profil?.statistiques && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total annonces', value: profil.statistiques.total_annonces, color: 'blue' },
              { label: 'Annonces actives', value: profil.statistiques.annonces_actives, color: 'green' },
              { label: 'Conclues', value: profil.statistiques.annonces_conclues, color: 'purple' },
              { label: 'Total vues', value: profil.statistiques.total_vues || 0, color: 'orange' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Réservations reçues */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <button
            onClick={() => setReservationsOuvertes(!reservationsOuvertes)}
            className="w-full flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" />
              Réservations reçues
              {reservationsEnAttente.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {reservationsEnAttente.length} nouvelle{reservationsEnAttente.length > 1 ? 's' : ''}
                </span>
              )}
            </h2>
            {reservationsOuvertes ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </button>

          {reservationsOuvertes && (
            <>
              {reservations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Aucune réservation reçue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => {
                    const statutConfig = getStatutReservation(reservation.statut);
                    return (
                      <div key={reservation.id}
                        className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition">

                        {/* Header réservation */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {reservation.prenom_locataire} {reservation.nom_locataire}
                            </p>
                            <p className="text-gray-500 text-sm">{reservation.titre_annonce}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <Calendar size={14} className="text-orange-400" />
                              <span>
                                {formaterDate(reservation.date_debut)} → {formaterDate(reservation.date_fin)}
                              </span>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statutConfig.color}`}>
                            {statutConfig.label}
                          </span>
                        </div>

                        {/* Message locataire */}
                        {reservation.message && (
                          <div className="bg-gray-50 rounded-xl p-3 mb-3 text-sm text-gray-600 italic">
                            "{reservation.message}"
                          </div>
                        )}

                        {/* Actions — uniquement si en attente */}
                        {reservation.statut === 'en_attente' && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => gererReservation(reservation.id, 'acceptee')}
                                className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2">
                                <CheckCircle size={16} />
                                Accepter
                              </button>
                              <button
                                onClick={() => setShowContreProposition(
                                  showContreProposition === reservation.id ? null : reservation.id
                                )}
                                className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2">
                                <Calendar size={16} />
                                Proposer d&apos;autres dates
                              </button>
                              <button
                                onClick={() => gererReservation(reservation.id, 'refusee')}
                                className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-2">
                                <XCircle size={16} />
                                Refuser
                              </button>
                            </div>

                            {/* Formulaire contre-proposition */}
                            {showContreProposition === reservation.id && (
                              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 space-y-3">
                                <p className="text-orange-700 text-sm font-medium">
                                  📅 Proposez de nouvelles dates disponibles
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Date de début</label>
                                    <input type="date"
                                      min={new Date().toISOString().split('T')[0]}
                                      value={contreProposition[reservation.id]?.debut || ''}
                                      onChange={(e) => setContreProposition(prev => ({
                                        ...prev,
                                        [reservation.id]: { ...prev[reservation.id], debut: e.target.value }
                                      }))}
                                      className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Date de fin</label>
                                    <input type="date"
                                      min={contreProposition[reservation.id]?.debut || new Date().toISOString().split('T')[0]}
                                      value={contreProposition[reservation.id]?.fin || ''}
                                      onChange={(e) => setContreProposition(prev => ({
                                        ...prev,
                                        [reservation.id]: { ...prev[reservation.id], fin: e.target.value }
                                      }))}
                                      className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const dates = contreProposition[reservation.id];
                                      if (!dates?.debut || !dates?.fin) {
                                        toast.error('Choisissez les deux dates');
                                        return;
                                      }
                                      gererReservation(reservation.id, 'contre_proposition', dates);
                                    }}
                                    className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition">
                                    Envoyer la proposition
                                  </button>
                                  <button
                                    onClick={() => setShowContreProposition(null)}
                                    className="px-4 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Statut acceptée — en attente de paiement */}
                        {reservation.statut === 'acceptee' && (
                          <div className="bg-green-50 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle size={16} />
                            Acceptée — En attente du paiement du locataire
                          </div>
                        )}

                        {/* Statut payée */}
                        {reservation.statut === 'payee' && (
                          <div className="bg-purple-50 rounded-xl p-3 text-sm text-purple-700 flex items-center gap-2">
                            <CheckCircle size={16} />
                            Paiement reçu — Vous recevrez votre part à la confirmation d&apos;arrivée
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Mes annonces */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mes annonces</h2>

          {annonces.length === 0 ? (
            <div className="text-center py-12">
              <Home size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore d&apos;annonces</p>
              <Link href="/publier"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                Publier une annonce
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {annonces.map((annonce) => {
                const { label, icon: Icon, color } = getStatutBadge(annonce.statut);
                return (
                  <div key={annonce.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                        {annonce.photo_principale ? (
                          <img src={annonce.photo_principale} alt={annonce.titre}
                            className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home size={24} className="text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{annonce.titre}</h3>
                        <p className="text-orange-500 font-medium text-sm">{formaterPrix(annonce.prix)}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${color}`}>
                            <Icon size={10} />
                            {label}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Eye size={10} />
                            {annonce.nb_vues} vues
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/annonces/${annonce.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/annonces/${annonce.id}/modifier`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                        <Edit size={18} />
                      </Link>
                      <Link href={`/sponsoriser?annonce=${annonce.id}`}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition">
                        <Star size={16} />
                      </Link>

                      {annonce.statut === 'publiee' && (
                        <div className="relative group">
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition text-xs font-medium px-3">
                            Marquer
                          </button>
                          <div className="absolute right-0 top-8 bg-white shadow-xl rounded-xl overflow-hidden z-10 hidden group-hover:block w-40 border border-gray-100">
                            <button onClick={() => marquerStatut(annonce.id, 'loue')}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 font-medium flex items-center gap-2">
                              🏠 Loué
                            </button>
                            <button onClick={() => marquerStatut(annonce.id, 'vendu')}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2">
                              🔑 Vendu
                            </button>
                          </div>
                        </div>
                      )}

                      {(annonce.statut === 'loue' || annonce.statut === 'vendu') && (
                        <button onClick={() => marquerStatut(annonce.id, 'publiee')}
                          className="text-xs text-blue-600 hover:underline px-2">
                          Remettre en ligne
                        </button>
                      )}

                      <button onClick={() => supprimerAnnonce(annonce.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {cropImage && (
        <ImageCropper
          image={cropImage}
          aspect={cropType === 'profil' ? 1 : 3}
          titre={cropType === 'profil' ? 'Recadrer la photo de profil' : 'Recadrer la photo de couverture'}
          onCropComplete={uploadApresCrop}
          onCancel={() => setCropImage(null)}
        />
      )}

      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          titre={lightboxTitre}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}