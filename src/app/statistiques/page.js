'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Eye, MessageCircle, Home, CreditCard, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Statistiques() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      chargerStats();
    }
  }, [utilisateur, authChargement]);

  const chargerStats = async () => {
    try {
      const response = await api.get('/profil/statistiques');
      setStats(response.data.statistiques);
    } catch (err) {
      toast.error('Erreur chargement statistiques');
    } finally {
      setChargement(false);
    }
  };

  const COULEURS = ['#2563EB', '#16A34A', '#9333EA', '#F97316', '#EF4444', '#06B6D4'];

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl"/>)}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-72 bg-gray-200 rounded-2xl"/>
            <div className="h-72 bg-gray-200 rounded-2xl"/>
          </div>
        </div>
      </div>
    );
  }

  const totalVues = stats?.vues_par_mois?.reduce((acc, m) => acc + parseInt(m.total_vues || 0), 0) || 0;
  const totalMessages = stats?.messages_par_mois?.reduce((acc, m) => acc + parseInt(m.total_messages || 0), 0) || 0;
  const totalAnnonces = stats?.annonces_par_categorie?.reduce((acc, c) => acc + parseInt(c.total || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-600" />
              Mes statistiques
            </h1>
            <p className="text-gray-500 text-sm">Vue d&apos;ensemble de vos performances</p>
          </div>
        </div>

        {/* Cartes résumé */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total vues', value: totalVues, icon: Eye, color: 'blue' },
            { label: 'Messages reçus', value: totalMessages, icon: MessageCircle, color: 'green' },
            { label: 'Annonces', value: totalAnnonces, icon: Home, color: 'purple' },
            { label: 'Revenus reçus', value: formaterPrix(stats?.revenus?.total_recu || 0), icon: CreditCard, color: 'orange', petit: true },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={20} className={`text-${stat.color}-600`} />
                </div>
                <p className={`font-bold text-gray-800 mb-1 ${stat.petit ? 'text-lg' : 'text-2xl'}`}>
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Vues par mois */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Vues par mois</h2>
            {stats?.vues_par_mois?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats.vues_par_mois}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="total_vues" stroke="#2563EB"
                    fill="#EFF6FF" strokeWidth={2} name="Vues" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">
                Pas encore de données
              </div>
            )}
          </div>

          {/* Messages par mois */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Messages reçus par mois</h2>
            {stats?.messages_par_mois?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.messages_par_mois}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total_messages" fill="#16A34A" radius={[6, 6, 0, 0]} name="Messages" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">
                Pas encore de données
              </div>
            )}
          </div>

          {/* Annonces par catégorie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Annonces par catégorie</h2>
            {stats?.annonces_par_categorie?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.annonces_par_categorie}
                    dataKey="total"
                    nameKey="categorie"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ categorie, total }) => `${categorie} (${total})`}
                  >
                    {stats.annonces_par_categorie.map((_, index) => (
                      <Cell key={index} fill={COULEURS[index % COULEURS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">
                Pas encore de données
              </div>
            )}
          </div>

          {/* Statut des annonces */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Statut des annonces</h2>
            {stats?.annonces_par_statut?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.annonces_par_statut} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="statut" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]} name="Annonces">
                    {stats.annonces_par_statut.map((entry, index) => (
                      <Cell key={index} fill={
                        entry.statut === 'publiee' ? '#16A34A' :
                        entry.statut === 'vendu' ? '#2563EB' :
                        entry.statut === 'loue' ? '#9333EA' :
                        entry.statut === 'rejetee' ? '#EF4444' :
                        '#F97316'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">
                Pas encore de données
              </div>
            )}
          </div>
        </div>

        {/* Top annonces */}
        {stats?.top_annonces?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              🏆 Top 5 annonces les plus vues
            </h2>
            <div className="space-y-3">
              {stats.top_annonces.map((annonce, index) => (
                <div key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      index === 0 ? 'bg-yellow-400' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-400' :
                      'bg-blue-200 text-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{annonce.titre}</p>
                      <p className="text-gray-400 text-xs">{annonce.categorie} —{' '}
                        {new Intl.NumberFormat('fr-FR').format(annonce.prix)} XOF
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-bold">
                    <Eye size={14} />
                    {annonce.nb_vues}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
