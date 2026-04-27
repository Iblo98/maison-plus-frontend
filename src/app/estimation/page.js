'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { Brain, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EstimationPrix() {
  const [form, setForm] = useState({
    categorie: 'maison',
    type_transaction: 'location',
    ville: '',
    quartier: '',
    superficie: '',
    nb_pieces: ''
  });
  const [estimation, setEstimation] = useState(null);
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const estimer = async (e) => {
    e.preventDefault();
    if (!form.ville) { toast.error('Entrez une ville'); return; }
    setChargement(true);
    try {
      const response = await api.post('/estimation-prix', form);
      setEstimation(response.data);
    } catch (err) {
      toast.error('Erreur estimation');
    } finally {
      setChargement(false);
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  const getCouleurConfiance = (confiance) => {
    if (confiance === 'élevée') return 'text-green-600 bg-green-50 border-green-200';
    if (confiance === 'moyenne') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain size={32} className="text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Estimation de prix IA</h1>
          <p className="text-gray-500">
            Notre IA analyse les annonces similaires pour estimer le juste prix de votre bien
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Décrivez votre bien</h2>
          <form onSubmit={estimer} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select name="categorie" value={form.categorie} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition">
                  <option value="maison">Maison</option>
                  <option value="parcelle">Parcelle</option>
                  <option value="hotel">Hôtel</option>
                  <option value="marketplace">Objet</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type_transaction" value={form.type_transaction} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition">
                  <option value="location">Location</option>
                  <option value="vente">Vente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input type="text" name="ville" value={form.ville}
                  onChange={handleChange} placeholder="Ex: Ouagadougou"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                <input type="text" name="quartier" value={form.quartier}
                  onChange={handleChange} placeholder="Ex: Ouaga 2000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
                <input type="number" name="superficie" value={form.superficie}
                  onChange={handleChange} placeholder="Ex: 200"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nb pièces</label>
                <input type="number" name="nb_pieces" value={form.nb_pieces}
                  onChange={handleChange} placeholder="Ex: 4"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button type="submit" disabled={chargement}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {chargement ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Brain size={20} />
                  Estimer le prix
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résultat */}
        {estimation && (
          <div className="space-y-4">
            {estimation.estimation ? (
              <>
                {/* Prix estimé */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm mb-1">Prix estimé par l&apos;IA</p>
                    <p className="text-4xl font-black text-purple-600">
                      {formaterPrix(estimation.estimation.prix_estime)}
                    </p>
                    {form.type_transaction === 'location' && (
                      <p className="text-gray-400 text-sm">/mois</p>
                    )}
                  </div>

                  {/* Fourchette */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Prix minimum</p>
                      <p className="font-bold text-green-600">
                        {formaterPrix(estimation.estimation.prix_min)}
                      </p>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-100 rounded-full relative">
                        <div className="absolute inset-y-0 left-[15%] right-[15%] bg-gradient-to-r from-green-400 via-purple-500 to-red-400 rounded-full"/>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow"/>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Prix maximum</p>
                      <p className="font-bold text-red-500">
                        {formaterPrix(estimation.estimation.prix_max)}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Prix médian</p>
                      <p className="font-bold text-gray-800 text-sm">
                        {formaterPrix(estimation.estimation.prix_median)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Annonces analysées</p>
                      <p className="font-bold text-gray-800 text-sm">
                        {estimation.estimation.nb_annonces_analysees}
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 text-center border ${getCouleurConfiance(estimation.estimation.confiance)}`}>
                      <p className="text-xs opacity-75">Confiance</p>
                      <p className="font-bold text-sm capitalize">
                        {estimation.estimation.confiance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conseils */}
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-2">💡 Conseils pour bien fixer votre prix</h3>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Fixez un prix dans la fourchette recommandée pour plus de chances</li>
                    <li>• Un prix légèrement en dessous du marché génère plus de contacts</li>
                    <li>• Mentionnez les équipements supplémentaires pour justifier un prix plus élevé</li>
                    <li>• Sponsorisez votre annonce pour plus de visibilité</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Pas assez de données</h3>
                <p className="text-gray-500">
                  {estimation.message}. Essayez avec une ville plus grande ou une catégorie différente.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}