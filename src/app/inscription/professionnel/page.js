'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Home, Eye, EyeOff, Camera, User, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InscriptionProfessionnel() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', mot_de_passe: '',
    nom_entreprise: '', rccm: '', ifu: '', secteur_activite: '', site_web: ''
  });
  const [photoProfil, setPhotoProfil] = useState(null);
  const [voirMDP, setVoirMDP] = useState(false);
  const [chargement, setChargement] = useState(false);
  const { inscription } = useAuth();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoProfil) { toast.error('La photo de profil est obligatoire'); return; }
    if (form.mot_de_passe.length < 8) { toast.error('Le mot de passe doit contenir au moins 8 caractères'); return; }
    if (!form.nom_entreprise) { toast.error('Le nom de l\'entreprise est obligatoire'); return; }

    setChargement(true);
    try {
      await inscription({ ...form, type_compte: 'professionnel' });
      const formData = new FormData();
      formData.append('photo', photoProfil);
      await fetch('https://maison-plus-backend.onrender.com/api/kyc/photo-profil', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      toast.success('Compte professionnel créé ! Complétez votre profil.');
      router.push('/kyc');
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setChargement(false);
    }
  };

  const secteurs = [
    'Immobilier', 'Hôtellerie', 'Auberge', 'Restauration',
    'Commerce', 'Services', 'Construction', 'Autre'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">

        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <Home className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-blue-600">Maison</span>
          <span className="text-2xl font-bold text-green-500">+</span>
        </Link>

        {/* Type de compte */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/inscription/particulier"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition">
            <User size={28} className="text-gray-400" />
            <span className="font-medium text-sm text-gray-600">Particulier</span>
            <span className="text-xs text-gray-400 text-center">Personne physique</span>
          </Link>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-blue-600 bg-blue-50">
            <Building size={28} className="text-blue-600" />
            <span className="font-medium text-sm text-blue-600">Professionnel</span>
            <span className="text-xs text-gray-400 text-center">Entreprise / Hôtel</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-800 text-center mb-6">
          Inscription — Professionnel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Informations personnelles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange}
                placeholder="Kouraogo" required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
              <input type="text" name="prenom" value={form.prenom} onChange={handleChange}
                placeholder="Ibrahim" required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="votre@email.com" required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
            <input type="tel" name="telephone" value={form.telephone} onChange={handleChange}
              placeholder="70000000" required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={voirMDP ? 'text' : 'password'} name="mot_de_passe"
                value={form.mot_de_passe} onChange={handleChange}
                placeholder="Minimum 8 caractères" required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition pr-12"
              />
              <button type="button" onClick={() => setVoirMDP(!voirMDP)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {voirMDP ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Informations entreprise */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Building size={16} className="text-blue-600" />
              Informations de l&apos;entreprise
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;entreprise <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nom_entreprise" value={form.nom_entreprise} onChange={handleChange}
                  placeholder="Ex: Hôtel Azalaï, Agence XYZ" required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RCCM</label>
                  <input type="text" name="rccm" value={form.rccm} onChange={handleChange}
                    placeholder="BF-OUA-2024-XXX"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFU</label>
                  <input type="text" name="ifu" value={form.ifu} onChange={handleChange}
                    placeholder="00000000X"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d&apos;activité</label>
                <select name="secteur_activite" value={form.secteur_activite} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition">
                  <option value="">Sélectionnez un secteur</option>
                  {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input type="url" name="site_web" value={form.site_web} onChange={handleChange}
                  placeholder="https://www.monentreprise.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Photo de profil en dernière position */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de profil <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer">
              {photoProfil ? (
                <div className="flex items-center justify-center gap-3">
                  <img src={URL.createObjectURL(photoProfil)} alt="Aperçu"
                    className="w-16 h-16 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="text-green-600 font-medium text-sm">{photoProfil.name}</p>
                    <p className="text-gray-400 text-xs">Cliquez pour changer</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Camera size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Cliquez pour ajouter votre photo</p>
                  <p className="text-gray-400 text-xs mt-1">JPG, PNG — Max 10MB</p>
                </div>
              )}
              <input type="file" accept="image/*"
                onChange={(e) => setPhotoProfil(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

          <button type="submit" disabled={chargement || !photoProfil}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {chargement ? 'Création en cours...' : 'Créer mon compte professionnel'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link href="/connexion" className="text-blue-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
