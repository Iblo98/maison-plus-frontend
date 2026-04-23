'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, MessageCircle, Home, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Link from 'next/link';
import io from 'socket.io-client';

export default function Notifications() {
  const { utilisateur } = useAuth();
  const [ouvert, setOuvert] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [socket, setSocket] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (utilisateur) {
      chargerNotifications();
      initialiserSocket();
    }
    return () => { if (socket) socket.disconnect(); };
  }, [utilisateur]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOuvert(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initialiserSocket = () => {
    const s = io('http://localhost:3000');
    s.on('connect', () => s.emit('rejoindre', utilisateur.id));
    s.on('nouvelle_notification', (notif) => {
      setNotifications(prev => [{
        id: Date.now(),
        ...notif,
        est_lu: false,
        created_at: new Date().toISOString()
      }, ...prev]);
      setNonLues(prev => prev + 1);
    });
    setSocket(s);
  };

  const chargerNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
      setNonLues(response.data.non_lues || 0);
    } catch (err) {
      console.error('Erreur notifications:', err);
    }
  };

  const marquerToutesLues = async () => {
    try {
      await api.put('/notifications/toutes/lu');
      setNotifications(prev => prev.map(n => ({ ...n, est_lu: true })));
      setNonLues(0);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const supprimerNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const marquerLue = async (id) => {
    try {
      await api.put(`/notifications/${id}/lu`);
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, est_lu: true } : n
      ));
      setNonLues(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const getIcone = (type) => {
    switch (type) {
      case 'message': return <MessageCircle size={16} className="text-blue-500" />;
      case 'annonce': return <Home size={16} className="text-green-500" />;
      case 'vue': return <Eye size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formaterTemps = (date) => {
    const diff = new Date() - new Date(date);
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}j`;
  };

  if (!utilisateur) return null;

  return (
    <div className="relative" ref={ref}>
      {/* Bouton cloche */}
      <button
        onClick={() => { setOuvert(!ouvert); if (!ouvert) chargerNotifications(); }}
        className="relative text-gray-600 hover:text-blue-600 transition p-1">
        <Bell size={24} />
        {nonLues > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {nonLues > 9 ? '9+' : nonLues}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {ouvert && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {nonLues > 0 && (
              <button onClick={marquerToutesLues}
                className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                <Check size={12} />
                Tout marquer lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id}
                  onClick={() => { marquerLue(notif.id); setOuvert(false); }}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition ${
                    !notif.est_lu ? 'bg-blue-50' : ''
                  }`}>

                  {/* Icône type */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !notif.est_lu ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getIcone(notif.type)}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    {notif.lien ? (
                      <Link href={notif.lien}>
                        <p className={`text-sm ${!notif.est_lu ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                          {notif.titre}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{notif.message}</p>
                      </Link>
                    ) : (
                      <>
                        <p className={`text-sm ${!notif.est_lu ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                          {notif.titre}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{notif.message}</p>
                      </>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formaterTemps(notif.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notif.est_lu && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"/>
                    )}
                    <button
                      onClick={(e) => supprimerNotification(notif.id, e)}
                      className="text-gray-300 hover:text-red-500 transition p-1">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <Link href="/notifications" onClick={() => setOuvert(false)}
                className="text-blue-600 text-sm hover:underline">
                Voir toutes les notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}