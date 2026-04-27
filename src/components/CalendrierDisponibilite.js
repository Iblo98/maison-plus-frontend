'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function CalendrierDisponibilite({ annonceId, estProprietaire = false }) {
  const [moisActuel, setMoisActuel] = useState(new Date());
  const [disponibilites, setDisponibilites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [nouveauPeriode, setNouveauPeriode] = useState({
    date_debut: '',
    date_fin: '',
    statut: 'indisponible',
    motif: ''
  });

  useEffect(() => {
    if (annonceId) chargerDisponibilites();
  }, [annonceId]);

  const chargerDisponibilites = async () => {
    try {
      const response = await api.get(`/disponibilites/annonce/${annonceId}`);
      setDisponibilites(response.data.disponibilites || []);
    } catch (err) {
      console.error('Erreur disponibilités:', err);
    } finally {
      setChargement(false);
    }
  };

  const ajouterPeriode = async () => {
    if (!nouveauPeriode.date_debut || !nouveauPeriode.date_fin) {
      toast.error('Dates obligatoires');
      return;
    }
    try {
      await api.post('/disponibilites', {
        annonce_id: annonceId,
        ...nouveauPeriode
      });
      toast.success('Période ajoutée !');
      setAjoutOuvert(false);
      setNouveauPeriode({ date_debut: '', date_fin: '', statut: 'indisponible', motif: '' });
      chargerDisponibilites();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  const supprimerPeriode = async (id) => {
    try {
      await api.delete(`/disponibilites/${id}`);
      toast.success('Période supprimée !');
      chargerDisponibilites();
    } catch (err) {
      toast.error('Erreur suppression');
    }
  };

  // Générer les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  // Vérifier si un jour est indisponible
  const estIndisponible = (date) => {
    return disponibilites.some(d => {
      const debut = new Date(d.date_debut);
      const fin = new Date(d.date_fin);
      const jour = new Date(date);
      debut.setHours(0,0,0,0);
      fin.setHours(23,59,59,999);
      jour.setHours(12,0,0,0);
      return jour >= debut && jour <= fin && d.statut === 'indisponible';
    });
  };

  const estAujourdhui = (year, month, day) => {
    const today = new Date();
    return today.getFullYear() === year &&
           today.getMonth() === month &&
           today.getDate() === day;
  };

  const estPasse = (year, month, day) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const date = new Date(year, month, day);
    return date < today;
  };

  const moisPrecedent = () => {
    setMoisActuel(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const moisSuivant = () => {
    setMoisActuel(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(moisActuel);

  const nomsMois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const nomsJours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" />
          Disponibilité
        </h2>
        {estProprietaire && (
          <button onClick={() => setAjoutOuvert(!ajoutOuvert)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            <Plus size={14} />
            Bloquer des dates
          </button>
        )}
      </div>

      {/* Formulaire ajout */}
      {ajoutOuvert && estProprietaire && (
        <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3">
          <h3 className="font-semibold text-blue-800 text-sm">Bloquer une période</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Date début</label>
              <input type="date" value={nouveauPeriode.date_debut}
                onChange={(e) => setNouveauPeriode({...nouveauPeriode, date_debut: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Date fin</label>
              <input type="date" value={nouveauPeriode.date_fin}
                onChange={(e) => setNouveauPeriode({...nouveauPeriode, date_fin: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <input type="text" placeholder="Motif (optionnel)"
            value={nouveauPeriode.motif}
            onChange={(e) => setNouveauPeriode({...nouveauPeriode, motif: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button onClick={ajouterPeriode}
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              Confirmer
            </button>
            <button onClick={() => setAjoutOuvert(false)}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={moisPrecedent}
          className="p-2 hover:bg-gray-100 rounded-xl transition">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <h3 className="font-semibold text-gray-800">
          {nomsMois[month]} {year}
        </h3>
        <button onClick={moisSuivant}
          className="p-2 hover:bg-gray-100 rounded-xl transition">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Grille calendrier */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {nomsJours.map(jour => (
          <div key={jour} className="text-center text-xs font-medium text-gray-400 py-1">
            {jour}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Jours vides avant le 1er */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Jours du mois */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const indisponible = estIndisponible(new Date(year, month, day));
          const aujourdhui = estAujourdhui(year, month, day);
          const passe = estPasse(year, month, day);

          return (
            <div key={day}
              className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition ${
                indisponible
                  ? 'bg-red-100 text-red-500 line-through'
                  : passe
                  ? 'text-gray-300'
                  : aujourdhui
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
              {day}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span className="text-xs text-gray-500">Aujourd&apos;hui</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-red-100 rounded" />
          <span className="text-xs text-gray-500">Indisponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <span className="text-xs text-gray-500">Disponible</span>
        </div>
      </div>

      {/* Liste des périodes bloquées */}
      {estProprietaire && disponibilites.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Périodes bloquées</h3>
          <div className="space-y-2">
            {disponibilites.map((d) => (
              <div key={d.id}
                className="flex items-center justify-between p-2 bg-red-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-red-700">
                    {new Date(d.date_debut).toLocaleDateString('fr-FR')} →{' '}
                    {new Date(d.date_fin).toLocaleDateString('fr-FR')}
                  </p>
                  {d.motif && <p className="text-xs text-red-400">{d.motif}</p>}
                </div>
                <button onClick={() => supprimerPeriode(d.id)}
                  className="text-red-400 hover:text-red-600 p-1 hover:bg-red-100 rounded-lg transition">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
