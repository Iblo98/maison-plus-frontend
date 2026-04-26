'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/api';

function VerifierEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [statut, setStatut] = useState('chargement');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifier(token);
    } else {
      setStatut('erreur');
      setMessage('Token manquant');
    }
  }, []);

  const verifier = async (token) => {
    try {
      const response = await api.get(`/auth/verifier-email?token=${token}`);
      setStatut('succes');
      setMessage(response.data.message);
      setTimeout(() => router.push('/connexion'), 3000);
    } catch (erreur) {
      setStatut('erreur');
      setMessage(erreur?.response?.data?.message || 'Token invalide ou expiré');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Home className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-blue-600">Maison</span>
          <span className="text-2xl font-bold text-green-500">+</span>
        </Link>

        {statut === 'chargement' && (
          <div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
            <p className="text-gray-600">Vérification en cours...</p>
          </div>
        )}

        {statut === 'succes' && (
          <div>
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email vérifié !</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <p className="text-gray-400 text-sm">Redirection vers la connexion...</p>
          </div>
        )}

        {statut === 'erreur' && (
          <div>
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link href="/connexion"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifierEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <VerifierEmailContent />
    </Suspense>
  );
}