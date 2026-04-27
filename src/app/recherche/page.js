'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { Search, MapPin, Home, SlidersHorizontal, X, Eye, Square, Heart } from 'lucide-react';
import PrixDevise from '../../components/PrixDevise';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function RechercheContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { utilisateur } = useAuth();
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [favoris, setFavoris] = useState([]);
  const [filtres, setFiltres] = useState({
    recherche: searchParams.get('recherche') || '',
    ville: searchParams.get('ville') || '',
    categorie: searchParams.get('categorie') || '',
    type_transaction: searchParams.get('type_transaction') || '',
    prix_min: searchParams.get('prix_min') || '',
    prix_max: searchParams.get('prix_max') || '',
    superficie_min: searchParams.get('superficie_min') || '',
    superficie_max: searchParams.get('superficie_max') || '',
    nb_pieces_min: searchParams.get('nb_pieces_min') || '',
  });

  useEffect(() => {
    chercher();
    if (utilisateur) chargerFavoris();
  }, []);

  const chargerFavoris = async () => {
    try {
      const response = await api.get('/favoris/mes-favoris');
      setFavoris((response.data.favoris || []).map(f => f.id));
    } catch (err) {}
  };

  const chercher = async (filtresActuels = filtres) => {
    setChargement(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filtresActuels).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/annonces?${params}`);
      setAnnonces(response.data.annonces || []);
    } catch (err) {
      toast.error('Erreur recherche');
    } finally {
      setChargement(false);
    }
  };

  const appliquerFiltres = (e) => {
    e.preventDefault();
    chercher(filtres);
    setFiltresOuverts(false);
    // Mettre à jour l'URL
    const params = new URLSearchParams();
    Object.entries(filtres).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/recherche?${params}`);
  };

  const reinitialiserFiltres = () => {
    const vides = {
      recherche: '', ville: '', categorie: '',
      type_transaction: '', prix_min: '', prix_max: '',
      superficie_min: '', superficie_max: '', nb_pieces_min: ''
    };
    setFiltres(vides);
    chercher(vides);
  };

  const sauvegarderFiltres = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('filtres_sauvegardes', JSON.stringify(filtres));
      toast.success('Filtres sauvegardés !');
    }
  };

  const chargerFiltresSauvegardes = () => {
    if (typeof window !== 'undefined') {
      const sauvegardes = localStorage.getItem('filtres_sauvegardes');
      if (sauvegardes) {
        const f = JSON.parse(sauvegardes);
        setFiltres(f);
        chercher(f);
        toast.success('Filtres chargés !');
      } else {
        toast.error('Aucun filtre sauvegardé');
      }
    }
  };

  const toggleFavori = async (e, annonceId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!utilisateur) { toast.error('Connectez-vous'); return; }
    try {
      const response = await api.post('/favoris/toggle', { annonce_id: annonceId });
      if (response.data.favori) {
        setFavoris(prev => [...prev, annonceId]);
        toast.success('Ajouté aux favoris ❤️');
      } else {
        setFavoris(prev => prev.filter(id => id !== annonceId));
        toast.success('Retiré des favoris');
      }
    } catch (err) {}
  };

  const nbFiltresActifs = Object.values(filtres).filter(v => v !== '').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Barre de recherche principale */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <form onSubmit={appliquerFiltres} className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2">
              <Search size={18} className="text-gray-400" />
              <input type="text"
                placeholder="Rechercher une annonce..."
                value={filtres.recherche}
                onChange={(e) => setFiltres({...filtres, recherche: e.target.value})}
                className="flex-1 outline-none text-gray-700"
              />
              {filtres.recherche && (
                <button type="button" onClick={() => setFiltres({...filtres, recherche: ''})}
                  className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2">
              <MapPin size={18} className="text-gray-400" />
              <input type="text" placeholder="Ville"
                value={filtres.ville}
                onChange={(e) => setFiltres({...filtres, ville: e.target.value})}
                className="w-32 outline-none text-gray-700"
              />
            </div>

            <button type="button"
              onClick={() => setFiltresOuverts(!filtresOuverts)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium transition ${
                filtresOuverts || nbFiltresActifs > 1
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}>
              <SlidersHorizontal size={18} />
              Filtres
              {nbFiltresActifs > 1 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {nbFiltresActifs}
                </span>
              )}
            </button>

            <button type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
              Rechercher
            </button>
          </form>

          {/* Filtres avancés */}
          {filtresOuverts && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Catégorie</label>
                  <select value={filtres.categorie}
                    onChange={(e) => setFiltres({...filtres, categorie: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm">
                    <option value="">Toutes</option>
                    <option value="maison">Maison</option>
                    <option value="parcelle">Parcelle</option>
                    <option value="hotel">Hôtel</option>
                    <option value="marketplace">Objet</option>
                    <option value="restaurant">Restaurant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select value={filtres.type_transaction}
                    onChange={(e) => setFiltres({...filtres, type_transaction: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm">
                    <option value="">Tous</option>
                    <option value="location">Location</option>
                    <option value="vente">Vente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Prix min (XOF)</label>
                  <input type="number" value={filtres.prix_min}
                    onChange={(e) => setFiltres({...filtres, prix_min: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Prix max (XOF)</label>
                  <input type="number" value={filtres.prix_max}
                    onChange={(e) => setFiltres({...filtres, prix_max: e.target.value})}
                    placeholder="999999999"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Superficie min (m²)</label>
                  <input type="number" value={filtres.superficie_min}
                    onChange={(e) => setFiltres({...filtres, superficie_min: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Superficie max (m²)</label>
                  <input type="number" value={filtres.superficie_max}
                    onChange={(e) => setFiltres({...filtres, superficie_max: e.target.value})}
                    placeholder="9999"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nb pièces min</label>
                  <input type="number" value={filtres.nb_pieces_min}
                    onChange={(e) => setFiltres({...filtres, nb_pieces_min: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={sauvegarderFiltres}
                  className="flex items-center gap-1.5 border border-blue-300 text-blue-600 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                  💾 Sauvegarder
                </button>
                <button type="button" onClick={chargerFiltresSauvegardes}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  📂 Charger
                </button>
                <button type="button" onClick={reinitialiserFiltres}
                  className="flex items-center gap-1.5 border border-red-300 text-red-500 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-red-50 transition">
                  <X size={14} />
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {chargement ? 'Recherche...' : `${annonces.length} résultat${annonces.length > 1 ? 's' : ''}`}
          </h2>
        </div>

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
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Home size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun résultat</h3>
            <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
            <button onClick={reinitialiserFiltres}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <Link key={annonce.id} href={`/annonces/${annonce.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="h-52 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                    {annonce.photo_principale ? (
                      <img src={annonce.photo_principale} alt={annonce.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home size={56} className="text-blue-300" />
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${
                      annonce.type_transaction === 'location'
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {annonce.type_transaction === 'location' ? 'Location' : 'Vente'}
                    </span>
                    <span className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Eye size={12} />
                      {annonce.nb_vues}
                    </span>
                    <button onClick={(e) => toggleFavori(e, annonce.id)}
                      className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition">
                      <Heart size={16} className={
                        favoris.includes(annonce.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-400'
                      } />
                    </button>
                    {annonce.distance && (
                      <span className="absolute bottom-3 left-3 bg-white text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                        📍 {parseFloat(annonce.distance).toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">{annonce.titre}</h3>
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
                    <PrixDevise prix={annonce.prix} />
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

export default function Recherche() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <RechercheContent />
    </Suspense>
  );
}