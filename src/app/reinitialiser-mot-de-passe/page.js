'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function ReinitialiserMotDePasse() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [voirMDP, setVoirMDP] = useState(false);
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (motDePasse !== confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (motDePasse.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setChargement(true);
    try {
      const token = searchParams.get('token');
      await api.post('/auth/reinitialiser-mot-de-passe', {
        token,
        nouveau_mot_de_passe: motDePasse
      });
      toast.success('Mot de passe réinitialisé !');
      router.push('/connexion');
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Lien invalide ou expiré');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Home className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-blue-600">Maison</span>
          <span className="text-2xl font-bold text-green-500">+</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Choisissez un nouveau mot de passe sécurisé
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={voirMDP ? 'text' : 'password'}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="Minimum 8 caractères"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition pr-12"
              />
              <button type="button" onClick={() => setVoirMDP(!voirMDP)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {voirMDP ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Répétez le mot de passe"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {chargement ? 'Réinitialisation...' : 'Réinitialiser'}
          </button>
        </form>
      </div>
    </div>
  );
}