'use client';
import Link from 'next/link';
import { Home, User, Building, ArrowRight } from 'lucide-react';

export default function Inscription() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Home className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-blue-600">Maison</span>
          <span className="text-2xl font-bold text-green-500">+</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Choisissez votre type de compte
        </p>

        <div className="space-y-4">
          <Link href="/inscription/particulier"
            className="flex items-center justify-between p-5 border-2 border-gray-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Particulier</p>
                <p className="text-gray-400 text-sm">Personne physique</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 transition" />
          </Link>

          <Link href="/inscription/professionnel"
            className="flex items-center justify-between p-5 border-2 border-gray-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition">
                <Building size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Professionnel</p>
                <p className="text-gray-400 text-sm">Entreprise / Hôtel / Agence immobilière</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 transition" />
          </Link>
        </div>

        <p className="text-center text-gray-500 mt-8">
          Déjà un compte ?{' '}
          <Link href="/connexion" className="text-blue-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
