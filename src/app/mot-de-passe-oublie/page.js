'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [chargement, setChargement] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      await api.post('/auth/mot-de-passe-oublie', { email });
      setEnvoye(true);
    } catch (erreur) {
      toast.error('Erreur lors de l\'envoi');
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

        {!envoye ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Mot de passe oublié
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Entrez votre email pour recevoir un lien de réinitialisation
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={chargement}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {chargement ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Email envoyé !</h2>
            <p className="text-gray-500 mb-6">
              Si cet email existe, vous recevrez un lien de réinitialisation dans quelques minutes.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Vérifiez aussi vos spams.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/connexion"
            className="flex items-center justify-center gap-2 text-blue-600 hover:underline font-medium">
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}