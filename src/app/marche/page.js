'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Home, MapPin, Building, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RapportMarche() {
  const [rapport, setRapport] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [filtres, setFiltres] = useState({
    ville: '',
    categorie: '',
    type_transaction: ''
  });

  useEffect(() => {
    chargerRapport();
  }, []);

  const chargerRapport = async (f = filtres) => {
    setChargement(true);
    try {
      const params = new URLSearchParams();
      if (f.ville) params.append('ville', f.ville);
      if (f.categorie) params.append('categorie', f.categorie);
      if (f.type_transaction) params.append('type_transaction', f.type_transaction);
      const response = await api.get(`/rapport-marche?${params}`);
      setRapport(response.data.rapport);
    } catch (err) {
      toast.error('Erreur chargement rapport');
    } finally {
      setChargement(false);
    }
  };

  const formaterPrix = (prix) => {
    if (!prix) return '—';
    if (prix >= 1000000) return `${(prix/1000000).toFixed(1)}M`;
    if (prix >= 1000) return `${(prix/1000).toFixed(0)}K`;
    return prix.toString();
  };

  const COULEURS = ['#2563EB', '#16A34A', '#9333EA', '#F97316', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <TrendingUp size={32} className="text-blue-600" />
            Rapport de marché
          </h1>
          <p className="text-gray-500">Analyse des prix et tendances du marché immobilier</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <input type="text" placeholder="Ville..."
              value={filtres.ville}
              onChange={(e) => setFiltres({...filtres, ville: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm"
            />
            <select value={filtres.categorie}
              onChange={(e) => setFiltres({...filtres, categorie: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm">
              <option value="">Toutes catégories</option>
              <option value="maison">Maison</option>
              <option value="parcelle">Parcelle</option>
              <option value="hotel">Hôtel</option>
            </select>
            <select value={filtres.type_transaction}
              onChange={(e) => setFiltres({...filtres, type_transaction: e.target.value})}
              className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm">
              <option value="">Tous types</option>
              <option value="location">Location</option>
              <option value="vente">Vente</option>
            </select>
            <button onClick={() => chargerRapport(filtres)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
              <Search size={16} />
              Analyser
            </button>
          </div>
        </div>

        {chargement ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse"/>
            ))}
          </div>
        ) : rapport ? (
          <>
            {/* Stats globales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total annonces', value: rapport.stats_globales?.total_annonces || 0, icon: Home, color: 'blue' },
                { label: 'Annonces actives', value: rapport.stats_globales?.annonces_actives || 0, icon: TrendingUp, color: 'green' },
                { label: 'Villes couvertes', value: rapport.stats_globales?.nb_villes || 0, icon: MapPin, color: 'purple' },
                { label: 'Propriétaires', value: rapport.stats_globales?.nb_proprietaires || 0, icon: Building, color: 'orange' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={20} className={`text-${stat.color}-600`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Prix moyen global */}
            {rapport.stats_globales?.prix_moyen_global && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 mb-6">
                <p className="text-blue-100 text-sm mb-1">Prix moyen du marché</p>
                <p className="text-4xl font-black">
                  {new Intl.NumberFormat('fr-FR').format(rapport.stats_globales.prix_moyen_global)} XOF
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Evolution des prix */}
              {rapport.evolution_prix?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Evolution des prix (12 mois)</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={rapport.evolution_prix}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={formaterPrix} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => new Intl.NumberFormat('fr-FR').format(v) + ' XOF'} />
                      <Line type="monotone" dataKey="prix_moyen" stroke="#2563EB"
                        strokeWidth={2} dot={{ r: 4 }} name="Prix moyen" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Prix par quartier */}
              {rapport.prix_par_quartier?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Prix moyen par quartier</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={rapport.prix_par_quartier.slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tickFormatter={formaterPrix} tick={{ fontSize: 10 }} />
                      <YAxis dataKey="quartier" type="category" tick={{ fontSize: 10 }} width={80} />
                      <Tooltip formatter={(v) => new Intl.NumberFormat('fr-FR').format(v) + ' XOF'} />
                      <Bar dataKey="prix_moyen" radius={[0, 6, 6, 0]} name="Prix moyen">
                        {rapport.prix_par_quartier.slice(0, 8).map((_, index) => (
                          <Cell key={index} fill={COULEURS[index % COULEURS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top quartiers */}
            {rapport.top_quartiers?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  🏆 Top 5 quartiers les plus chers
                </h2>
                <div className="space-y-3">
                  {rapport.top_quartiers.map((q, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          index === 0 ? 'bg-yellow-400' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-400' :
                          'bg-blue-300'
                        }`}>{index + 1}</span>
                        <div>
                          <p className="font-medium text-gray-800">{q.quartier}</p>
                          <p className="text-gray-400 text-xs">{q.ville} — {q.nb_annonces} annonces</p>
                        </div>
                      </div>
                      <p className="font-bold text-blue-600">
                        {new Intl.NumberFormat('fr-FR').format(q.prix_moyen)} XOF
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tableau prix par ville */}
            {rapport.prix_par_ville?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Détail par ville</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-gray-500 font-medium">Ville</th>
                        <th className="text-left py-2 text-gray-500 font-medium">Type</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Annonces</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Prix min</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Prix moyen</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Prix max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rapport.prix_par_ville.map((row, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 font-medium text-gray-800">{row.ville}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.type_transaction === 'location'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-green-50 text-green-600'
                            }`}>
                              {row.type_transaction}
                            </span>
                          </td>
                          <td className="py-2 text-right text-gray-600">{row.nb_annonces}</td>
                          <td className="py-2 text-right text-green-600">
                            {new Intl.NumberFormat('fr-FR').format(row.prix_min)}
                          </td>
                          <td className="py-2 text-right font-bold text-blue-600">
                            {new Intl.NumberFormat('fr-FR').format(row.prix_moyen)}
                          </td>
                          <td className="py-2 text-right text-red-500">
                            {new Intl.NumberFormat('fr-FR').format(row.prix_max)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <TrendingUp size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}