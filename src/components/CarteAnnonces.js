'use client';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

export default function CarteAnnonces({ annonces = [] }) {
  const [estCote, setEstCote] = useState(false);

  useEffect(() => {
    setEstCote(true);
  }, []);

  if (!estCote) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center animate-pulse">
        <MapPin size={32} className="text-gray-400" />
      </div>
    );
  }

  return <CarteClient annonces={annonces} />;
}

function CarteClient({ annonces }) {
  useEffect(() => {
    // Charger Leaflet dynamiquement
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    // Corriger les icônes Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Supprimer la carte existante
    const container = document.getElementById('carte-annonces');
    if (!container) return;
    if (container._leaflet_id) {
      container._leaflet_id = null;
      container.innerHTML = '';
    }

    // Créer la carte centrée sur Ouagadougou
    const carte = L.map('carte-annonces').setView([12.3569, -1.5353], 12);

    // Tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(carte);

    // Ajouter les marqueurs
    annonces.forEach((annonce) => {
      if (annonce.latitude && annonce.longitude) {
        const couleur = annonce.type_transaction === 'location' ? '#2563EB' : '#16A34A';

        // Icône personnalisée
        const icone = L.divIcon({
          html: `
            <div style="
              background: ${couleur};
              color: white;
              padding: 4px 8px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 2px solid white;
            ">
              ${new Intl.NumberFormat('fr-FR').format(annonce.prix)} XOF
            </div>
          `,
          className: '',
          iconAnchor: [40, 15]
        });

        const marqueur = L.marker([annonce.latitude, annonce.longitude], { icon: icone });

        marqueur.bindPopup(`
          <div style="min-width: 200px; font-family: Arial, sans-serif;">
            ${annonce.photo_principale
              ? `<img src="${annonce.photo_principale}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />`
              : ''
            }
            <div style="font-weight:bold; font-size:13px; margin-bottom:4px;">${annonce.titre}</div>
            <div style="color:#6B7280; font-size:12px; margin-bottom:6px;">📍 ${annonce.quartier || ''}, ${annonce.ville}</div>
            <div style="color:#F97316; font-weight:bold; font-size:14px; margin-bottom:8px;">
              ${new Intl.NumberFormat('fr-FR').format(annonce.prix)} XOF
              ${annonce.type_transaction === 'location' ? '/mois' : ''}
            </div>
            <a href="/annonces/${annonce.id}"
              style="display:block; background:#2563EB; color:white; text-align:center; padding:8px; border-radius:8px; text-decoration:none; font-size:12px; font-weight:bold;">
              Voir l'annonce →
            </a>
          </div>
        `);

        marqueur.addTo(carte);
      }
    });

    // Si aucun marqueur, centrer sur Ouagadougou
    const annoncesAvecCoords = annonces.filter(a => a.latitude && a.longitude);
    if (annoncesAvecCoords.length > 0) {
      const bounds = L.latLngBounds(
        annoncesAvecCoords.map(a => [a.latitude, a.longitude])
      );
      carte.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      carte.remove();
    };
  }, [annonces]);

  return (
    <div id="carte-annonces" className="w-full h-96 rounded-2xl overflow-hidden z-0" />
  );
}