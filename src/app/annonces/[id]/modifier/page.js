'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { Home } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ModifierAnnonce() {
  const { id } = useParams();
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    prix: '',
    periode: 'mois',
    superficie: '',
    nb_pieces: '',
    ville: '',
    quartier: '',
    adresse_complete: '',
    disponible_du: '',
    disponible_au: '',
    conditions_remboursement: '',
    delai_liberation: '',
    type_transaction: '',
  });

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      chargerAnnonce();
    }
  }, [utilisateur, authChargement]);

  const chargerAnnonce = async () => {
    try {
      const response = await api.get(`/annonces/${id}`);
      const a = response.data.annonce;

      if (a.utilisateur_id !== utilisateur.id) {
        toast.error('Non autorisé');
        router.push('/dashboard');
        return;
      }

      setForm({
        titre: a.titre || '',
        description: a.description || '',
        prix: a.prix || '',
        periode: a.periode || 'mois',
        superficie: a.superficie || '',
        nb_pieces: a.nb_pieces || '',
        ville: a.ville || '',
        quartier: a.quartier || '',
        adresse_complete: a.adresse_complete || '',
        disponible_du: a.disponible_du ? a.disponible_du.split('T')[0] : '',
        disponible_au: a.disponible_au ? a.disponible_au.split('T')[0] : '',
        conditions_remboursement: a.conditions_remboursement || '',
        delai_liberation: a.delai_liberation || '',
        type_transaction: a.type_transaction || '',
      });
    } catch (err) {
      toast.error('Erreur chargement annonce');
      router.push('/dashboard');
    } finally {
      setChargement(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sauvegarder = async (e) => {
    e.preventDefault();
    setSauvegarde(true);
    try {
      await api.put(`/annonces/${id}`, form);
      toast.success('Annonce modifiée avec succès !');
      router.push(`/annonces/${id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur modification');
    } finally {
      setSauvegarde(false);
    }
  };

  const periodes = [
    { id: 'heure', label: '/heure' },
    { id: 'jour', label: '/jour' },
    { id: 'semaine', label: '/semaine' },
    { id: 'mois', label: '/mois' },
    { id: 'annee', label: '/an' },
  ];

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"/>
          <div className="h-96 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/annonces/${id}`} className="text-gray-400 hover:text-gray-600">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Home size={24} className="text-blue-600" />
            Modifier l&apos;annonce
          </h1>
        </div>

        <form onSubmit={sauvegarder} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input type="text" name="titre" value={form.titre}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description}
              onChange={handleChange} rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Conditions de remboursement */}
          {form.type_transaction === 'location' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conditions de remboursement
              </label>
              <textarea name="conditions_remboursement"
                value={form.conditions_remboursement}
                onChange={handleChange} rows={3}
                placeholder="Ex: Remboursement intégral si annulation 48h avant..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition resize-none"
              />
            </div>
          )}

          {/* Délai de libération */}
          {form.type_transaction === 'location' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Délai de libération (jours)
              </label>
              <input type="number" name="delai_liberation"
                value={form.delai_liberation}
                onChange={handleChange}
                placeholder="Ex: 30"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Nombre de jours de préavis requis avant libération du bien
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (XOF) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input type="number" name="prix" value={form.prix}
                onChange={handleChange} required
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
              <select name="periode" value={form.periode}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-3 py-3 outline-none focus:border-blue-500 transition">
                {periodes.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
              <input type="number" name="superficie" value={form.superficie}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nb pièces</label>
              <input type="number" name="nb_pieces" value={form.nb_pieces}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville <span className="text-red-500">*</span>
            </label>
            <input type="text" name="ville" value={form.ville}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
            <input type="text" name="quartier" value={form.quartier}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
            <input type="text" name="adresse_complete" value={form.adresse_complete}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponible dès</label>
              <input type="date" name="disponible_du" value={form.disponible_du}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jusqu&apos;au</label>
              <input type="date" name="disponible_au" value={form.disponible_au}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href={`/annonces/${id}`}
              className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-center">
              Annuler
            </Link>
            <button type="submit" disabled={sauvegarde}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {sauvegarde ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}