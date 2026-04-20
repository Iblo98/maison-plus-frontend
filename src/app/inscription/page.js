'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Home, Eye, EyeOff, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Inscription() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    telephone: '', mot_de_passe: ''
  });
  const [photoProfil, setPhotoProfil] = useState(null);
  const [voirMDP, setVoirMDP] = useState(false);
  const [chargement, setChargement] = useState(false);
  const { inscription } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoProfil) {
      toast.error('La photo de profil est obligatoire');
      return;
    }
    if (form.mot_de_passe.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setChargement(true);
    try {
      // Créer le compte
      const utilisateur = await inscription(form);

      // Upload photo de profil automatiquement
      const formData = new FormData();
      formData.append('photo', photoProfil);
      const token = localStorage.getItem('token');
      const photoResponse = await fetch('http://localhost:3000/api/kyc/photo-profil', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const photoData = await photoResponse.json();
      if (!photoData.succes) {
        toast.error('Erreur upload photo — complétez dans les paramètres');
      }

      toast.success('Compte créé ! Complétez votre vérification.');
      router.push('/kyc');
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Home className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-blue-600">Maison</span>
          <span className="text-2xl font-bold text-green-500">+</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Rejoignez Maison+ gratuitement
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Photo de profil obligatoire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de profil <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer">
              {photoProfil ? (
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={URL.createObjectURL(photoProfil)}
                    alt="Aperçu"
                    className="w-16 h-16 rounded-full object-cover"
                  />
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoProfil(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {voirMDP ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={chargement || !photoProfil}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {chargement ? 'Création...' : 'Créer mon compte'}
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