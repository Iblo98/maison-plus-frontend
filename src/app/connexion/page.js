'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Home, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [voirMDP, setVoirMDP] = useState(false);
  const [chargement, setChargement] = useState(false);
  const { connexion } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      const utilisateur = await connexion(email, motDePasse);
      toast.success('Connexion réussie !');
      if (!utilisateur.email_verifie) {
        toast('Pensez à vérifier votre email !', { icon: '📧' });
      }
      router.push('/');
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Email ou mot de passe incorrect');
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
          Connexion
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Bienvenue sur Maison+
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <Link href="/mot-de-passe-oublie"
                className="text-sm text-blue-600 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                type={voirMDP ? 'text' : 'password'}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-12"
              />
              <button type="button" onClick={() => setVoirMDP(!voirMDP)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {voirMDP ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-blue-600 font-medium hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
