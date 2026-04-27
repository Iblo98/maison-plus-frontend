'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  Users, Home, CreditCard, AlertTriangle,
  Search, CheckCircle, XCircle, Eye,
  TrendingUp, FileText, Shield, User
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [onglet, setOnglet] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [dossierSelectionne, setDossierSelectionne] = useState(null);

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      if (utilisateur.type_compte !== 'admin') {
        router.push('/');
        toast.error('Accès réservé aux administrateurs');
        return;
      }
      chargerDashboard();
    }
  }, [utilisateur, authChargement]);

  const chargerDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Erreur dashboard:', err);
    } finally {
      setChargement(false);
    }
  };

  const chargerUtilisateurs = async () => {
    try {
      const response = await api.get('/admin/utilisateurs');
      setUtilisateurs(response.data.utilisateurs || []);
    } catch (err) {
      console.error('Erreur utilisateurs:', err);
    }
  };

  const chargerAnnonces = async () => {
    try {
      const response = await api.get('/admin/annonces');
      setAnnonces(response.data.annonces || []);
    } catch (err) {
      console.error('Erreur annonces:', err);
    }
  };

  const chargerPaiements = async () => {
    try {
      const response = await api.get('/paiements/historique');
      setPaiements(response.data.paiements || []);
    } catch (err) {
      console.error('Erreur paiements:', err);
    }
  };

  const changerOnglet = (o) => {
    setOnglet(o);
    setDossierSelectionne(null);
    setRecherche('');
    if (o === 'utilisateurs') chargerUtilisateurs();
    if (o === 'annonces') chargerAnnonces();
    if (o === 'paiements') chargerPaiements();
    if (o === 'dossiers') chargerUtilisateurs();
  };

  const modererUtilisateur = async (id, statut) => {
    try {
      await api.put(`/admin/utilisateurs/${id}/moderer`, { statut });
      toast.success('Utilisateur mis à jour !');
      chargerUtilisateurs();
    } catch (err) {
      toast.error('Erreur modération');
    }
  };

  const modererAnnonce = async (id, statut) => {
    try {
      await api.put(`/admin/annonces/${id}/moderer`, { statut });
      toast.success('Annonce mise à jour !');
      chargerAnnonces();
    } catch (err) {
      toast.error('Erreur modération');
    }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';
  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR');

  const filtrer = (liste, champs) => {
    if (!recherche) return liste;
    return liste.filter(item =>
      champs.some(champ =>
        item[champ]?.toString().toLowerCase().includes(recherche.toLowerCase())
      )
    );
  };

  const onglets = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
    { id: 'annonces', label: 'Annonces', icon: Home },
    { id: 'paiements', label: 'Paiements', icon: CreditCard },
    { id: 'dossiers', label: 'Dossiers', icon: FileText },
  ];

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl"/>)}
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield size={24} className="text-blue-600" />
              Panel Administrateur
            </h1>
            <p className="text-gray-500 text-sm">Maison+ — Gestion de la plateforme</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm overflow-x-auto">
          {onglets.map((o) => {
            const Icon = o.icon;
            return (
              <button key={o.id} onClick={() => changerOnglet(o.id)}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  onglet === o.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <Icon size={16} />
                {o.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard */}
        {onglet === 'dashboard' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Utilisateurs', value: stats.stats?.total_utilisateurs || 0, icon: Users, color: 'blue' },
                { label: 'Annonces', value: stats.stats?.total_annonces || 0, icon: Home, color: 'green' },
                { label: 'Paiements', value: stats.stats?.total_paiements || 0, icon: CreditCard, color: 'purple' },
                { label: 'Litiges', value: stats.stats?.total_litiges || 0, icon: AlertTriangle, color: 'orange' },
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

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Revenus Maison+</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600 font-medium">Total commissions</p>
                  <p className="text-2xl font-bold text-blue-800 mt-1">{formaterPrix(stats.stats?.total_commissions || 0)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600 font-medium">Ce mois</p>
                  <p className="text-2xl font-bold text-green-800 mt-1">{formaterPrix(stats.stats?.commissions_mois || 0)}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm text-purple-600 font-medium">Paiements complétés</p>
                  <p className="text-2xl font-bold text-purple-800 mt-1">{stats.stats?.paiements_completes || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Dernières inscriptions</h2>
              <div className="space-y-3">
                {(stats.derniers_utilisateurs || []).map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {u.photo_profil_url ? (
                          <img src={u.photo_profil_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-blue-600 font-bold text-sm">{u.prenom?.[0]}{u.nom?.[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{u.prenom} {u.nom}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.type_compte === 'professionnel' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>{u.type_compte}</span>
                      <span className="text-gray-400 text-xs">{formaterDate(u.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Utilisateurs */}
        {onglet === 'utilisateurs' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Utilisateurs ({utilisateurs.length})</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Rechercher..."
                  value={recherche} onChange={(e) => setRecherche(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Utilisateur</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Type</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Statut</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrer(utilisateurs, ['nom', 'prenom', 'email', 'telephone']).map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                            {u.photo_profil_url ? (
                              <img src={u.photo_profil_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-blue-600 font-bold text-xs">{u.prenom?.[0]}{u.nom?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{u.prenom} {u.nom}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.type_compte === 'professionnel' ? 'bg-purple-100 text-purple-600' :
                          u.type_compte === 'admin' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>{u.type_compte}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.statut === 'actif' ? 'bg-green-100 text-green-600' :
                          u.statut === 'banni' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>{u.statut}</span>
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-400">{formaterDate(u.created_at)}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          {u.statut !== 'banni' ? (
                            <button onClick={() => modererUtilisateur(u.id, 'banni')}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Bannir">
                              <XCircle size={16} />
                            </button>
                          ) : (
                            <button onClick={() => modererUtilisateur(u.id, 'actif')}
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition" title="Activer">
                              <CheckCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Annonces */}
        {onglet === 'annonces' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Annonces ({annonces.length})</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Rechercher..."
                  value={recherche} onChange={(e) => setRecherche(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-3">
              {filtrer(annonces, ['titre', 'ville', 'categorie']).map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                      {a.photo_principale ? (
                        <img src={a.photo_principale} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home size={20} className="text-blue-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/annonces/${a.id}`} target="_blank"
                        className="font-medium text-gray-800 text-sm hover:text-blue-600 transition">
                        {a.titre}
                      </Link>
                      <p className="text-gray-400 text-xs">{a.ville} — {a.categorie}</p>
                      <p className="text-orange-500 text-xs font-medium">{formaterPrix(a.prix)}</p>
                      <Link href={`/profil/${a.utilisateur_id}`} target="_blank"
                        className="text-blue-500 text-xs hover:underline flex items-center gap-1 mt-0.5">
                        <User size={10} />
                        {a.prenom} {a.nom}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      a.statut === 'publiee' ? 'bg-green-100 text-green-600' :
                      a.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>{a.statut}</span>
                    <Link href={`/annonces/${a.id}`} target="_blank"
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                      <Eye size={16} />
                    </Link>
                    <button onClick={() => modererAnnonce(a.id, a.statut === 'publiee' ? 'rejetee' : 'publiee')}
                      className={`p-1.5 rounded-lg transition ${
                        a.statut === 'publiee' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                      }`}>
                      {a.statut === 'publiee' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paiements */}
        {onglet === 'paiements' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Paiements ({paiements.length})</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Rechercher..."
                  value={recherche} onChange={(e) => setRecherche(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Référence</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Annonce</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Montant</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Commission</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Statut</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrer(paiements, ['reference_transaction', 'annonce_titre']).map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 text-xs font-mono text-gray-600">{p.reference_transaction?.substring(0, 15)}...</td>
                      <td className="py-3 px-2 text-sm text-gray-700">{p.annonce_titre}</td>
                      <td className="py-3 px-2 text-sm font-medium text-gray-800">{formaterPrix(p.montant)}</td>
                      <td className="py-3 px-2 text-sm font-medium text-green-600">{formaterPrix(p.commission_plateforme)}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          p.statut === 'complete' ? 'bg-green-100 text-green-600' :
                          p.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>{p.statut}</span>
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-400">{formaterDate(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dossiers */}
        {onglet === 'dossiers' && (
          <div className="space-y-4">
            {!dossierSelectionne ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Dossiers d&apos;inscription</h2>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher par nom, email..."
                      value={recherche} onChange={(e) => setRecherche(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {filtrer(utilisateurs, ['nom', 'prenom', 'email']).map((u) => (
                    <div key={u.id} onClick={() => setDossierSelectionne(u)}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                          {u.photo_profil_url ? (
                            <img src={u.photo_profil_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-blue-600 font-bold text-sm">{u.prenom?.[0]}{u.nom?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{u.prenom} {u.nom}</p>
                          <p className="text-gray-400 text-xs">{u.email} — {u.telephone}</p>
                          <p className="text-gray-400 text-xs">Inscrit le {formaterDate(u.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.type_compte === 'professionnel' ? 'bg-purple-100 text-purple-600' :
                          u.type_compte === 'admin' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>{u.type_compte}</span>
                        <div className="flex items-center gap-1">
                          {u.email_verifie && <CheckCircle size={12} className="text-green-500" />}
                          {u.cnib_recto_url && <Shield size={12} className="text-blue-500" />}
                        </div>
                        <Eye size={16} className="text-blue-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <button onClick={() => setDossierSelectionne(null)}
                  className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm font-medium">
                  ← Retour aux dossiers
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                    {dossierSelectionne.photo_profil_url ? (
                      <img src={dossierSelectionne.photo_profil_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-blue-600 font-bold text-2xl">
                        {dossierSelectionne.prenom?.[0]}{dossierSelectionne.nom?.[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{dossierSelectionne.prenom} {dossierSelectionne.nom}</h2>
                    <p className="text-gray-500">{dossierSelectionne.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      dossierSelectionne.type_compte === 'professionnel' ? 'bg-purple-100 text-purple-600' :
                      dossierSelectionne.type_compte === 'admin' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>{dossierSelectionne.type_compte}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-700 border-b pb-2">Informations personnelles</h3>
                    {[
                      ['Nom complet', `${dossierSelectionne.prenom} ${dossierSelectionne.nom}`],
                      ['Email', dossierSelectionne.email],
                      ['Téléphone', dossierSelectionne.telephone],
                      ['Date inscription', formaterDate(dossierSelectionne.created_at)],
                      ['Statut', dossierSelectionne.statut],
                      ['Mobile Money', dossierSelectionne.mobile_money_numero
                        ? `${dossierSelectionne.mobile_money_operateur} — ${dossierSelectionne.mobile_money_numero}`
                        : '—'],
                    ].map(([label, valeur]) => (
                      <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">{label}</span>
                        <span className="text-gray-800 text-sm font-medium">{valeur || '—'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-700 border-b pb-2">Vérification KYC</h3>
                    {[
                      ['Email vérifié', dossierSelectionne.email_verifie],
                      ['Photo de profil', !!dossierSelectionne.photo_profil_url],
                      ['CNIB Recto', !!dossierSelectionne.cnib_recto_url],
                      ['CNIB Verso', !!dossierSelectionne.cnib_verso_url],
                      ['Mobile Money', !!dossierSelectionne.mobile_money_numero],
                    ].map(([label, valeur]) => (
                      <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">{label}</span>
                        {valeur
                          ? <CheckCircle size={16} className="text-green-500" />
                          : <XCircle size={16} className="text-red-400" />
                        }
                      </div>
                    ))}
                  </div>

                  {dossierSelectionne.type_compte === 'professionnel' && (
                    <div className="space-y-3 md:col-span-2">
                      <h3 className="font-bold text-gray-700 border-b pb-2">Informations entreprise</h3>
                      {[
                        ['Nom entreprise', dossierSelectionne.nom_entreprise],
                        ['RCCM', dossierSelectionne.rccm],
                        ['IFU', dossierSelectionne.ifu],
                        ['Secteur', dossierSelectionne.secteur_activite],
                        ['Site web', dossierSelectionne.site_web],
                      ].map(([label, valeur]) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-gray-500 text-sm">{label}</span>
                          <span className="text-gray-800 text-sm font-medium">{valeur || '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(dossierSelectionne.cnib_recto_url || dossierSelectionne.cnib_verso_url) && (
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">Documents CNIB</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {dossierSelectionne.cnib_recto_url && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Recto</p>
                            <img src={dossierSelectionne.cnib_recto_url} alt="CNIB Recto"
                              className="w-full h-40 object-cover rounded-xl border" />
                          </div>
                        )}
                        {dossierSelectionne.cnib_verso_url && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Verso</p>
                            <img src={dossierSelectionne.cnib_verso_url} alt="CNIB Verso"
                              className="w-full h-40 object-cover rounded-xl border" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  {dossierSelectionne.statut !== 'banni' ? (
                    <button onClick={() => { modererUtilisateur(dossierSelectionne.id, 'banni'); setDossierSelectionne(null); }}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition">
                      <XCircle size={16} />
                      Bannir ce compte
                    </button>
                  ) : (
                    <button onClick={() => { modererUtilisateur(dossierSelectionne.id, 'actif'); setDossierSelectionne(null); }}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition">
                      <CheckCircle size={16} />
                      Réactiver ce compte
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
