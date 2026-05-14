'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Trash2, MessageCircle, Home, Eye, CreditCard, Calendar, Gift, Star, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Notifications() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('toutes');

  useEffect(() => {
    if (!utilisateur) { router.push('/connexion'); return; }
    chargerNotifications();
  }, [utilisateur]);

  const chargerNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
    } catch (err) {
      toast.error('Erreur chargement notifications');
    } finally {
      setChargement(false);
    }
  };

  const marquerLue = async (id) => {
    try {
      await api.put(`/notifications/${id}/lu`);
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, est_lu: true } : n
      ));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const marquerToutesLues = async () => {
    try {
      await api.put('/notifications/toutes/lu');
      setNotifications(prev => prev.map(n => ({ ...n, est_lu: true })));
      toast.success('Toutes les notifications marquées comme lues');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const supprimerNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification supprimée');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const supprimerToutes = async () => {
    if (!confirm('Supprimer toutes les notifications ?')) return;
    try {
      await Promise.all(notifications.map(n => api.delete(`/notifications/${n.id}`)));
      setNotifications([]);
      toast.success('Toutes les notifications supprimées');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const handleClick = async (notif) => {
    await marquerLue(notif.id);
    if (notif.lien) router.push(notif.lien);
  };

  const getIcone = (type) => {
    switch (type) {
      case 'message': return <MessageCircle size={20} className="text-blue-500" />;
      case 'annonce': return <Home size={20} className="text-green-500" />;
      case 'vue': return <Eye size={20} className="text-purple-500" />;
      case 'paiement': return <CreditCard size={20} className="text-green-500" />;
      case 'reservation': return <Calendar size={20} className="text-orange-500" />;
      case 'parrainage': return <Gift size={20} className="text-pink-500" />;
      case 'bienvenue': return <Star size={20} className="text-yellow-500" />;
      case 'verification': return <Check size={20} className="text-green-500" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getCouleur = (type) => {
    switch (type) {
      case 'paiement': return 'bg-green-100';
      case 'reservation': return 'bg-orange-100';
      case 'message': return 'bg-blue-100';
      case 'bienvenue': return 'bg-yellow-100';
      case 'verification': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const formaterTemps = (date) => {
    const diff = new Date() - new Date(date);
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)} jours`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const filtres = [
    { id: 'toutes', label: 'Toutes' },
    { id: 'non_lues', label: 'Non lues' },
    { id: 'reservation', label: 'Réservations' },
    { id: 'paiement', label: 'Paiements' },
    { id: 'message', label: 'Messages' },
  ];

  const notificationsFiltrees = notifications.filter(n => {
    if (filtre === 'toutes') return true;
    if (filtre === 'non_lues') return !n.est_lu;
    return n.type === filtre;
  });

  const nonLues = notifications.filter(n => !n.est_lu).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell size={28} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {nonLues > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full font-bold">
                {nonLues}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {nonLues > 0 && (
              <button onClick={marquerToutesLues}
                className="flex items-center gap-2 text-sm text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition">
                <CheckCheck size={16} />
                Tout lire
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={supprimerToutes}
                className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition">
                <Trash2 size={16} />
                Tout supprimer
              </button>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {filtres.map(f => (
            <button key={f.id}
              onClick={() => setFiltre(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filtre === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:border-blue-300'
              }`}>
              {f.label}
              {f.id === 'non_lues' && nonLues > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {nonLues}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Liste */}
        {chargement ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse"/>
            ))}
          </div>
        ) : notificationsFiltrees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Bell size={64} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune notification</h2>
            <p className="text-gray-500">
              {filtre === 'non_lues' ? 'Toutes vos notifications ont été lues !' : 'Vous n\'avez pas encore de notifications'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notificationsFiltrees.map((notif) => (
              <div key={notif.id}
                onClick={() => handleClick(notif)}
                className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition hover:shadow-md ${
                  !notif.est_lu ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-100'
                }`}>

                {/* Icône */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  !notif.est_lu ? getCouleur(notif.type) : 'bg-gray-100'
                }`}>
                  {getIcone(notif.type)}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${
                      !notif.est_lu ? 'font-bold text-gray-800' : 'font-medium text-gray-700'
                    }`}>
                      {notif.titre}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.est_lu && (
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"/>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); supprimerNotification(notif.id); }}
                        className="text-gray-300 hover:text-red-500 transition p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-xs text-gray-400">{formaterTemps(notif.created_at)}</p>
                    {notif.lien && (
                      <span className="text-xs text-blue-500 font-medium">Voir →</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}