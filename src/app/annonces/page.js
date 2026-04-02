'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { Search, MapPin, Home, Building, ShoppingBag, UtensilsCrossed, Shield, Eye, Heart, Square, SlidersHorizontal } from 'lucide-react';

export default function Annonces() {
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtres, setFiltres] = useState({
    ville: '', categorie: '', type_transaction: '', prix_min: '', prix_max: ''
  });

  useEffect(() => {
    chargerAnnonces();
  }, []);

  const chargerAnnonces = async () => {
    try {
      setChargement(true);
      const params = new URLSearchParams();
      Object.entries(filtres).forEach(([k, v]) => { if (v) params.append(k, v); });
      const response = await api.get(`/annonces?${params}`);
      setAnnonces(response.data.annonces || []);
    } catch (erreur) {
      console.error('Erreur:', erreur);
    } finally {
      setChargement(false);
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  const categories = [
    { id: '', label: 'Tout' },
    { id: 'maison', label: 'Maisons' },
    { id: 'parcelle', label: 'Parcelles' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'restaurant', label: 'Restaurants' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Toutes les annonces</h1>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Ville..."
              value={filtres.ville}
              onChange={(e) => setFiltres({...filtres, ville: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm"
            />
            <select
              value={filtres.categorie}
              onChange={(e) => setFiltres({...filtres, categorie: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm">
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select
              value={filtres.type_transaction}
              onChange={(e) => setFiltres({...filtres, type_transaction: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm">
              <option value="">Vente & Location</option>
              <option value="location">Location</option>
              <option value="vente">Vente</option>
            </select>
            <input
              type="number"
              placeholder="Prix min..."
              value={filtres.prix_min}
              onChange={(e) => setFiltres({...filtres, prix_min: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm w-32"
            />
            <input
              type="number"
              placeholder="Prix max..."
              value={filtres.prix_max}
              onChange={(e) => setFiltres({...filtres, prix_max: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm w-32"
            />
            <button onClick={chargerAnnonces}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
              <Search size={16} />
              Filtrer
            </button>
          </div>
        </div>

        {/* Résultats */}
        <p className="text-gray-500 text-sm mb-4">{annonces.length} annonce(s) trouvée(s)</p>

        {chargement ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                <div className="h-52 bg-gray-200"/>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"/>
                  <div className="h-4 bg-gray-200 rounded w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        ) : annonces.length === 0 ? (
          <div className="text-center py-16">
            <Home size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune annonce trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <Link key={annonce.id} href={`/annonces/${annonce.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="h-52 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                    {annonce.photo_principale ? (
                      <img src={annonce.photo_principale} alt={annonce.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home size={56} className="text-blue-300" />
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${
                      annonce.type_transaction === 'location' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {annonce.type_transaction === 'location' ? 'Location' : 'Vente'}
                    </span>
                    <span className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Eye size={12} />
                      {annonce.nb_vues}
                    </span>
                    <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow">
                      <Heart size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">{annonce.titre}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
                      <MapPin size={13} />
                      <span>{annonce.ville}</span>
                    </div>
                    {annonce.superficie && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                        <Square size={13} />
                        <span>{annonce.superficie} m²</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-orange-500 font-bold text-lg">{formaterPrix(annonce.prix)}</p>
                      {annonce.est_verifie && <Shield size={16} className="text-green-500" />}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}