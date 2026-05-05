'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLangue } from '../context/LangueContext';
import { Home, Plus, MessageCircle, User, LogOut, Menu, X, Settings, Shield, Heart, BellRing, Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import Notifications from './Notifications';

export default function Navbar() {
  const { utilisateur, deconnexion } = useAuth();
  const { langue, changerLangue, t } = useLangue();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [nonLus, setNonLus] = useState(0);
  const [outilsOpen, setOutilsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const outilsRef = useRef(null);
  const profileRef = useRef(null);

  // Fermer dropdowns en cliquant dehors
  useEffect(() => {
    function handleClick(e) {
      if (outilsRef.current && !outilsRef.current.contains(e.target)) setOutilsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

  const initiales = utilisateur
    ? `${utilisateur.prenom?.[0] ?? ''}${utilisateur.nom?.[0] ?? ''}`.toUpperCase()
    : '?';

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

          {/* Liens nav desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/annonces" className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50">
              {t('nav.annonces')}
            </Link>
            <Link href="/recherche" className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
              <Search size={14} /> Recherche
            </Link>
            <Link href="/marche" className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50">
              📊 Marché
            </Link>
            <Link href="/annonces?categorie=maison" className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50">
              {t('nav.maisons')}
            </Link>
            <Link href="/annonces?categorie=marketplace" className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50">
              {t('nav.marketplace')}
            </Link>
            <Link href="/annonces?categorie=restaurant" className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50">
              {t('nav.restaurants')}
            </Link>
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-2">

            {utilisateur ? (
              <>
                {/* Bouton Publier */}
                <Link href="/publier"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                  <Plus size={16} />
                  {t('nav.publier')}
                </Link>

                {/* DROPDOWN OUTILS */}
                <div ref={outilsRef} className="relative">
                  <button
                    onClick={() => { setOutilsOpen(v => !v); setProfileOpen(false); }}
                    className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Outils <ChevronDown size={14} className={`transition-transform ${outilsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {outilsOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-gray-100 rounded-xl shadow-lg p-1.5 w-56 z-50">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold px-2 py-1">Outils & Services</p>

                      <Link href="/estimation" onClick={() => setOutilsOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition">
                        <span className="text-base w-5 text-center">🧠</span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-gray-700">Estimation IA</span>
                          <span className="block text-xs text-gray-400">Prix estimé en 30s</span>
                        </span>
                      </Link>

                      <Link href="/simulation-credit" onClick={() => setOutilsOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition">
                        <span className="text-base w-5 text-center">🏦</span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-gray-700">Simulation crédit</span>
                          <span className="block text-xs text-gray-400">Calculez vos mensualités</span>
                        </span>
                      </Link>

                      <Link href="/parrainage" onClick={() => setOutilsOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition">
                        <span className="text-base w-5 text-center">🎁</span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-gray-700">Parrainage</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">500 pts</span>
                      </Link>

                      <Link href="/premium" onClick={() => setOutilsOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition">
                        <span className="text-base w-5 text-center">👑</span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-gray-700">Premium</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">Pro</span>
                      </Link>

                      {utilisateur?.type_compte === 'admin' && (
                        <>
                          <div className="h-px bg-gray-100 my-1" />
                          <Link href="/admin" onClick={() => setOutilsOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-50 transition">
                            <Shield size={15} className="text-red-500 w-5" />
                            <span className="block text-sm font-medium text-red-500">Administration</span>
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Icône Messages */}
                <Link href="/messages" className="relative w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition">
                  <MessageCircle size={18} />
                  {nonLus > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {nonLus > 9 ? '9+' : nonLus}
                    </span>
                  )}
                </Link>

                {/* Icône Favoris */}
                <Link href="/favoris" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-red-500 hover:bg-gray-50 transition">
                  <Heart size={18} />
                </Link>

                {/* Icône Alertes */}
                <Link href="/alertes" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition">
                  <BellRing size={18} />
                </Link>

                {/* Notifications (composant existant) */}
                <Notifications />

                {/* Langue */}
                <button
                  onClick={() => changerLangue(langue === 'fr' ? 'en' : 'fr')}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition text-xs font-medium">
                  {langue === 'fr' ? 'EN' : 'FR'}
                </button>

                {/* DROPDOWN PROFIL (avatar) */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => { setProfileOpen(v => !v); setOutilsOpen(false); }}
                    className="w-9 h-9 rounded-full bg-blue-50 border border-gray-200 flex items-center justify-center text-blue-700 text-xs font-bold hover:bg-blue-100 transition overflow-hidden"
                  >
                    {utilisateur?.photo
                      ? <img src={utilisateur.photo} alt="avatar" className="w-full h-full object-cover" />
                      : initiales
                    }
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-gray-100 rounded-xl shadow-lg p-1.5 w-52 z-50">
                      {/* En-tête */}
                      <div className="px-2.5 py-2 pb-3">
                        <p className="text-sm font-semibold text-gray-800">{utilisateur.prenom} {utilisateur.nom}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{utilisateur.email}</p>
                        {utilisateur.badge_pro && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">👑 Premium actif</span>
                        )}
                      </div>
                      <div className="h-px bg-gray-100 mb-1" />

                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700">
                        <User size={15} className="text-gray-400" /> Mon espace
                      </Link>
                      <Link href="/mes-annonces" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700">
                        <span className="text-sm w-4 text-center">📋</span> Mes annonces
                      </Link>
                      <Link href="/reservations" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700">
                        <span className="text-sm w-4 text-center">📅</span> Réservations
                      </Link>
                      <Link href="/chat-support" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700">
                        <span className="text-sm w-4 text-center">🤖</span> Assistant virtuel
                      </Link>

                      <div className="h-px bg-gray-100 my-1" />

                      <Link href="/parametres" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700">
                        <Settings size={15} className="text-gray-400" /> Paramètres
                      </Link>
                      <button onClick={() => { setProfileOpen(false); deconnexion(); }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-50 transition text-sm text-red-500">
                        <LogOut size={15} /> {t('nav.deconnexion')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => changerLangue(langue === 'fr' ? 'en' : 'fr')}
                  className="flex items-center gap-1 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:border-blue-600 hover:text-blue-600 transition">
                  {langue === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
                </button>
                <Link href="/connexion" className="text-blue-600 font-medium hover:underline text-sm">
                  {t('nav.connexion')}
                </Link>
                <Link href="/inscription"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                  {t('nav.inscrire')}
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button className="md:hidden" onClick={() => setMenuOuvert(!menuOuvert)}>
            {menuOuvert ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOuvert && (
          <div className="md:hidden py-4 border-t flex flex-col gap-1">
            <Link href="/annonces" className="text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">{t('nav.annonces')}</Link>
            <Link href="/recherche" className="text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Search size={16} className="text-blue-600" /> Recherche avancée
            </Link>
            <Link href="/annonces?categorie=maison" className="text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">{t('nav.maisons')}</Link>
            <Link href="/annonces?categorie=marketplace" className="text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">{t('nav.marketplace')}</Link>
            <Link href="/annonces?categorie=restaurant" className="text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">{t('nav.restaurants')}</Link>

            <button
              onClick={() => changerLangue(langue === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-2 border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium w-fit mx-3 mt-1">
              {langue === 'fr' ? '🇬🇧 Switch to English' : '🇫🇷 Passer en Français'}
            </button>

            {utilisateur ? (
              <div className="flex flex-col gap-1 mt-2">
                {utilisateur?.type_compte === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 text-red-500 font-medium px-3 py-2 rounded-lg hover:bg-red-50">
                    <Shield size={16} /> {t('nav.admin')}
                  </Link>
                )}
                <Link href="/publier" className="flex items-center gap-2 text-white bg-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-700 mx-0">
                  <Plus size={16} /> {t('nav.publier')}
                </Link>

                <div className="h-px bg-gray-100 my-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold px-3">Outils</p>
                <Link href="/estimation" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">🧠 Estimation IA</Link>
                <Link href="/simulation-credit" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">🏦 Simulation crédit</Link>
                <Link href="/parrainage" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">🎁 Parrainage</Link>
                <Link href="/premium" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">👑 Premium</Link>
                <Link href="/marche" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">📊 Marché</Link>

                <div className="h-px bg-gray-100 my-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold px-3">Mon compte</p>
                <Link href="/messages" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
                  <MessageCircle size={16} /> Messages
                  {nonLus > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{nonLus}</span>}
                </Link>
                <Link href="/favoris" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><Heart size={16} className="text-red-500" /> Favoris</Link>
                <Link href="/alertes" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><BellRing size={16} className="text-blue-600" /> Alertes</Link>
                <Link href="/reservations" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">📅 Réservations</Link>
                <Link href="/chat-support" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">🤖 Assistant virtuel</Link>
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><User size={16} /> Mon espace</Link>
                <Link href="/parametres" className="flex items-center gap-2 text-gray-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><Settings size={16} /> Paramètres</Link>
                <button onClick={deconnexion} className="flex items-center gap-2 text-red-500 font-medium px-3 py-2 rounded-lg hover:bg-red-50 text-left">
                  <LogOut size={16} /> {t('nav.deconnexion')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-2">
                <Link href="/connexion" className="text-blue-600 font-medium px-3 py-2">{t('nav.connexion')}</Link>
                <Link href="/inscription" className="text-blue-600 font-medium px-3 py-2">{t('nav.inscrire')}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}