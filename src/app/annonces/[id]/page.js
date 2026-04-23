'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import api from '../../../lib/api';
import { MapPin, Home, Eye, Phone, MessageCircle, Shield, Calendar, Square, DoorOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DetailAnnonce() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (id) chargerAnnonce();
  }, [id]);

  const chargerAnnonce = async () => {
    try {
      const response = await api.get(`/annonces/${id}`);
      setAnnonce(response.data.annonce);
    } catch (erreur) {
      toast.error('Annonce introuvable');
    } finally {
      setChargement(false);
    }
  };

  const formaterPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';
  };

  const formaterDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

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
          <p className="text-gray-500 text-lg">Annonce introuvable</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Image principale */}
        <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden mb-6 relative">
          {annonce.photo_principale ? (
            <img src={annonce.photo_principale} alt={annonce.titre}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home size={80} className="text-blue-300" />
            </div>
          )}
          <span className={`absolute top-4 left-4 text-sm font-bold px-4 py-2 rounded-full ${
            annonce.type_transaction === 'location'
              ? 'bg-blue-600 text-white'
              : 'bg-green-500 text-white'
          }`}>
            {annonce.type_transaction === 'location' ? 'Location' : 'Vente'}
          </span>
          <span className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
            <Eye size={14} />
            {annonce.nb_vues} vues
          </span>
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
              <p className="text-3xl font-bold text-orange-500">
                {formaterPrix(annonce.prix)}
                {annonce.type_transaction === 'location' && (
                  <span className="text-base text-gray-400 font-normal"> /mois</span>
                )}
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 gap-4">
                {annonce.superficie && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Square className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">Superficie</p>
                      <p className="font-semibold">{annonce.superficie} m²</p>
                    </div>
                  </div>
                )}
                {annonce.nb_pieces && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <DoorOpen className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">Pièces</p>
                      <p className="font-semibold">{annonce.nb_pieces} pièces</p>
                    </div>
                  </div>
                )}
                {annonce.disponible_du && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">Disponible dès</p>
                      <p className="font-semibold">{formaterDate(annonce.disponible_du)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Eye className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Vues</p>
                    <p className="font-semibold">{annonce.nb_vues} vues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {annonce.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{annonce.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar contact */}
          <div className="space-y-4">

            {/* Propriétaire */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Propriétaire</h2>
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
                        <span>Compte vérifié</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              <div className="space-y-3">
                <a href={`tel:${annonce.telephone}`}
                  className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition">
                  <Phone size={18} />
                  Appeler
                </a>
                <Link href={`/messages?annonce=${annonce.id}&destinataire=${annonce.utilisateur_id}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                  <MessageCircle size={18} />
                  Envoyer un message
                </Link>
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Localisation</h2>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p>{annonce.adresse_complete || `${annonce.quartier}, ${annonce.ville}`}</p>
              </div>
            </div>

            {/* Date publication */}
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <p className="text-gray-400 text-sm">
                Publié le {formaterDate(annonce.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}