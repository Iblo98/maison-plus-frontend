'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Gift, Copy, Check, Users, Star, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Parrainage() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [copie, setCopie] = useState(false);
  const [codeUtilise, setCodeUtilise] = useState('');
  const [annonces, setAnnonces] = useState([]);
  const [annonceChoisie, setAnnonceChoisie] = useState('');
  const [nbJours, setNbJours] = useState(7);

  useEffect(() => {
    if (!authChargement) {
      if (!utilisateur) { router.push('/connexion'); return; }
      chargerDonnees();
    }
  }, [utilisateur, authChargement]);

  const chargerDonnees = async () => {
    try {
      const [codeRes, annoncesRes] = await Promise.all([
        api.get('/parrainages/mon-code'),
        api.get('/profil/moi/annonces')
      ]);
      setData(codeRes.data);
      setAnnonces(annoncesRes.data.annonces || []);
    } catch (err) {
      toast.error('Erreur chargement');
    } finally {
      setChargement(false);
    }
  };

  const copierCode = async () => {
    try {
      await navigator.clipboard.writeText(data.code_parrainage);
      setCopie(true);
      toast.success('Code copié !');
      setTimeout(() => setCopie(false), 2000);
    } catch (err) {
      toast.error('Erreur copie');
    }
  };

  const copierLien = async () => {
    const lien = `${window.location.origin}/inscription?code=${data.code_parrainage}`;
    try {
      await navigator.clipboard.writeText(lien);
      toast.success('Lien copié !');
    } catch (err) {
      toast.error('Erreur copie');
    }
  };

  const utiliserCode = async (e) => {
    e.preventDefault();
    if (!codeUtilise) { toast.error('Entrez un code'); return; }
    try {
      const response = await api.post('/parrainages/utiliser-code', {
        code_parrainage: codeUtilise
      });
      toast.success(response.data.message);
      setCodeUtilise('');
      chargerDonnees();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  const utiliserCredits = async (e) => {
    e.preventDefault();
    if (!annonceChoisie) { toast.error('Choisissez une annonce'); return; }
    try {
      const response = await api.post('/parrainages/utiliser-credits', {
        annonce_id: annonceChoisie,
        nb_jours: nbJours
      });
      toast.success(response.data.message);
      chargerDonnees();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl mb-6"/>
          <div className="h-48 bg-gray-200 rounded-2xl"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Programme de parrainage</h1>
          <p className="text-gray-500">
            Parrainez vos amis et gagnez des jours de sponsorisation gratuite !
          </p>
        </div>

        {/* Comment ça marche */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Comment ça marche ?</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icone: '📤', titre: 'Partagez', desc: 'Envoyez votre code à vos amis' },
              { icone: '👤', titre: 'Ils s\'inscrivent', desc: 'Ils utilisent votre code à l\'inscription' },
              { icone: '🎁', titre: 'Vous gagnez', desc: '7 jours de sponsorisation gratuite !' },
            ].map((etape, i) => (
              <div key={i} className="text-center p-4 bg-blue-50 rounded-xl">
                <span className="text-3xl">{etape.icone}</span>
                <p className="font-bold text-gray-800 mt-2">{etape.titre}</p>
                <p className="text-gray-500 text-xs mt-1">{etape.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mon code */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Mon code de parrainage</h2>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              <Star size={14} className="inline mr-1" />
              {data?.credits_disponibles || 0} crédits
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-xl p-4 flex items-center justify-between mb-4">
            <span className="text-3xl font-black tracking-widest">
              {data?.code_parrainage}
            </span>
            <button onClick={copierCode}
              className="bg-white text-blue-600 px-3 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-50 transition">
              {copie ? <Check size={16} /> : <Copy size={16} />}
              {copie ? 'Copié !' : 'Copier'}
            </button>
          </div>

          <button onClick={copierLien}
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-xl text-sm font-medium transition">
            📎 Copier le lien d&apos;invitation
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Filleuls', value: data?.stats?.total_filleuls || 0 },
              { label: 'Actifs', value: data?.stats?.filleuls_actifs || 0 },
              { label: 'Crédits gagnés', value: data?.stats?.total_credits || 0 },
            ].map((stat) => (
              <div key={stat.label} className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Utiliser un code */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users size={20} className="text-green-500" />
              Utiliser un code
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Vous avez été parrainé ? Entrez le code pour gagner 3 jours gratuits !
            </p>
            <form onSubmit={utiliserCode} className="space-y-3">
              <input type="text" value={codeUtilise}
                onChange={(e) => setCodeUtilise(e.target.value.toUpperCase())}
                placeholder="Ex: MPAB1234"
                maxLength={8}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition font-mono text-center text-lg tracking-widest"
              />
              <button type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition">
                Appliquer le code
              </button>
            </form>
          </div>

          {/* Utiliser les crédits */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              Utiliser mes crédits
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Vous avez <strong>{data?.credits_disponibles || 0} jours</strong> de sponsorisation disponibles !
            </p>
            <form onSubmit={utiliserCredits} className="space-y-3">
              <select value={annonceChoisie}
                onChange={(e) => setAnnonceChoisie(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition">
                <option value="">Choisir une annonce</option>
                {annonces.map(a => (
                  <option key={a.id} value={a.id}>{a.titre}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input type="number" value={nbJours}
                  onChange={(e) => setNbJours(parseInt(e.target.value))}
                  min={1} max={data?.credits_disponibles || 0}
                  className="w-24 border border-gray-300 rounded-xl px-3 py-3 outline-none focus:border-blue-500 transition text-center"
                />
                <span className="text-gray-500 text-sm">jours de sponsorisation</span>
              </div>
              <button type="submit"
                disabled={!data?.credits_disponibles}
                className="w-full bg-yellow-500 text-white py-3 rounded-xl font-medium hover:bg-yellow-600 transition disabled:opacity-50">
                Sponsoriser avec mes crédits
              </button>
            </form>
          </div>
        </div>

        {/* Liste filleuls */}
        {data?.filleuls?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Mes filleuls ({data.filleuls.length})
            </h2>
            <div className="space-y-3">
              {data.filleuls.map((filleul) => (
                <div key={filleul.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">
                      {filleul.prenom} {filleul.nom}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Inscrit le {new Date(filleul.filleul_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      filleul.statut === 'complete'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {filleul.statut === 'complete' ? '✅ Actif' : '⏳ En attente'}
                    </span>
                    <span className="text-xs text-blue-600 font-bold">
                      +{filleul.credits_gagnes} jours
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}