'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { MapPin, Home, Eye, Shield, MessageCircle, Star, Calendar, Building, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilPublic() {
  const { id } = useParams();
  const { utilisateur } = useAuth();
  const router = useRouter();
  const [profil, setProfil] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (id) chargerProfil();
  }, [id]);

  const chargerProfil = async () => {
    try {
      const response = await api.get(`/profil/public/${id}`);
      setProfil(response.data.profil);
      setAnnonces(response.data.annonces || []);
    } catch (erreur) {
      toast.error('Profil introuvable');
      router.push('/');
    } finally {
      setChargement(false);
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric'
  });

  const getCategorieIcone = (categorie) => {
    switch (categorie) {
      case 'maison': return <Home size={14} />;
      case 'parcelle': return <Building size={14} />;
      case 'marketplace': return <ShoppingBag size={14} />;
      default: return <Home size={14} />;
    }
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl mb-6"/>
          <div className="h-64 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  if (!profil) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Carte profil */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">

          {/* Photo de couverture */}
          <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
            {profil.photo_couverture && (
              <img src={profil.photo_couverture} alt="Couverture"
                className="w-full h-full object-cover" />
            )}
          </div>

          {/* Infos profil */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">

              {/* Photo de profil */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 overflow-hidden shadow-md">
                {profil.photo_profil_url ? (
                  <img src={profil.photo_profil_url} alt="Profil"
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-3xl">
                      {profil.prenom?.[0]}{profil.nom?.[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Bouton contacter */}
              {utilisateur && utilisateur.id !== id && (
                <div className="mt-14">
                  <Link
                    href={`/messages?destinataire=${id}&annonce=${annonces[0]?.id || ''}`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition">
                    <MessageCircle size={18} />
                    Contacter
                  </Link>
                </div>
              )}
            </div>

            {/* Nom et badges */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-800">
                    {profil.prenom} {profil.nom}
                  </h1>
                  {profil.est_verifie && (
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      <Shield size={12} />
                      Vérifié
                    </div>
                  )}
                  {profil.type_compte === 'professionnel' && (
                    <div className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      Pro
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar size={14} />
                  <span>Membre depuis {formaterDate(profil.created_at)}</span>
                </div>
              </div>

              {/* Stats rapides */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{annonces.length}</p>
                  <p className="text-xs text-gray-400">Annonces</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">
                    {annonces.reduce((acc, a) => acc + (a.nb_vues || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-400">Vues totales</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Annonces du profil */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Annonces de {profil.prenom} ({annonces.length})
          </h2>

          {annonces.length === 0 ? (
            <div className="text-center py-12">
              <Home size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">Aucune annonce publiée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {annonces.map((annonce) => (
                <Link key={annonce.id} href={`/annonces/${annonce.id}`}>
                  <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition cursor-pointer">

                    {/* Image */}
                    <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
                      {annonce.photo_principale ? (
                        <img src={annonce.photo_principale} alt={annonce.titre}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home size={40} className="text-blue-200" />
                        </div>
                      )}
                      <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${
                        annonce.type_transaction === 'location'
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {annonce.type_transaction === 'location' ? 'Location' : 'Vente'}
                      </span>
                    </div>

                    {/* Infos */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                        {annonce.titre}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                        <MapPin size={11} />
                        <span>{annonce.ville}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-orange-500 font-bold text-sm">
                          {formaterPrix(annonce.prix)}
                        </p>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Eye size={11} />
                          <span>{annonce.nb_vues}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}