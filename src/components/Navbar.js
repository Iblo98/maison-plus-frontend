'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLangue } from '../context/LangueContext';
import { Home, Plus, MessageCircle, User, LogOut, Menu, X, Settings, Shield, Heart, Bell, BellRing, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import Notifications from './Notifications';

export default function Navbar() {
  const { utilisateur, deconnexion } = useAuth();
  const { langue, changerLangue, t } = useLangue();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [nonLus, setNonLus] = useState(0);

  useEffect(() => {
    if (utilisateur) {
      chargerNonLus();
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
              {t('nav.annonces')}
            </Link>
            <Link href="/recherche" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
              <Search size={15} />
              Recherche avancée
            </Link>
            <Link href="/annonces?categorie=maison" className="text-gray-600 hover:text-blue-600 font-medium transition">
              {t('nav.maisons')}
            </Link>
            <Link href="/annonces?categorie=marketplace" className="text-gray-600 hover:text-blue-600 font-medium transition">
              {t('nav.marketplace')}
            </Link>
            <Link href="/annonces?categorie=restaurant" className="text-gray-600 hover:text-blue-600 font-medium transition">
              {t('nav.restaurants')}
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">

            {/* Bouton langue */}
            <button
              onClick={() => changerLangue(langue === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:border-blue-600 hover:text-blue-600 transition">
              {langue === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
            </button>

            {utilisateur ? (
              <>
                {/* Bouton Admin */}
                {utilisateur?.type_compte === 'admin' && (
                  <Link href="/admin"
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition">
                    <Shield size={14} />
                    {t('nav.admin')}
                  </Link>
                )}

                <Link href="/publier"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium">
                  <Plus size={18} />
                  {t('nav.publier')}
                </Link>

                <Link href="/messages" className="relative text-gray-600 hover:text-blue-600 transition">
                  <MessageCircle size={24} />
                  {nonLus > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {nonLus > 9 ? '9+' : nonLus}
                    </span>
                  )}
                </Link>

                {/* Favoris */}
                <Link href="/favoris" className="text-gray-600 hover:text-red-500 transition">
                  <Heart size={24} />
                </Link>

                {/* Alertes */}
                <Link href="/alertes" className="text-gray-600 hover:text-blue-600 transition" title="Mes alertes">
                  <BellRing size={24} />
                </Link>

                <Notifications />

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
                  {t('nav.connexion')}
                </Link>
                <Link href="/inscription"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  {t('nav.inscrire')}
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
            <Link href="/annonces" className="text-gray-600 font-medium py-2">{t('nav.annonces')}</Link>
            <Link href="/recherche" className="text-gray-600 font-medium py-2 flex items-center gap-2">
              <Search size={16} className="text-blue-600" />
              Recherche avancée
            </Link>
            <Link href="/annonces?categorie=maison" className="text-gray-600 font-medium py-2">{t('nav.maisons')}</Link>
            <Link href="/annonces?categorie=marketplace" className="text-gray-600 font-medium py-2">{t('nav.marketplace')}</Link>
            <Link href="/annonces?categorie=restaurant" className="text-gray-600 font-medium py-2">{t('nav.restaurants')}</Link>

            {/* Bouton langue mobile */}
            <button
              onClick={() => changerLangue(langue === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-2 border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium w-fit">
              {langue === 'fr' ? '🇬🇧 Switch to English' : '🇫🇷 Passer en Français'}
            </button>

            {utilisateur ? (
              <>
                {utilisateur?.type_compte === 'admin' && (
                  <Link href="/admin" className="text-red-500 font-medium py-2 flex items-center gap-2">
                    <Shield size={16} />
                    {t('nav.admin')}
                  </Link>
                )}
                <Link href="/publier" className="text-green-600 font-medium py-2">+ {t('nav.publier')}</Link>
                <Link href="/messages" className="text-gray-600 font-medium py-2 flex items-center gap-2">
                  Messages
                  {nonLus > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {nonLus}
                    </span>
                  )}
                </Link>
                <Link href="/favoris" className="text-gray-600 font-medium py-2 flex items-center gap-2">
                  <Heart size={16} className="text-red-500" />
                  Mes favoris
                </Link>
                <Link href="/alertes" className="text-gray-600 font-medium py-2 flex items-center gap-2">
                  <BellRing size={16} className="text-blue-600" />
                  Mes alertes
                </Link>
                <Link href="/dashboard" className="text-gray-600 font-medium py-2">{t('profil.annonces')}</Link>
                <Link href="/parametres" className="text-gray-600 font-medium py-2">{t('nav.parametres')}</Link>
                <button onClick={deconnexion} className="text-red-500 font-medium py-2 text-left">{t('nav.deconnexion')}</button>
              </>
            ) : (
              <>
                <Link href="/connexion" className="text-blue-600 font-medium py-2">{t('nav.connexion')}</Link>
                <Link href="/inscription" className="text-blue-600 font-medium py-2">{t('nav.inscrire')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}