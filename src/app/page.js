'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import { Search, MapPin, Home, Building, ShoppingBag, UtensilsCrossed, Shield, Eye, Heart, Square } from 'lucide-react';

export default function Accueil() {
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('');

  useEffect(() => {
    chargerAnnonces();
  }, [categorie]);

  const chargerAnnonces = async () => {
    try {
      setChargement(true);
      const params = new URLSearchParams();
      if (categorie) params.append('categorie', categorie);
      const response = await api.get(`/annonces?${params}`);
      setAnnonces(response.data.annonces || []);
    } catch (erreur) {
      console.error('Erreur:', erreur);
    } finally {
      setChargement(false);
    }
  };

  const categories = [
    { id: '', label: 'Tout', icon: Home },
    { id: 'maison', label: 'Maisons', icon: Home },
    { id: 'parcelle', label: 'Parcelles', icon: Building },
    { id: 'hotel', label: 'Hotels', icon: Building },
    { id: 'marketplace', label: 'Objets', icon: ShoppingBag },
    { id: 'restaurant', label: 'Restaurants', icon: UtensilsCrossed },
  ];

  const formaterPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez votre <span className="text-green-400">bien ideal</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            La plateforme de reference pour l&apos;immobilier au Burkina Faso et partout en Afrique
          </p>
          <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-2xl mx-auto shadow-lg">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une ville, un quartier..."
                className="flex-1 outline-none text-gray-700"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
            <Link href={`/annonces?ville=${recherche}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Rechercher
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">100%</p>
            <p className="text-gray-500 text-sm">Annonces verifiees</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">Gratuit</p>
            <p className="text-gray-500 text-sm">Pour commencer</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">Securise</p>
            <p className="text-gray-500 text-sm">Paiements proteges</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => setCategorie(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  categorie === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border hover:border-blue-600 hover:text-blue-600'
                }`}>
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Annonces */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Annonces recentes</h2>

        {chargement ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                <div className="h-52 bg-gray-200"/>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"/>
                  <div className="h-4 bg-gray-200 rounded w-1/2"/>
                  <div className="h-4 bg-gray-200 rounded w-1/3"/>
                </div>
              </div>
            ))}
          </div>
        ) : annonces.length === 0 ? (
          <div className="text-center py-16">
            <Home size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune annonce disponible</p>
            <Link href="/publier"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Publier la premiere annonce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <Link key={annonce.id} href={`/annonces/${annonce.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 cursor-pointer group">

                  {/* Image */}
                  <div className="h-52 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                    {annonce.photo_principale ? (
                      <img
                        src={annonce.photo_principale}
                        alt={annonce.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home size={56} className="text-blue-300" />
                      </div>
                    )}

                    {/* Badge type */}
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${
                      annonce.type_transaction === 'location'
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {annonce.type_transaction === 'location' ? 'Location' : 'Vente'}
                    </span>

                    {/* Vues */}
                    <span className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Eye size={12} />
                      {annonce.nb_vues}
                    </span>

                    {/* Favori */}
                    <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow hover:bg-red-50 transition">
                      <Heart size={16} className="text-gray-400 hover:text-red-500" />
                    </button>

                    {/* Sponsorise */}
                    {annonce.est_sponsorisee && (
                      <span className="absolute bottom-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                        Sponsorise
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">
                      {annonce.titre}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
                      <MapPin size={13} />
                      <span>{annonce.quartier ? `${annonce.quartier}, ` : ''}{annonce.ville}</span>
                    </div>
                    {annonce.superficie && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                        <Square size={13} />
                        <span>{parseFloat(annonce.superficie).toFixed(0)} m²</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-orange-500 font-bold text-lg">
                        {formaterPrix(annonce.prix)}
                      </p>
                      {annonce.est_verifie && (
                        <Shield size={16} className="text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="text-blue-400" size={24} />
            <span className="text-xl font-bold">Maison<span className="text-green-400">+</span></span>
          </div>
          <p className="text-gray-400 text-sm">
            2026 MaisonPlus - La plateforme immobiliere de confiance au Burkina Faso et en Afrique
          </p>
        </div>
      </footer>
    </div>
  );
}