'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Alertes() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [alertes, setAlertes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    categorie: '',
    type_transaction: '',
    ville: '',
    prix_min: '',
    prix_max: '',
    superficie_min: '',
    nb_pieces_min: ''
  });

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      chargerAlertes();
    }
  }, [utilisateur, authChargement]);

  const chargerAlertes = async () => {
    try {
      const response = await api.get('/alertes/mes-alertes');
      setAlertes(response.data.alertes || []);
    } catch (err) {
      toast.error('Erreur chargement alertes');
    } finally {
      setChargement(false);
    }
  };

  const creerAlerte = async (e) => {
    e.preventDefault();
    if (!form.nom) { toast.error('Donnez un nom à votre alerte'); return; }
    try {
      await api.post('/alertes', form);
      toast.success('Alerte créée ! 🔔');
      setFormulaireOuvert(false);
      setForm({
        nom: '', categorie: '', type_transaction: '',
        ville: '', prix_min: '', prix_max: '',
        superficie_min: '', nb_pieces_min: ''
      });
      chargerAlertes();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  const supprimerAlerte = async (id) => {
    if (!confirm('Supprimer cette alerte ?')) return;
    try {
      await api.delete(`/alertes/${id}`);
      setAlertes(alertes.filter(a => a.id !== id));
      toast.success('Alerte supprimée');
    } catch (err) {
      toast.error('Erreur suppression');
    }
  };

  const toggleAlerte = async (id) => {
    try {
      const response = await api.put(`/alertes/${id}/toggle`);
      setAlertes(alertes.map(a =>
        a.id === id ? { ...a, est_active: response.data.alerte.est_active } : a
      ));
      toast.success(response.data.message);
    } catch (err) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Bell size={24} className="text-blue-600" />
                Mes alertes
              </h1>
              <p className="text-gray-500 text-sm">
                Recevez un email quand une annonce correspond à vos critères
              </p>
            </div>
          </div>
          <button onClick={() => setFormulaireOuvert(!formulaireOuvert)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
            <Plus size={18} />
            Nouvelle alerte
          </button>
        </div>

        {/* Formulaire */}
        {formulaireOuvert && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Créer une alerte</h2>
            <form onSubmit={creerAlerte} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;alerte <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.nom}
                  onChange={(e) => setForm({...form, nom: e.target.value})}
                  placeholder="Ex: Maison à louer Ouaga"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select value={form.categorie}
                    onChange={(e) => setForm({...form, categorie: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition">
                    <option value="">Toutes</option>
                    <option value="maison">Maison</option>
                    <option value="parcelle">Parcelle</option>
                    <option value="hotel">Hôtel</option>
                    <option value="marketplace">Objet</option>
                    <option value="restaurant">Restaurant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type_transaction}
                    onChange={(e) => setForm({...form, type_transaction: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition">
                    <option value="">Tous</option>
                    <option value="location">Location</option>
                    <option value="vente">Vente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input type="text" value={form.ville}
                  onChange={(e) => setForm({...form, ville: e.target.value})}
                  placeholder="Ex: Ouagadougou"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix min (XOF)</label>
                  <input type="number" value={form.prix_min}
                    onChange={(e) => setForm({...form, prix_min: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix max (XOF)</label>
                  <input type="number" value={form.prix_max}
                    onChange={(e) => setForm({...form, prix_max: e.target.value})}
                    placeholder="999999999"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie min (m²)</label>
                  <input type="number" value={form.superficie_min}
                    onChange={(e) => setForm({...form, superficie_min: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nb pièces min</label>
                  <input type="number" value={form.nb_pieces_min}
                    onChange={(e) => setForm({...form, nb_pieces_min: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                  Créer l&apos;alerte 🔔
                </button>
                <button type="button" onClick={() => setFormulaireOuvert(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste alertes */}
        {chargement ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse"/>
            ))}
          </div>
        ) : alertes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Bell size={64} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune alerte</h2>
            <p className="text-gray-500 mb-6">
              Créez une alerte pour être notifié par email des nouvelles annonces
            </p>
            <button onClick={() => setFormulaireOuvert(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Créer ma première alerte
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {alertes.map((alerte) => (
              <div key={alerte.id}
                className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    alerte.est_active ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Bell size={22} className={alerte.est_active ? 'text-blue-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{alerte.nom}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {alerte.categorie && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {alerte.categorie}
                        </span>
                      )}
                      {alerte.type_transaction && (
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                          {alerte.type_transaction}
                        </span>
                      )}
                      {alerte.ville && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          📍 {alerte.ville}
                        </span>
                      )}
                      {alerte.prix_max && (
                        <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                          Max {new Intl.NumberFormat('fr-FR').format(alerte.prix_max)} XOF
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${alerte.est_active ? 'text-green-500' : 'text-gray-400'}`}>
                      {alerte.est_active ? '● Active' : '○ Inactive'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleAlerte(alerte.id)}
                    className="text-gray-400 hover:text-blue-600 transition p-2">
                    {alerte.est_active
                      ? <ToggleRight size={28} className="text-blue-600" />
                      : <ToggleLeft size={28} />
                    }
                  </button>
                  <button onClick={() => supprimerAlerte(alerte.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}