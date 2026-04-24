'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { CheckCircle, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function PaiementSucces() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [emailEnvoye, setEmailEnvoye] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('transaction_id') || searchParams.get('tx_ref');
    if (ref) setReference(ref);
  }, []);

  const telechargerRecu = async () => {
    if (!reference) {
      toast.error('Référence introuvable');
      return;
    }
    setChargement(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/paiements/recu/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        toast.error('Erreur téléchargement reçu');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recu_${reference}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Reçu téléchargé !');
    } catch (err) {
      toast.error('Erreur téléchargement');
    } finally {
      setChargement(false);
    }
  };

  const envoyerEmail = async () => {
    if (!reference) return;
    setChargement(true);
    try {
      await api.post(`/paiements/recu/${reference}/email`);
      toast.success('Reçu envoyé par email !');
      setEmailEnvoye(true);
    } catch (err) {
      toast.error('Erreur envoi email');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h1>
          <p className="text-gray-500 mb-2">
            Votre paiement a été confirmé avec succès.
          </p>
          {reference && (
            <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 px-3 py-1.5 rounded-lg">
              Réf : {reference}
            </p>
          )}

          {/* Boutons reçu */}
          <div className="space-y-3 mb-6">
            <button onClick={telechargerRecu} disabled={chargement || !reference}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
              <Download size={18} />
              {chargement ? 'Chargement...' : 'Télécharger le reçu PDF'}
            </button>

            <button onClick={envoyerEmail} disabled={chargement || emailEnvoye || !reference}
              className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition disabled:opacity-50">
              <Mail size={18} />
              {emailEnvoye ? 'Email envoyé ✓' : 'Recevoir par email'}
            </button>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard"
              className="w-full block bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition">
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