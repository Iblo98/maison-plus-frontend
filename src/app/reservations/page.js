'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Home, Check, X, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Reservations() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [onglet, setOnglet] = useState('mes-reservations');
  const [mesReservations, setMesReservations] = useState([]);
  const [reservationsRecues, setReservationsRecues] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      chargerDonnees();
    }
  }, [utilisateur, authChargement]);

  const chargerDonnees = async () => {
    try {
      const [mesRes, recuesRes] = await Promise.all([
        api.get('/reservations/mes-reservations'),
        api.get('/reservations/recues')
      ]);
      setMesReservations(mesRes.data.reservations || []);
      setReservationsRecues(recuesRes.data.reservations || []);
    } catch (err) {
      toast.error('Erreur chargement réservations');
    } finally {
      setChargement(false);
    }
  };

  const mettreAJourStatut = async (id, statut) => {
    try {
      await api.put(`/reservations/${id}/statut`, { statut });
      const messages = {
        confirmee: '✅ Réservation confirmée !',
        refusee: '❌ Réservation refusée',
        annulee: '🚫 Réservation annulée'
      };
      toast.success(messages[statut]);
      chargerDonnees();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  const getStatutBadge = (statut) => {
    const config = {
      en_attente: { label: 'En attente', color: 'bg-yellow-50 text-yellow-600', icon: Clock },
      confirmee: { label: 'Confirmée', color: 'bg-green-50 text-green-600', icon: Check },
      refusee: { label: 'Refusée', color: 'bg-red-50 text-red-500', icon: X },
      annulee: { label: 'Annulée', color: 'bg-gray-50 text-gray-500', icon: X },
    };
    return config[statut] || config.en_attente;
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';
  const formaterDate = (date) => new Date(date).toLocaleDateString('fr-FR');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 shadow-sm w-fit">
          <button onClick={() => setOnglet('mes-reservations')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              onglet === 'mes-reservations'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}>
            Mes réservations ({mesReservations.length})
          </button>
          <button onClick={() => setOnglet('recues')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              onglet === 'recues'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}>
            Reçues ({reservationsRecues.length})
            {reservationsRecues.filter(r => r.statut === 'en_attente').length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {reservationsRecues.filter(r => r.statut === 'en_attente').length}
              </span>
            )}
          </button>
        </div>

        {chargement ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"/>
            ))}
          </div>
        ) : onglet === 'mes-reservations' ? (
          mesReservations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Calendar size={64} className="text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation</h2>
              <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore fait de réservation</p>
              <Link href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                Explorer les annonces
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mesReservations.map((r) => {
                const badge = getStatutBadge(r.statut);
                const Icon = badge.icon;
                return (
                  <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                          {r.photo_annonce ? (
                            <img src={r.photo_annonce} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home size={20} className="text-blue-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{r.titre}</h3>
                          <p className="text-gray-400 text-sm">{r.quartier}, {r.ville}</p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        <Icon size={12} />
                        {badge.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-gray-400 text-xs">Début</p>
                        <p className="font-medium">{formaterDate(r.date_debut)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-gray-400 text-xs">Fin</p>
                        <p className="font-medium">{formaterDate(r.date_fin)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-gray-400 text-xs">Total</p>
                        <p className="font-bold text-blue-600">{formaterPrix(r.prix_total)}</p>
                      </div>
                    </div>
                    {r.statut === 'confirmee' && (
                      <button onClick={() => mettreAJourStatut(r.id, 'annulee')}
                        className="mt-3 w-full border border-red-300 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition">
                        Annuler la réservation
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          reservationsRecues.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <User size={64} className="text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune demande</h2>
              <p className="text-gray-500">Vous n&apos;avez pas encore reçu de demandes de réservation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservationsRecues.map((r) => {
                const badge = getStatutBadge(r.statut);
                const Icon = badge.icon;
                return (
                  <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{r.titre}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                          <User size={12} />
                          {r.locataire_prenom} {r.locataire_nom} — {r.locataire_telephone}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        <Icon size={12} />
                        {badge.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-gray-400 text-xs">Début</p>
                        <p className="font-medium">{formaterDate(r.date_debut)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-gray-400 text-xs">Fin</p>
                        <p className="font-medium">{formaterDate(r.date_fin)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-gray-400 text-xs">Total</p>
                        <p className="font-bold text-blue-600">{formaterPrix(r.prix_total)}</p>
                      </div>
                    </div>
                    {r.message && (
                      <div className="bg-gray-50 rounded-xl p-3 mb-3">
                        <p className="text-gray-600 text-sm italic">&quot;{r.message}&quot;</p>
                      </div>
                    )}
                    {r.statut === 'en_attente' && (
                      <div className="flex gap-2">
                        <button onClick={() => mettreAJourStatut(r.id, 'confirmee')}
                          className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-1">
                          <Check size={16} />
                          Confirmer
                        </button>
                        <button onClick={() => mettreAJourStatut(r.id, 'refusee')}
                          className="flex-1 border border-red-300 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition flex items-center justify-center gap-1">
                          <X size={16} />
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}