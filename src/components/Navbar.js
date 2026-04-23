'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Home, Plus, MessageCircle, User, LogOut, Menu, X, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Navbar() {
  const { utilisateur, deconnexion } = useAuth();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [nonLus, setNonLus] = useState(0);

  useEffect(() => {
    if (utilisateur) {
      chargerNonLus();
      // Actualiser toutes les 30 secondes
      const interval = setInterval(chargerNonLus, 30000);
      return () => clearInterval(interval);
    }
  }, [utilisateur]);

  const chargerNonLus = async () => {
    try {
      const response = await api.get('/messages/mes-conversations');
      const conversations = response.data.conversations || [];
      const total = conversations.reduce((acc, conv) => acc + (parseInt(conv.non_lus) || 0), 0);
      setNonLus(total);
    } catch (err) {
      console.error('Erreur chargement non lus:', err);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Home className="text-blue-600" size={28} />
            <span className="text-2xl font-bold text-blue-600">Maison</span>
            <span className="text-2xl font-bold text-green-500">+</span>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/annonces" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Annonces
            </Link>
            <Link href="/annonces?categorie=maison" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Maisons
            </Link>
            <Link href="/annonces?categorie=marketplace" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Marketplace
            </Link>
            <Link href="/annonces?categorie=restaurant" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Restaurants
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {utilisateur ? (
              <>
                <Link href="/publier"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium">
                  <Plus size={18} />
                  Publier
                </Link>

                {/* Icône message avec badge */}
                <Link href="/messages" className="relative text-gray-600 hover:text-blue-600 transition">
                  <MessageCircle size={24} />
                  {nonLus > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {nonLus > 9 ? '9+' : nonLus}
                    </span>
                  )}
                </Link>

                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
                  <User size={24} />
                </Link>
                <Link href="/parametres" className="text-gray-600 hover:text-blue-600 transition">
                  <Settings size={24} />
                </Link>
                <button onClick={deconnexion} className="text-gray-600 hover:text-red-500 transition">
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <>
                <Link href="/connexion" className="text-blue-600 font-medium hover:underline">
                  Connexion
                </Link>
                <Link href="/inscription"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <button className="md:hidden" onClick={() => setMenuOuvert(!menuOuvert)}>
            {menuOuvert ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile ouvert */}
        {menuOuvert && (
          <div className="md:hidden py-4 border-t flex flex-col gap-3">
            <Link href="/annonces" className="text-gray-600 font-medium py-2">Annonces</Link>
            <Link href="/annonces?categorie=maison" className="text-gray-600 font-medium py-2">Maisons</Link>
            <Link href="/annonces?categorie=marketplace" className="text-gray-600 font-medium py-2">Marketplace</Link>
            <Link href="/annonces?categorie=restaurant" className="text-gray-600 font-medium py-2">Restaurants</Link>
            {utilisateur ? (
              <>
                <Link href="/publier" className="text-green-600 font-medium py-2">+ Publier une annonce</Link>
                <Link href="/messages" className="text-gray-600 font-medium py-2 flex items-center gap-2">
                  Messages
                  {nonLus > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {nonLus}
                    </span>
                  )}
                </Link>
                <Link href="/dashboard" className="text-gray-600 font-medium py-2">Mon profil</Link>
                <Link href="/parametres" className="text-gray-600 font-medium py-2">Paramètres</Link>
                <button onClick={deconnexion} className="text-red-500 font-medium py-2 text-left">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/connexion" className="text-blue-600 font-medium py-2">Connexion</Link>
                <Link href="/inscription" className="text-blue-600 font-medium py-2">S&apos;inscrire</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}