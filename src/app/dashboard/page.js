'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Home, Eye, Plus, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [profil, setProfil] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!authChargement && !utilisateur) {
      router.push('/connexion');
    }
    if (utilisateur) {
      chargerDonnees();
    }
  }, [utilisateur, authChargement]);

  const chargerDonnees = async () => {
    try {
      const [profilRes, annoncesRes] = await Promise.all([
        api.get('/profil/moi'),
        api.get('/profil/moi/annonces')
      ]);
      setProfil(profilRes.data);
      setAnnonces(annoncesRes.data.annonces || []);
    } catch (erreur) {
      toast.error('Erreur chargement des données');
    } finally {
      setChargement(false);
    }
  };

  const supprimerAnnonce = async (id) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete(`/annonces/${id}`);
      toast.success('Annonce supprimée !');
      setAnnonces(annonces.filter(a => a.id !== id));
    } catch (erreur) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const formaterPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';
  };

  const getStatutBadge = (statut) => {
    const config = {
      'publiee': { label: 'Publiée', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
      'en_attente': { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
      'rejetee': { label: 'Rejetée', icon: XCircle, color: 'text-red-600 bg-red-50' },
      'vendu': { label: 'Vendu', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
      'loue': { label: 'Loué', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    };
    return config[statut] || { label: statut, icon: Clock, color: 'text-gray-600 bg-gray-50' };
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl mb-6"/>
          <div className="h-64 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Profil */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">
                  {utilisateur?.prenom?.[0]}{utilisateur?.nom?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {utilisateur?.prenom} {utilisateur?.nom}
                </h1>
                <p className="text-gray-500">{utilisateur?.email}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  utilisateur?.statut === 'verifie'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {utilisateur?.statut === 'verifie' ? 'Compte vérifié' : 'En attente de vérification'}
                </span>
              </div>
            </div>
            <Link href="/publier"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              <Plus size={18} />
              Nouvelle annonce
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        {profil?.statistiques && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total annonces', value: profil.statistiques.total_annonces, color: 'blue' },
              { label: 'Annonces actives', value: profil.statistiques.annonces_actives, color: 'green' },
              { label: 'Conclues', value: profil.statistiques.annonces_conclues, color: 'purple' },
              { label: 'Total vues', value: profil.statistiques.total_vues || 0, color: 'orange' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mes annonces */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mes annonces</h2>

          {annonces.length === 0 ? (
            <div className="text-center py-12">
              <Home size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore d&apos;annonces</p>
              <Link href="/publier"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                Publier une annonce
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {annonces.map((annonce) => {
                const { label, icon: Icon, color } = getStatutBadge(annonce.statut);
                return (
                  <div key={annonce.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition gap-4">
                    
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Home size={24} className="text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{annonce.titre}</h3>
                        <p className="text-orange-500 font-medium text-sm">{formaterPrix(annonce.prix)}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${color}`}>
                            <Icon size={10} />
                            {label}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Eye size={10} />
                            {annonce.nb_vues} vues
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/annonces/${annonce.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Eye size={18} />
                      </Link>
                      <button onClick={() => supprimerAnnonce(annonce.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}