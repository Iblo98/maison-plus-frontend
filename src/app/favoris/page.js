'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Heart, Home, MapPin, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import PrixDevise from '../../components/PrixDevise';

export default function Favoris() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [favoris, setFavoris] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      chargerFavoris();
    }
  }, [utilisateur, authChargement]);

  const chargerFavoris = async () => {
    try {
      const response = await api.get('/favoris/mes-favoris');
      setFavoris(response.data.favoris || []);
    } catch (err) {
      toast.error('Erreur chargement favoris');
    } finally {
      setChargement(false);
    }
  };

  const retirerFavori = async (annonceId) => {
    try {
      await api.post('/favoris/toggle', { annonce_id: annonceId });
      setFavoris(favoris.filter(f => f.id !== annonceId));
      toast.success('Retiré des favoris !');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix);

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart size={24} className="text-red-500 fill-red-500" />
          <h1 className="text-2xl font-bold text-gray-800">Mes favoris</h1>
          <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-0.5 rounded-full">
            {favoris.length}
          </span>
        </div>

        {favoris.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Heart size={64} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Aucun favori</h2>
            <p className="text-gray-500 mb-6">
              Cliquez sur ❤️ sur une annonce pour la sauvegarder ici
            </p>
            <Link href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Explorer les annonces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoris.map((annonce) => (
              <div key={annonce.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="relative h-48">
                  {annonce.photo_principale ? (
                    <img src={annonce.photo_principale} alt={annonce.titre}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Home size={48} className="text-gray-300" />
                    </div>
                  )}
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${
                    annonce.type_transaction === 'location'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {annonce.type_transaction === 'location' ? 'Location' : 'Vente'}
                  </span>
                  <button
                    onClick={() => retirerFavori(annonce.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 truncate">{annonce.titre}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                    <MapPin size={14} />
                    <span>{annonce.quartier}, {annonce.ville}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <PrixDevise prix={annonce.prix} className="text-lg" />
                      {annonce.type_transaction === 'location' && (
                        <span className="text-gray-400 text-xs">/{annonce.periode || 'mois'}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Eye size={12} />
                      {annonce.nb_vues}
                    </div>
                  </div>
                  <Link href={`/annonces/${annonce.id}`}
                    className="mt-3 w-full block text-center bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 transition">
                    Voir l&apos;annonce
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}