'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useLangue } from '../../../context/LangueContext';
import { MapPin, Home, Eye, Phone, MessageCircle, Shield, Calendar, Square, DoorOpen, CreditCard, ChevronLeft, ChevronRight, X, Play, Image, FileText, Download } from 'lucide-react';
import PrixDevise from '../../../components/PrixDevise';
import toast from 'react-hot-toast';

export default function DetailAnnonce() {
  const { id } = useParams();
  const { utilisateur } = useAuth();
  const { t } = useLangue();
  const [annonce, setAnnonce] = useState(null);
  const [medias, setMedias] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [photoActive, setPhotoActive] = useState(0);
  const [lightboxOuvert, setLightboxOuvert] = useState(false);
  const [ongletMedia, setOngletMedia] = useState('photos');

  useEffect(() => {
    if (id) chargerAnnonce();
  }, [id]);

  const chargerAnnonce = async () => {
    try {
      const [annonceRes, mediasRes, documentsRes] = await Promise.all([
        api.get(`/annonces/${id}`),
        api.get(`/medias/${id}`),
        api.get(`/documents/annonce/${id}`)
      ]);
      setAnnonce(annonceRes.data.annonce);
      setMedias(mediasRes.data.medias || []);
      setDocuments(documentsRes.data.documents || []);
    } catch (erreur) {
      toast.error(t('errors.annonce_introuvable'));
    } finally {
      setChargement(false);
    }
  };

  const photos = medias.filter(m => m.type_media === 'photo');
  const videos = medias.filter(m => m.type_media === 'video');

  const photoSuivante = () => setPhotoActive((prev) => (prev + 1) % photos.length);
  const photoPrecedente = () => setPhotoActive((prev) => (prev - 1 + photos.length) % photos.length);

  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-80 bg-gray-200 rounded-2xl mb-6"/>
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"/>
          <div className="h-4 bg-gray-200 rounded w-1/3"/>
        </div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">{t('errors.annonce_introuvable')}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            {t('errors.retour_accueil')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Galerie principale */}
        <div className="mb-6">
          <div className="relative h-80 md:h-96 bg-gray-200 rounded-2xl overflow-hidden mb-2 cursor-pointer"
            onClick={() => setLightboxOuvert(true)}>
            {photos.length > 0 ? (
              <img src={photos[photoActive]?.url} alt={annonce.titre}
                className="w-full h-full object-cover" />
            ) : annonce.photo_principale ? (
              <img src={annonce.photo_principale} alt={annonce.titre}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home size={80} className="text-gray-300" />
              </div>
            )}

            <span className={`absolute top-4 left-4 text-sm font-bold px-4 py-2 rounded-full ${
              annonce.type_transaction === 'location' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'
            }`}>
              {annonce.type_transaction === 'location' ? t('annonce.location') : t('annonce.vente')}
            </span>

            <span className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Eye size={14} />
              {annonce.nb_vues} {t('annonce.vues')}
            </span>

            {photos.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">
                {photoActive + 1} / {photos.length}
              </div>
            )}

            {photos.length > 0 && (
              <button className="absolute bottom-4 left-4 bg-white text-gray-800 text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition">
                <Image size={14} />
                {t('annonce.photos')} ({photos.length})
              </button>
            )}

            {photos.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); photoPrecedente(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition shadow">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); photoSuivante(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition shadow">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {(photos.length > 1 || videos.length > 0) && (
            <div>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setOngletMedia('photos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    ongletMedia === 'photos' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
                  }`}>
                  <Image size={14} />
                  {t('annonce.photos')} ({photos.length})
                </button>
                {videos.length > 0 && (
                  <button onClick={() => setOngletMedia('videos')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      ongletMedia === 'videos' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
                    }`}>
                    <Play size={14} />
                    {t('annonce.videos')} ({videos.length})
                  </button>
                )}
              </div>

              {ongletMedia === 'photos' && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((photo, index) => (
                    <button key={photo.id} onClick={() => setPhotoActive(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition ${
                        photoActive === index ? 'border-blue-600' : 'border-transparent'
                      }`}>
                      <img src={photo.url} alt={`${t('annonce.photos')} ${index + 1}`}
                        className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {ongletMedia === 'videos' && videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="rounded-xl overflow-hidden bg-black">
                      <video controls className="w-full h-48 object-cover">
                        <source src={video.url} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Infos principales */}
          <div className="lg:col-span-2 space-y-6">

            {/* Titre et prix */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{annonce.titre}</h1>
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin size={16} />
                <span>{annonce.quartier}, {annonce.ville}</span>
              </div>
              <div className="flex items-end gap-3">
                <PrixDevise prix={annonce.prix} className="text-3xl" />
                {annonce.type_transaction === 'location' && (
                  <span className="text-base text-gray-400 font-normal mb-1">
                    /{annonce.periode || 'mois'}
                  </span>
                )}
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t('annonce.caracteristiques')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {annonce.superficie && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Square className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">{t('annonce.superficie')}</p>
                      <p className="font-semibold">{annonce.superficie} m²</p>
                    </div>
                  </div>
                )}
                {annonce.nb_pieces && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <DoorOpen className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">{t('annonce.pieces')}</p>
                      <p className="font-semibold">{annonce.nb_pieces} {t('annonce.pieces').toLowerCase()}</p>
                    </div>
                  </div>
                )}
                {annonce.disponible_du && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">{t('annonce.disponible')}</p>
                      <p className="font-semibold">{formaterDate(annonce.disponible_du)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Eye className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">{t('annonce.vues')}</p>
                    <p className="font-semibold">{annonce.nb_vues} {t('annonce.vues')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {annonce.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-3">{t('annonce.description')}</h2>
                <p className="text-gray-600 leading-relaxed">{annonce.description}</p>
              </div>
            )}

            {/* Documents officiels */}
            {documents.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  Documents officiels
                </h2>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FileText size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{doc.nom}</p>
                          <p className="text-gray-400 text-xs capitalize">
                            {doc.type_document?.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition">
                        <Download size={14} />
                        Voir
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar contact */}
          <div className="space-y-4">

            {/* Propriétaire */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t('annonce.proprietaire')}</h2>
              <Link href={`/profil/${annonce.utilisateur_id}`}>
                <div className="flex items-center gap-3 mb-4 hover:opacity-80 transition">
                  <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                    {annonce.photo_profil ? (
                      <img src={annonce.photo_profil} alt="Profil"
                        className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-blue-600 font-bold text-lg">
                        {annonce.prenom?.[0]}{annonce.nom?.[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 hover:text-blue-600 transition">
                      {annonce.prenom} {annonce.nom}
                    </p>
                    {annonce.est_verifie && (
                      <div className="flex items-center gap-1 text-green-500 text-sm">
                        <Shield size={12} />
                        <span>{t('annonce.contact_verifie')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              <div className="space-y-3">
                {utilisateur && utilisateur.id !== annonce.utilisateur_id && (
                  <Link href={`/paiement?annonce=${annonce.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition">
                    <CreditCard size={18} />
                    {t('annonce.payer')}
                  </Link>
                )}
                <a href={`tel:${annonce.telephone}`}
                  className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition">
                  <Phone size={18} />
                  {t('annonce.appeler')}
                </a>
                <Link href={`/messages?annonce=${annonce.id}&destinataire=${annonce.utilisateur_id}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                  <MessageCircle size={18} />
                  {t('annonce.envoyer_message')}
                </Link>
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-3">{t('annonce.localisation')}</h2>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p>{annonce.adresse_complete || `${annonce.quartier}, ${annonce.ville}`}</p>
              </div>
            </div>

            {/* Date publication */}
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <p className="text-gray-400 text-sm">
                {t('annonce.publie_le')} {formaterDate(annonce.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOuvert && photos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setLightboxOuvert(false)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10">
            <X size={24} />
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {photoActive + 1} / {photos.length}
          </div>
          <div className="max-w-5xl max-h-screen p-8 w-full" onClick={(e) => e.stopPropagation()}>
            <img src={photos[photoActive]?.url} alt=""
              className="max-w-full max-h-screen object-contain mx-auto rounded-lg shadow-2xl" />
          </div>
          {photos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); photoPrecedente(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition">
                <ChevronLeft size={28} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); photoSuivante(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition">
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-lg">
            {photos.map((photo, index) => (
              <button key={photo.id}
                onClick={(e) => { e.stopPropagation(); setPhotoActive(index); }}
                className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition ${
                  photoActive === index ? 'border-white' : 'border-transparent opacity-60'
                }`}>
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}