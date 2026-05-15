'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  Users, Home, CreditCard, AlertTriangle, Search, CheckCircle,
  XCircle, Eye, TrendingUp, FileText, Shield, User, Globe,
  BarChart2, MessageCircle, Ban, Star, ChevronRight, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [onglet, setOnglet] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [graphiques, setGraphiques] = useState(null);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pays, setPays] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [dossierSelectionne, setDossierSelectionne] = useState(null);
  const [signalementSelectionne, setSignalementSelectionne] = useState(null);
  const [periodeTransaction, setPeriodeTransaction] = useState('mois');
  const [ongletGraph, setOngletGraph] = useState('mensuel');
  const [suspensionJours, setSuspensionJours] = useState(7);

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      if (utilisateur.type_compte !== 'admin') { router.push('/'); toast.error('Accès réservé aux administrateurs'); return; }
      chargerDashboard();
    }
  }, [utilisateur, authChargement]);

  const chargerDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setGraphiques(response.data.graphiques);
    } catch (err) {
      toast.error('Erreur chargement dashboard');
    } finally {
      setChargement(false);
    }
  };

  const chargerUtilisateurs = async () => {
    try {
      const r = await api.get('/admin/utilisateurs');
      setUtilisateurs(r.data.utilisateurs || []);
    } catch (err) { toast.error('Erreur utilisateurs'); }
  };

  const chargerAnnonces = async () => {
    try {
      const r = await api.get('/admin/annonces');
      setAnnonces(r.data.annonces || []);
    } catch (err) { toast.error('Erreur annonces'); }
  };

  const chargerSignalements = async () => {
    try {
      const r = await api.get('/admin/signalements');
      setSignalements(r.data.signalements || []);
    } catch (err) { toast.error('Erreur signalements'); }
  };

  const chargerTransactions = async (periode = 'mois') => {
    try {
      const r = await api.get(`/admin/transactions?periode=${periode}`);
      setTransactions(r.data);
    } catch (err) { toast.error('Erreur transactions'); }
  };

  const chargerPays = async () => {
    try {
      const r = await api.get('/admin/pays');
      setPays(r.data.pays || []);
    } catch (err) { toast.error('Erreur pays'); }
  };

  const changerOnglet = (o) => {
    setOnglet(o);
    setDossierSelectionne(null);
    setSignalementSelectionne(null);
    setRecherche('');
    if (o === 'utilisateurs' || o === 'dossiers') chargerUtilisateurs();
    if (o === 'annonces') chargerAnnonces();
    if (o === 'signalements') chargerSignalements();
    if (o === 'transactions') chargerTransactions();
    if (o === 'pays') chargerPays();
  };

  const modererUtilisateur = async (id, statut) => {
    try {
      await api.put(`/admin/utilisateurs/${id}/moderer`, { statut, duree_jours: statut === 'suspendu' ? suspensionJours : null });
      toast.success(`Compte ${statut} !`);
      chargerUtilisateurs();
    } catch (err) { toast.error('Erreur'); }
  };

  const supprimerUtilisateur = async (id) => {
    if (!confirm('Supprimer définitivement ce compte ?')) return;
    try {
      await api.delete(`/admin/utilisateurs/${id}`);
      toast.success('Compte supprimé');
      chargerUtilisateurs();
    } catch (err) { toast.error('Erreur'); }
  };

  const modererAnnonce = async (id, statut) => {
    try {
      await api.put(`/admin/annonces/${id}/moderer`, { statut });
      toast.success(`Annonce ${statut} !`);
      chargerAnnonces();
    } catch (err) { toast.error('Erreur'); }
  };

  const supprimerAnnonce = async (id) => {
    if (!confirm('Supprimer définitivement cette annonce ?')) return;
    try {
      await api.delete(`/admin/annonces/${id}`);
      toast.success('Annonce supprimée');
      chargerAnnonces();
    } catch (err) { toast.error('Erreur'); }
  };

  const traiterSignalement = async (id, statut, action_annonce = null) => {
    try {
      await api.put(`/admin/signalements/${id}`, { statut, action_annonce });
      toast.success('Signalement traité !');
      chargerSignalements();
      setSignalementSelectionne(null);
    } catch (err) { toast.error('Erreur'); }
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(Math.round(prix || 0)) + ' XOF';
  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR');
  const filtrer = (liste, champs) => {
    if (!recherche) return liste;
    return liste.filter(item => champs.some(c => item[c]?.toString().toLowerCase().includes(recherche.toLowerCase())));
  };

  const onglets = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
    { id: 'annonces', label: 'Annonces', icon: Home },
    { id: 'signalements', label: 'Signalements', icon: AlertTriangle, urgent: stats?.signalements_urgents > 0 },
    { id: 'transactions', label: 'Transactions', icon: BarChart2 },
    { id: 'pays', label: 'Pays', icon: Globe },
    { id: 'dossiers', label: 'Dossiers KYC', icon: FileText },
  ];

  const dataGraph = graphiques?.[ongletGraph] || [];
  const maxRev = Math.max(...dataGraph.map(d => parseFloat(d.revenus || 0)), 1);

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
            <p className="text-gray-500 text-sm">Maison+ — Bienvenue {utilisateur?.prenom}</p>
          </div>
          {stats?.meilleur_mois && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-right">
              <p className="text-xs text-yellow-600">🏆 Meilleur mois</p>
              <p className="font-bold text-yellow-700 text-sm">{stats.meilleur_mois.mois}</p>
              <p className="text-xs text-yellow-600">{formaterPrix(stats.meilleur_mois.revenus)}</p>
            </div>
          )}
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
                {o.urgent && <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{stats.signalements_urgents}</span>}
              </button>
            );
          })}
        </div>

        {/* DASHBOARD */}
        {onglet === 'dashboard' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Utilisateurs', value: stats.utilisateurs, icon: Users, color: 'blue', badge: `+${stats.nouveaux_30j} ce mois` },
                { label: 'Annonces', value: stats.annonces, icon: Home, color: 'green' },
                { label: 'Transactions', value: stats.transactions, icon: TrendingUp, color: 'purple' },
                { label: 'Signalements', value: stats.signalements_urgents, icon: AlertTriangle, color: 'red', badge: stats.signalements_urgents > 0 ? 'À traiter !' : null },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className={`w-10 h-10 bg-${s.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={20} className={`text-${s.color}-600`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                    {s.badge && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.badge}</span>}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">💰 Revenus total</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">{formaterPrix(stats.revenus_total)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-green-600 font-medium">⭐ Avis publiés</p>
                <p className="text-2xl font-bold text-green-800 mt-1">{stats.avis}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-sm text-purple-600 font-medium">🌍 Pays représentés</p>
                <p className="text-2xl font-bold text-purple-800 mt-1">{graphiques?.par_pays?.length || 1}</p>
              </div>
            </div>

            {/* Graphique */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">📈 Revenus Maison+</h2>
                <div className="flex gap-2">
                  {['hebdo', 'mensuel'].map(p => (
                    <button key={p} onClick={() => setOngletGraph(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        ongletGraph === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {p === 'hebdo' ? 'Semaines' : 'Mois'}
                    </button>
                  ))}
                </div>
              </div>
              {dataGraph.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  Aucune transaction pour cette période
                </div>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {dataGraph.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <p className="text-xs text-blue-600 font-bold">{parseInt(d.revenus).toLocaleString()}</p>
                      <div className="w-full rounded-t-lg"
                        style={{ height: `${Math.max((parseFloat(d.revenus) / maxRev) * 160, 4)}px`, backgroundColor: '#1A56DB' }}/>
                      <p className="text-xs text-gray-400 truncate w-full text-center">{d.mois || d.semaine}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* UTILISATEURS */}
        {onglet === 'utilisateurs' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Utilisateurs ({utilisateurs.length})</h2>
              <div className="flex items-center gap-3">
                <select value={suspensionJours} onChange={(e) => setSuspensionJours(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option value={1}>Suspendre 1j</option>
                  <option value={3}>Suspendre 3j</option>
                  <option value={7}>Suspendre 7j</option>
                  <option value={30}>Suspendre 30j</option>
                </select>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Rechercher..." value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"/>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Utilisateur', 'Type', 'Statut', 'Annonces', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-sm font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtrer(utilisateurs, ['nom', 'prenom', 'email', 'telephone']).map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                            {u.photo_profil_url ? (
                              <img src={u.photo_profil_url} alt="" className="w-full h-full object-cover"/>
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
                          u.type_compte === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>{u.type_compte}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.statut === 'actif' ? 'bg-green-100 text-green-600' :
                          u.statut === 'banni' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>{u.statut}</span>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">{u.nb_annonces || 0}</td>
                      <td className="py-3 px-2 text-xs text-gray-400">{formaterDate(u.created_at)}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          {u.type_compte !== 'admin' && (
                            <>
                              {u.statut !== 'suspendu' && (
                                <button onClick={() => modererUtilisateur(u.id, 'suspendu')}
                                  className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition" title="Suspendre">
                                  <Ban size={14} />
                                </button>
                              )}
                              {u.statut !== 'banni' ? (
                                <button onClick={() => modererUtilisateur(u.id, 'banni')}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Bannir">
                                  <XCircle size={14} />
                                </button>
                              ) : (
                                <button onClick={() => modererUtilisateur(u.id, 'actif')}
                                  className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition" title="Réactiver">
                                  <CheckCircle size={14} />
                                </button>
                              )}
                              <button onClick={() => supprimerUtilisateur(u.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Supprimer">
                                <Trash2 size={14} />
                              </button>
                            </>
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

        {/* ANNONCES */}
        {onglet === 'annonces' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Annonces ({annonces.length})</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Rechercher..." value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"/>
              </div>
            </div>
            <div className="space-y-3">
              {filtrer(annonces, ['titre', 'ville', 'categorie']).map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                      {a.photo ? (
                        <img src={a.photo} alt="" className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home size={20} className="text-blue-300"/>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{a.titre}</p>
                      <p className="text-gray-400 text-xs">{a.ville} — {a.categorie}</p>
                      <p className="text-blue-500 text-xs">{a.prenom} {a.nom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      a.statut === 'publiee' ? 'bg-green-100 text-green-600' :
                      a.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>{a.statut}</span>
                    <Link href={`/annonces/${a.id}`} target="_blank"
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                      <Eye size={16}/>
                    </Link>
                    <button onClick={() => modererAnnonce(a.id, a.statut === 'publiee' ? 'rejetee' : 'publiee')}
                      className={`p-1.5 rounded-lg transition ${a.statut === 'publiee' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}>
                      {a.statut === 'publiee' ? <XCircle size={16}/> : <CheckCircle size={16}/>}
                    </button>
                    <button onClick={() => supprimerAnnonce(a.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNALEMENTS */}
        {onglet === 'signalements' && (
          <div className="space-y-4">
            {!signalementSelectionne ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Signalements ({signalements.filter(s => s.statut === 'en_attente').length} en attente)
                </h2>
                <div className="space-y-3">
                  {signalements.map((s) => (
                    <div key={s.id} onClick={() => setSignalementSelectionne(s)}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition hover:shadow-md ${
                        s.statut === 'en_attente' ? 'border-red-200 bg-red-50' : 'border-gray-100'
                      }`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={14} className={s.statut === 'en_attente' ? 'text-red-500' : 'text-gray-400'} />
                          <p className="font-medium text-gray-800 text-sm truncate">{s.annonce_titre}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            s.statut === 'en_attente' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                          }`}>{s.statut}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Signalé par <strong>{s.auteur_prenom} {s.auteur_nom}</strong> — {s.raison.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-400">Propriétaire : {s.proprio_prenom} {s.proprio_nom}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formaterDate(s.created_at)}</span>
                        <Eye size={16} className="text-blue-400"/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <button onClick={() => setSignalementSelectionne(null)}
                  className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm font-medium">
                  ← Retour aux signalements
                </button>
                <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
                  <h2 className="font-bold text-red-700 mb-2">🚨 {signalementSelectionne.raison.replace(/_/g, ' ')}</h2>
                  <p className="text-gray-700 text-sm font-medium">{signalementSelectionne.annonce_titre}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Signalé par {signalementSelectionne.auteur_prenom} {signalementSelectionne.auteur_nom} ({signalementSelectionne.auteur_email})
                  </p>
                  {signalementSelectionne.description && (
                    <p className="text-gray-600 text-sm mt-2 italic">"{signalementSelectionne.description}"</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Propriétaire de l'annonce</p>
                    <p className="font-medium text-gray-800">{signalementSelectionne.proprio_prenom} {signalementSelectionne.proprio_nom}</p>
                    <p className="text-xs text-gray-500">{signalementSelectionne.proprio_email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Signalé le</p>
                    <p className="font-medium text-gray-800">{formaterDate(signalementSelectionne.created_at)}</p>
                    <p className="text-xs text-gray-500">Statut : {signalementSelectionne.statut}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => traiterSignalement(signalementSelectionne.id, 'traite')}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition">
                    <CheckCircle size={16}/> Signalement valide — Ignorer l&apos;annonce
                  </button>
                  <button onClick={() => traiterSignalement(signalementSelectionne.id, 'traite', 'suspendue')}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-yellow-600 transition">
                    <Ban size={16}/> Suspendre l&apos;annonce
                  </button>
                  <button onClick={() => traiterSignalement(signalementSelectionne.id, 'traite', 'rejetee')}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition">
                    <XCircle size={16}/> Supprimer l&apos;annonce
                  </button>
                  <button onClick={() => traiterSignalement(signalementSelectionne.id, 'rejete')}
                    className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition">
                    Rejeter le signalement
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRANSACTIONS */}
        {onglet === 'transactions' && (
          <div className="space-y-6">
            <div className="flex gap-3">
              {['semaine', 'mois', 'annee'].map(p => (
                <button key={p} onClick={() => { setPeriodeTransaction(p); chargerTransactions(p); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    periodeTransaction === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-300'
                  }`}>
                  {p === 'semaine' ? 'Par semaine' : p === 'mois' ? 'Par mois' : 'Par année'}
                </button>
              ))}
            </div>

            {transactions.totaux && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Volume total</p>
                  <p className="text-2xl font-bold text-blue-800">{formaterPrix(transactions.totaux.volume_total)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Revenus Maison+ (5%)</p>
                  <p className="text-2xl font-bold text-green-800">{formaterPrix(transactions.totaux.revenus_total)}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium">Nb transactions</p>
                  <p className="text-2xl font-bold text-purple-800">{transactions.totaux.nb_total}</p>
                </div>
              </div>
            )}

            {transactions.stats && transactions.stats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Détail par période</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Période', 'Nb transactions', 'Volume', 'Revenus Maison+'].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.stats.map((s, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">{s.periode}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{s.nb_transactions}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{formaterPrix(s.volume)}</td>
                          <td className="py-3 px-4 text-sm font-bold text-green-600">{formaterPrix(s.revenus)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAYS */}
        {onglet === 'pays' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">🌍 Répartition par pays ({pays.length} pays)</h2>
            <div className="space-y-3">
              {pays.map((p, i) => (
                <div key={p.pays} className="flex items-center gap-4">
                  <span className="text-2xl w-8">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🌍'}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{p.pays}</span>
                      <span className="text-sm text-gray-500">{p.nb_utilisateurs} utilisateurs</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(p.nb_utilisateurs / (pays[0]?.nb_utilisateurs || 1)) * 100}%` }}/>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{p.nb_pros} professionnels</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOSSIERS KYC */}
        {onglet === 'dossiers' && (
          <div className="space-y-4">
            {!dossierSelectionne ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Dossiers KYC ({utilisateurs.length})</h2>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher..." value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"/>
                  </div>
                </div>
                <div className="space-y-3">
                  {filtrer(utilisateurs, ['nom', 'prenom', 'email']).map((u) => (
                    <div key={u.id} onClick={() => setDossierSelectionne(u)}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                          {u.photo_profil_url ? (
                            <img src={u.photo_profil_url} alt="" className="w-full h-full object-cover"/>
                          ) : (
                            <span className="text-blue-600 font-bold text-sm">{u.prenom?.[0]}{u.nom?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{u.prenom} {u.nom}</p>
                          <p className="text-gray-400 text-xs">{u.email} — {u.telephone}</p>
                          <p className="text-gray-400 text-xs">{formaterDate(u.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.type_compte === 'professionnel' ? 'bg-purple-100 text-purple-600' :
                          u.type_compte === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>{u.type_compte}</span>
                        <Eye size={16} className="text-blue-400"/>
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
                      <img src={dossierSelectionne.photo_profil_url} alt="" className="w-full h-full object-cover"/>
                    ) : (
                      <span className="text-blue-600 font-bold text-2xl">{dossierSelectionne.prenom?.[0]}{dossierSelectionne.nom?.[0]}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{dossierSelectionne.prenom} {dossierSelectionne.nom}</h2>
                    <p className="text-gray-500">{dossierSelectionne.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      dossierSelectionne.type_compte === 'professionnel' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>{dossierSelectionne.type_compte}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-700 border-b pb-2">Informations personnelles</h3>
                    {[
                      ['Nom complet', `${dossierSelectionne.prenom} ${dossierSelectionne.nom}`],
                      ['Email', dossierSelectionne.email],
                      ['Téléphone', dossierSelectionne.telephone],
                      ['Pays', dossierSelectionne.pays || 'BF'],
                      ['Date inscription', formaterDate(dossierSelectionne.created_at)],
                      ['Statut', dossierSelectionne.statut],
                      ['Annonces publiées', dossierSelectionne.nb_annonces || 0],
                      ['Réservations', dossierSelectionne.nb_reservations || 0],
                    ].map(([label, valeur]) => (
                      <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">{label}</span>
                        <span className="text-gray-800 text-sm font-medium">{valeur || '—'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-700 border-b pb-2">Vérification KYC</h3>
                    {[
                      ['Est vérifié', dossierSelectionne.est_verifie],
                      ['Badge Pro', dossierSelectionne.badge_pro],
                      ['Photo de profil', !!dossierSelectionne.photo_profil_url],
                    ].map(([label, valeur]) => (
                      <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">{label}</span>
                        {valeur ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-400"/>}
                      </div>
                    ))}
                    {dossierSelectionne.type_compte === 'professionnel' && (
                      <>
                        <h3 className="font-bold text-gray-700 border-b pb-2 mt-4">Entreprise</h3>
                        {[
                          ['Nom entreprise', dossierSelectionne.nom_entreprise],
                          ['RCCM', dossierSelectionne.rccm],
                          ['IFU', dossierSelectionne.ifu],
                          ['Secteur', dossierSelectionne.secteur_activite],
                        ].map(([label, valeur]) => (
                          <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">{label}</span>
                            <span className="text-gray-800 text-sm font-medium">{valeur || '—'}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-6 border-t flex-wrap">
                  {dossierSelectionne.type_compte !== 'admin' && (
                    <>
                      {dossierSelectionne.statut !== 'suspendu' && (
                        <button onClick={() => { modererUtilisateur(dossierSelectionne.id, 'suspendu'); setDossierSelectionne(null); }}
                          className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-yellow-600 transition">
                          <Ban size={16}/> Suspendre {suspensionJours}j
                        </button>
                      )}
                      {dossierSelectionne.statut !== 'banni' ? (
                        <button onClick={() => { modererUtilisateur(dossierSelectionne.id, 'banni'); setDossierSelectionne(null); }}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition">
                          <XCircle size={16}/> Bannir ce compte
                        </button>
                      ) : (
                        <button onClick={() => { modererUtilisateur(dossierSelectionne.id, 'actif'); setDossierSelectionne(null); }}
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition">
                          <CheckCircle size={16}/> Réactiver ce compte
                        </button>
                      )}
                    </>
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