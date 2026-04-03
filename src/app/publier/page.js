'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Publier() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const [etape, setEtape] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    categorie: 'maison',
    type_transaction: 'location',
    prix: '',
    superficie: '',
    nb_pieces: '',
    ville: '',
    quartier: '',
    adresse_complete: '',
    disponible_du: '',
    disponible_au: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!utilisateur) {
      toast.error('Vous devez être connecté pour publier');
      router.push('/connexion');
      return;
    }

    // Vérifier KYC
    try {
      const kycResponse = await api.get('/kyc/statut');
      const kyc = kycResponse.data;
      if (!kyc.etapes.photo_profil) {
        toast.error('Ajoutez une photo de profil avant de publier');
        router.push('/kyc');
        return;
      }
      if (!kyc.etapes.cnib_soumise) {
        toast.error('Soumettez votre CNIB ou passeport avant de publier');
        router.push('/kyc');
        return;
      }
      if (!kyc.etapes.paiement_configure) {
        toast.error('Configurez votre Mobile Money avant de publier');
        router.push('/kyc');
        return;
      }
    } catch (err) {
      console.error('Erreur vérification KYC:', err);
    }

    setChargement(true);
    try {
      await api.post('/annonces', form);
      toast.success('Annonce soumise — en attente de validation !');
      router.push('/dashboard');
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur lors de la publication');
    } finally {
      setChargement(false);
    }
  };

  const categories = [
    { id: 'maison', label: 'Maison' },
    { id: 'parcelle', label: 'Parcelle' },
    { id: 'hotel', label: 'Hôtel' },
    { id: 'marketplace', label: 'Objet' },
    { id: 'restaurant', label: 'Restaurant' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Publier une annonce</h1>
        <p className="text-gray-500 mb-6">Remplissez les informations de votre bien</p>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                etape >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>{i}</div>
              {i < 3 && <div className={`flex-1 h-1 rounded ${etape > i ? 'bg-blue-600' : 'bg-gray-200'}`}/>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* Etape 1 */}
          {etape === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Informations de base</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button key={cat.id} type="button"
                      onClick={() => setForm({ ...form, categorie: cat.id })}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition ${
                        form.categorie === cat.id
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de transaction</label>
                <div className="grid grid-cols-2 gap-2">
                  {['location', 'vente'].map((type) => (
                    <button key={type} type="button"
                      onClick={() => setForm({ ...form, type_transaction: type })}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition capitalize ${
                        form.type_transaction === type
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l&apos;annonce</label>
                <input type="text" name="titre" value={form.titre} onChange={handleChange}
                  placeholder="Ex: Belle villa 4 chambres à Ouaga 2000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Décrivez votre bien en détail..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              <button onClick={() => setEtape(2)}
                disabled={!form.titre || !form.categorie}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                Continuer
              </button>
            </div>
          )}

          {/* Etape 2 */}
          {etape === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Caractéristiques</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (XOF)</label>
                <input type="number" name="prix" value={form.prix} onChange={handleChange}
                  placeholder="150000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
                  <input type="number" name="superficie" value={form.superficie} onChange={handleChange}
                    placeholder="200"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de pièces</label>
                  <input type="number" name="nb_pieces" value={form.nb_pieces} onChange={handleChange}
                    placeholder="4"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disponible du</label>
                  <input type="date" name="disponible_du" value={form.disponible_du} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
                  <input type="date" name="disponible_au" value={form.disponible_au} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEtape(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:border-gray-400 transition">
                  Retour
                </button>
                <button onClick={() => setEtape(3)}
                  disabled={!form.prix}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Etape 3 */}
          {etape === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Localisation</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input type="text" name="ville" value={form.ville} onChange={handleChange}
                  placeholder="Ouagadougou"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                <input type="text" name="quartier" value={form.quartier} onChange={handleChange}
                  placeholder="Ouaga 2000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <input type="text" name="adresse_complete" value={form.adresse_complete} onChange={handleChange}
                  placeholder="Secteur 15, Rue 12.45"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Home size={16} />
                  Résumé de l&apos;annonce
                </h3>
                <p className="text-blue-700 text-sm"><strong>Titre :</strong> {form.titre}</p>
                <p className="text-blue-700 text-sm"><strong>Type :</strong> {form.type_transaction} — {form.categorie}</p>
                <p className="text-blue-700 text-sm"><strong>Prix :</strong> {form.prix ? new Intl.NumberFormat('fr-FR').format(form.prix) + ' XOF' : '-'}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEtape(2)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:border-gray-400 transition">
                  Retour
                </button>
                <button onClick={handleSubmit}
                  disabled={!form.ville || chargement}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50">
                  {chargement ? 'Publication...' : 'Publier'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}