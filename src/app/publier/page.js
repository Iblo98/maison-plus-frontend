'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Home, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Publier() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const [etape, setEtape] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [annonceId, setAnnonceId] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    categorie: 'maison',
    type_transaction: 'location',
    prix: '',
    periode: 'mois',
    superficie: '',
    nb_pieces: '',
    ville: '',
    quartier: '',
    adresse_complete: '',
    disponible_du: new Date().toISOString().split('T')[0],
    disponible_au: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const verifierKYC = async () => {
    try {
      const kycResponse = await api.get('/kyc/statut');
      const kyc = kycResponse.data;
      if (!kyc.etapes.photo_profil) {
        toast.error('Ajoutez une photo de profil avant de publier');
        router.push('/kyc');
        return false;
      }
      if (!kyc.etapes.cnib_soumise) {
        toast.error('Soumettez votre CNIB ou passeport avant de publier');
        router.push('/kyc');
        return false;
      }
      if (!kyc.etapes.paiement_configure) {
        toast.error('Configurez votre Mobile Money avant de publier');
        router.push('/kyc');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Erreur KYC:', err);
      return true;
    }
  };

  const passerEtape2 = async () => {
    if (!utilisateur) {
      toast.error('Connectez-vous pour publier');
      router.push('/connexion');
      return;
    }
    const kycOk = await verifierKYC();
    if (kycOk) setEtape(2);
  };

  const soumettreAnnonce = async () => {
    setChargement(true);
    try {
      const donneesAnnonce = { ...form };
      if (!donneesAnnonce.disponible_au) {
        delete donneesAnnonce.disponible_au;
      }
      const response = await api.post('/annonces', donneesAnnonce);
      const id = response.data.annonce.id;
      setAnnonceId(id);
      toast.success('Annonce créée ! Ajoutez maintenant les photos.');
      setEtape(3);
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur lors de la publication');
    } finally {
      setChargement(false);
    }
  };

  const uploadMedias = async () => {
    if (photos.length < 2) {
      toast.error('Minimum 2 photos obligatoires');
      return;
    }
    setChargement(true);
    try {
      const token = localStorage.getItem('token');

      // Upload photos
      const formDataPhotos = new FormData();
      photos.forEach(photo => formDataPhotos.append('photos', photo));
      const photoRes = await fetch(`http://localhost:3000/api/medias/${annonceId}/photos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataPhotos
      });
      const photoData = await photoRes.json();
      if (!photoData.succes) {
        toast.error(photoData.message);
        setChargement(false);
        return;
      }

      // Upload vidéos si présentes
      if (videos.length > 0) {
        const formDataVideos = new FormData();
        videos.forEach(video => formDataVideos.append('videos', video));
        await fetch(`http://localhost:3000/api/medias/${annonceId}/videos`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataVideos
        });
      }

      toast.success('Annonce publiée avec succès !');
      router.push('/dashboard');
    } catch (erreur) {
      toast.error('Erreur upload médias');
    } finally {
      setChargement(false);
    }
  };

  const ajouterPhotos = (e) => {
    const fichiers = Array.from(e.target.files);
    if (photos.length + fichiers.length > 5) {
      toast.error('Maximum 5 photos');
      return;
    }
    setPhotos([...photos, ...fichiers]);
  };

  const supprimerPhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const ajouterVideos = (e) => {
    const fichiers = Array.from(e.target.files);
    if (videos.length + fichiers.length > 4) {
      toast.error('Maximum 4 vidéos');
      return;
    }
    setVideos([...videos, ...fichiers]);
  };

  const supprimerVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const categories = [
    { id: 'maison', label: 'Maison' },
    { id: 'parcelle', label: 'Parcelle' },
    { id: 'hotel', label: 'Hôtel' },
    { id: 'marketplace', label: 'Objet' },
    { id: 'restaurant', label: 'Restaurant' },
  ];

  const periodes = [
    { id: 'heure', label: '/heure' },
    { id: 'jour', label: '/jour' },
    { id: 'semaine', label: '/semaine' },
    { id: 'mois', label: '/mois' },
    { id: 'annee', label: '/an' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Publier une annonce</h1>
        <p className="text-gray-500 mb-6">Remplissez les informations de votre bien</p>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                etape >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>{i}</div>
              {i < 3 && <div className={`flex-1 h-1 rounded ${etape > i ? 'bg-blue-600' : 'bg-gray-200'}`}/>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* Etape 1 — Informations */}
          {etape === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Informations</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button key={cat.id} type="button"
                      onClick={() => setForm({ ...form, categorie: cat.id })}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition ${
                        form.categorie === cat.id
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['location', 'vente'].map((type) => (
                    <button key={type} type="button"
                      onClick={() => setForm({ ...form, type_transaction: type })}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition capitalize ${
                        form.type_transaction === type
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre <span className="text-red-500">*</span></label>
                <input type="text" name="titre" value={form.titre} onChange={handleChange}
                  placeholder="Ex: Belle villa 4 chambres à Ouaga 2000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Décrivez votre bien en détail..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Prix + période */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (XOF) <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input type="number" name="prix" value={form.prix} onChange={handleChange}
                    placeholder="150000"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                  {form.type_transaction === 'location' && (
                    <select name="periode" value={form.periode} onChange={handleChange}
                      className="border border-gray-300 rounded-xl px-3 py-3 outline-none focus:border-blue-500 transition">
                      {periodes.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
                  <input type="number" name="superficie" value={form.superficie} onChange={handleChange}
                    placeholder="200"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nb pièces</label>
                  <input type="number" name="nb_pieces" value={form.nb_pieces} onChange={handleChange}
                    placeholder="4"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
                <input type="text" name="ville" value={form.ville} onChange={handleChange}
                  placeholder="Ouagadougou"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                <input type="text" name="quartier" value={form.quartier} onChange={handleChange}
                  placeholder="Ouaga 2000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <input type="text" name="adresse_complete" value={form.adresse_complete} onChange={handleChange}
                  placeholder="Secteur 15, Rue 12.45, Porte 27"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Disponibilité */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponible dès <span className="text-red-500">*</span>
                  </label>
                  <input type="date" name="disponible_du" value={form.disponible_du} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jusqu&apos;au <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <input type="date" name="disponible_au" value={form.disponible_au} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                  <p className="text-gray-400 text-xs mt-1">Laissez vide si indéfini</p>
                </div>
              </div>

              {/* Résumé */}
              {form.titre && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Home size={16} />
                    Résumé
                  </h3>
                  <p className="text-blue-700 text-sm"><strong>Titre :</strong> {form.titre}</p>
                  <p className="text-blue-700 text-sm"><strong>Type :</strong> {form.type_transaction} — {form.categorie}</p>
                  <p className="text-blue-700 text-sm">
                    <strong>Prix :</strong> {form.prix ? new Intl.NumberFormat('fr-FR').format(form.prix) + ' XOF' : '-'}
                    {form.type_transaction === 'location' && ` /${form.periode}`}
                  </p>
                  {form.ville && <p className="text-blue-700 text-sm"><strong>Ville :</strong> {form.ville}</p>}
                </div>
              )}

              <button onClick={passerEtape2}
                disabled={!form.titre || !form.prix || !form.ville}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                Continuer
              </button>
            </div>
          )}

          {/* Etape 2 — Confirmation */}
          {etape === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Confirmer l&apos;annonce</h2>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-gray-700"><strong>Titre :</strong> {form.titre}</p>
                <p className="text-gray-700"><strong>Catégorie :</strong> {form.categorie}</p>
                <p className="text-gray-700"><strong>Type :</strong> {form.type_transaction}</p>
                <p className="text-gray-700">
                  <strong>Prix :</strong> {new Intl.NumberFormat('fr-FR').format(form.prix)} XOF
                  {form.type_transaction === 'location' && ` /${form.periode}`}
                </p>
                <p className="text-gray-700"><strong>Ville :</strong> {form.ville} {form.quartier && `— ${form.quartier}`}</p>
                {form.adresse_complete && <p className="text-gray-700"><strong>Adresse :</strong> {form.adresse_complete}</p>}
                <p className="text-gray-700"><strong>Disponible dès :</strong> {form.disponible_du}</p>
                {form.disponible_au
                  ? <p className="text-gray-700"><strong>Jusqu&apos;au :</strong> {form.disponible_au}</p>
                  : <p className="text-gray-400 text-sm">Date de fin : indéfinie</p>
                }
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEtape(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:border-gray-400 transition">
                  Retour
                </button>
                <button onClick={soumettreAnnonce} disabled={chargement}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                  {chargement ? 'Création...' : 'Confirmer'}
                </button>
              </div>
            </div>
          )}

          {/* Etape 3 — Photos et vidéos */}
          {etape === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800">Photos et vidéos</h2>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(minimum 2, maximum 5)</span>
                </label>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                          Principale
                        </span>
                      )}
                      <button onClick={() => supprimerPhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {photos.length < 5 && (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl h-24 flex items-center justify-center hover:border-blue-400 transition cursor-pointer">
                      <Upload size={24} className="text-gray-300" />
                      <input type="file" accept="image/*" multiple onChange={ajouterPhotos}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-xs">La première photo sera la photo principale de l&apos;annonce</p>
              </div>

              {/* Vidéos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéos <span className="text-gray-400 font-normal">(optionnel, maximum 4)</span>
                </label>

                <div className="space-y-2 mb-3">
                  {videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2">
                      <span className="text-gray-600 text-sm truncate">{video.name}</span>
                      <button onClick={() => supprimerVideo(index)}
                        className="text-red-500 hover:text-red-700 ml-2">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {videos.length < 4 && (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer">
                    <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                    <p className="text-gray-400 text-sm">Cliquez pour ajouter une vidéo</p>
                    <p className="text-gray-400 text-xs">MP4 ou MOV — Max 100MB — 10s à 3min</p>
                    <input type="file" accept="video/*" multiple onChange={ajouterVideos}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                )}
              </div>

              <button onClick={uploadMedias}
                disabled={chargement || photos.length < 2}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50">
                {chargement ? 'Publication...' : `Publier l'annonce (${photos.length} photo${photos.length > 1 ? 's' : ''})`}
              </button>

              {photos.length < 2 && (
                <p className="text-center text-orange-500 text-sm">
                  ⚠️ Ajoutez au moins 2 photos pour publier
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}