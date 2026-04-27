'use client';
import { useState } from 'react';
import { Share2, MessageCircle, Link, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BoutonPartage({ annonce }) {
  const [ouvert, setOuvert] = useState(false);
  const [copie, setCopie] = useState(false);

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/annonces/${annonce.id}`
    : '';

  const texte = `🏠 ${annonce.titre} — ${new Intl.NumberFormat('fr-FR').format(annonce.prix)} XOF à ${annonce.ville}\n\nVoir sur Maison+ : ${url}`;

  const partagerWhatsApp = () => {
    const lien = `https://wa.me/?text=${encodeURIComponent(texte)}`;
    window.open(lien, '_blank');
    setOuvert(false);
  };

  const partagerFacebook = () => {
    const lien = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(lien, '_blank');
    setOuvert(false);
  };

  const copierLien = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopie(false), 2000);
    } catch (err) {
      toast.error('Erreur copie');
    }
    setOuvert(false);
  };

  const partagerNatif = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: annonce.titre,
          text: texte,
          url: url
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      setOuvert(!ouvert);
    }
  };

  return (
    <div className="relative">
      <button onClick={partagerNatif}
        className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition">
        <Share2 size={16} />
        Partager
      </button>

      {/* Menu partage */}
      {ouvert && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setOuvert(false)} />

          <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl z-50 overflow-hidden w-56 border border-gray-100">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">Partager l&apos;annonce</span>
              <button onClick={() => setOuvert(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="p-2">
              {/* WhatsApp */}
              <button onClick={partagerWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 transition text-left">
                <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button onClick={partagerFacebook}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition text-left">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <span className="text-gray-700 font-medium text-sm">Facebook</span>
              </button>

              {/* Copier lien */}
              <button onClick={copierLien}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition text-left">
                <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                  {copie
                    ? <Check size={16} className="text-green-600" />
                    : <Link size={16} className="text-gray-600" />
                  }
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  {copie ? 'Copié !' : 'Copier le lien'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}