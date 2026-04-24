'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import api from '../../../lib/api';

export default function PaiementSucces() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reference = searchParams.get('transaction_id') || searchParams.get('tx_ref');
    if (reference) {
      verifierPaiement(reference);
    }
  }, []);

  const verifierPaiement = async (reference) => {
    try {
      await api.get(`/paiements/statut/${reference}`);
    } catch (err) {
      console.error('Erreur vérification:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h1>
          <p className="text-gray-500 mb-6">
            Votre paiement a été confirmé avec succès. Le propriétaire a été notifié et vous recevrez un reçu par email.
          </p>
          <div className="space-y-3">
            <Link href="/dashboard"
              className="w-full block bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Voir mon dashboard
            </Link>
            <Link href="/"
              className="w-full block border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}