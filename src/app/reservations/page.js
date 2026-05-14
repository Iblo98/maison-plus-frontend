'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Home, Check, X, Clock, User, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Reservations() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [onglet, setOnglet] = useState('mes-reservations');
  const [mesReservations, setMesReservations] = useState([]);
  const [reservationsRecues, setReservationsRecues] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [paiementEnCours, setPaiementEnCours] = useState(null);
  const [contreProposition, setContreProposition] = useState({});
  const [showContreProposition, setShowContreProposition] = useState(null);

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

  const mettreAJourStatut = async (id, statut, dates = null) => {
    try {
      await api.put(`/reservations/${id}/statut`, {
        statut,
        dates_proposees: dates
      });
      const messages = {
        acceptee: '✅ Réservation acceptée !',
        confirmee: '✅ Réservation confirmée !',
        refusee: '❌ Réservation refusée',
        annulee: '🚫 Réservation annulée',
        contre_proposition: '📅 Contre-proposition envoyée !'
      };
      toast.success(messages[statut] || 'Mise à jour effectuée');
      setShowContreProposition(null);
      chargerDonnees();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  const payerReservation = async (reservation) => {
    setPaiementEnCours(reservation.id);
    try {
      // Simulation paiement 2 secondes
      await new Promise(resolve => setTimeout(resolve, 2000));
      await api.put(`/reservations/${reservation.id}/statut`, { statut: 'payee' });
      toast.success('🎉 Paiement effectué ! Votre réservation est confirmée.');
      chargerDonnees();
    } catch (err) {
      toast.error('Erreur lors du paiement');
    } finally {
      setPaiementEnCours(null);
    }
  };

  const getStatutBadge = (statut) => {
    const config = {
      en_attente: { label: 'En attente', color: 'bg-yellow-50 text-yellow-600', icon: Clock },
      acceptee: { label: 'Acceptée — Paiement requis', color: 'bg-blue-50 text-blue-600', icon: CreditCard },
      paiement_requis: { label: 'Paiement requis', color: 'bg-blue-50 text-blue-600', icon: CreditCard },
      payee: { label: 'Payée', color: 'bg-purple-50 text-purple-600', icon: Check },
      confirmee: { label: 'Confirmée', color: 'bg-green-50 text-green-600', icon: Check },
      refusee: { label: 'Refusée', color: 'bg-red-50 text-red-500', icon: X },
      annulee: { label: 'Annulée', color: 'bg-gray-50 text-gray-500', icon: X },
      contre_proposition: { label: 'Nouvelles dates proposées', color: 'bg-orange-50 text-orange-600', icon: Calendar },
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

          /* MES RÉSERVATIONS */
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
                          <h3 className="font-bold text-gray-800">{r.titre_annonce}</h3>
                          <p className="text-gray-400 text-sm">{r.quartier}, {r.ville}</p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            Propriétaire : {r.proprio_prenom} {r.proprio_nom}
                          </p>
                        </div>
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

                    {/* Contre-proposition reçue */}
                    {r.statut === 'contre_proposition' && r.dates_proposees && (
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 mb-3">
                        <p className="text-orange-700 font-medium text-sm mb-2">
                          📅 Le propriétaire propose de nouvelles dates :
                        </p>
                        <p className="text-orange-600 text-sm font-bold">
                          Du {formaterDate(r.dates_proposees.debut)} au {formaterDate(r.dates_proposees.fin)}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => router.push(`/reservations/nouvelle?annonce=${r.annonce_id}&debut=${r.dates_proposees.debut}&fin=${r.dates_proposees.fin}`)}
                            className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition">
                            Faire une nouvelle demande avec ces dates
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bouton payer si acceptée */}
                    {r.statut === 'acceptee' && (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-3">
                        <p className="text-green-700 font-medium text-sm mb-3">
                          🎉 Votre demande a été acceptée ! Payez pour confirmer votre place.
                        </p>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="text-gray-600">Montant à payer</span>
                          <span className="font-bold text-green-600 text-lg">{formaterPrix(r.prix_total)}</span>
                        </div>
                        <button
                          onClick={() => payerReservation(r)}
                          disabled={paiementEnCours === r.id}
                          className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                          {paiementEnCours === r.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                              Paiement en cours...
                            </>
                          ) : (
                            <>
                              <CreditCard size={18} />
                              Payer maintenant via Orange Money
                            </>
                          )}
                        </button>
                        <p className="text-center text-gray-400 text-xs mt-2">
                          🧪 Mode démonstration — aucun vrai paiement
                        </p>
                      </div>
                    )}

                    {/* Statut payée */}
                    {r.statut === 'payee' && (
                      <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-sm text-purple-700 flex items-center gap-2">
                        <Check size={16} />
                        Paiement effectué — En attente de confirmation d&apos;arrivée
                      </div>
                    )}

                    {/* Annuler si confirmée */}
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

          /* RÉSERVATIONS REÇUES */
          reservationsRecues.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <User size={64} className="text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune demande</h2>
              <p className="text-gray-500">Vous n&apos;avez pas encore reçu de demandes</p>
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
                        <h3 className="font-bold text-gray-800">{r.titre_annonce}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                          <User size={12} />
                          {r.prenom_locataire} {r.nom_locataire} — {r.telephone_locataire}
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

                    {/* Actions propriétaire */}
                    {r.statut === 'en_attente' && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <button onClick={() => mettreAJourStatut(r.id, 'acceptee')}
                            className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-1">
                            <Check size={16} />
                            Accepter
                          </button>
                          <button
                            onClick={() => setShowContreProposition(
                              showContreProposition === r.id ? null : r.id
                            )}
                            className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition flex items-center justify-center gap-1">
                            <Calendar size={16} />
                            Autres dates
                          </button>
                          <button onClick={() => mettreAJourStatut(r.id, 'refusee')}
                            className="flex-1 border border-red-300 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition flex items-center justify-center gap-1">
                            <X size={16} />
                            Refuser
                          </button>
                        </div>

                        {/* Formulaire contre-proposition */}
                        {showContreProposition === r.id && (
                          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 space-y-3">
                            <p className="text-orange-700 text-sm font-medium">
                              📅 Proposez de nouvelles dates disponibles
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Date de début</label>
                                <input type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  value={contreProposition[r.id]?.debut || ''}
                                  onChange={(e) => setContreProposition(prev => ({
                                    ...prev,
                                    [r.id]: { ...prev[r.id], debut: e.target.value }
                                  }))}
                                  className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Date de fin</label>
                                <input type="date"
                                  min={contreProposition[r.id]?.debut || new Date().toISOString().split('T')[0]}
                                  value={contreProposition[r.id]?.fin || ''}
                                  onChange={(e) => setContreProposition(prev => ({
                                    ...prev,
                                    [r.id]: { ...prev[r.id], fin: e.target.value }
                                  }))}
                                  className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const dates = contreProposition[r.id];
                                  if (!dates?.debut || !dates?.fin) {
                                    toast.error('Choisissez les deux dates');
                                    return;
                                  }
                                  mettreAJourStatut(r.id, 'contre_proposition', dates);
                                }}
                                className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition">
                                Envoyer la proposition
                              </button>
                              <button
                                onClick={() => setShowContreProposition(null)}
                                className="px-4 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Statut payée — confirmer arrivée */}
                    {r.statut === 'payee' && (
                      <div className="space-y-2">
                        <div className="bg-purple-50 rounded-xl p-3 text-sm text-purple-700 flex items-center gap-2">
                          <Check size={16} />
                          Paiement reçu — Confirmez l&apos;arrivée du locataire
                        </div>
                        <button
                          onClick={() => mettreAJourStatut(r.id, 'confirmee')}
                          className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                          <Check size={16} />
                          Confirmer l&apos;arrivée → Recevoir le paiement
                        </button>
                      </div>
                    )}

                    {/* Statut acceptée */}
                    {r.statut === 'acceptee' && (
                      <div className="bg-green-50 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
                        <Check size={16} />
                        Acceptée — En attente du paiement du locataire
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