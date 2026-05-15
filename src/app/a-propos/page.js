import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { Home, Users, Shield, Globe, TrendingUp, Star } from 'lucide-react';

export const metadata = {
  title: 'À propos de Maison+',
  description: 'Découvrez Maison+, la plateforme immobilière de référence au Burkina Faso.',
};

export default function APropos() {
  const stats = [
    { valeur: '6+', label: 'Catégories', icon: Home },
    { valeur: '100%', label: 'Sécurisé', icon: Shield },
    { valeur: '5%', label: 'Commission', icon: TrendingUp },
    { valeur: 'BF', label: 'Burkina Faso', icon: Globe },
  ];

  const valeurs = [
    { titre: 'Transparence', desc: 'Des prix clairs, des commissions affichées, aucune surprise.', emoji: '💡' },
    { titre: 'Sécurité', desc: 'Paiements sécurisés, vérification KYC, protection acheteur.', emoji: '🔒' },
    { titre: 'Simplicité', desc: 'Une interface intuitive accessible à tous les Burkinabés.', emoji: '✨' },
    { titre: 'Local', desc: 'Conçu par et pour les Burkinabés, avec les modes de paiement locaux.', emoji: '🇧🇫' },
  ];

  const categories = [
    { nom: 'Immobilier', desc: 'Maisons, appartements, villas, terrains', emoji: '🏠' },
    { nom: 'Hôtels', desc: 'Auberges, résidences, maisons d\'hôtes', emoji: '🏨' },
    { nom: 'Cérémonie', desc: 'Chaises, tentes, sono, traiteur', emoji: '🎉' },
    { nom: 'Marketplace', desc: 'Électronique, véhicules, mobilier', emoji: '🛍️' },
    { nom: 'Restaurants', desc: 'Maquis, traiteurs, boulangeries', emoji: '🍽️' },
    { nom: 'Estimation IA', desc: 'Prix estimé en 30 secondes', emoji: '🧠' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Home size={40} className="text-white" />
            <span className="text-5xl font-bold">Maison</span>
            <span className="text-5xl font-bold text-green-400">+</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            La plateforme immobilière de référence au Burkina Faso
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Maison+ connecte vendeurs et acheteurs, propriétaires et locataires,
            prestataires et clients partout au Burkina Faso.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <Icon size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-800">{s.valeur}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Notre mission</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Maison+ a été créé pour simplifier et sécuriser les transactions immobilières
            au Burkina Faso. Notre mission est de donner à chaque Burkinabé accès à un
            marché immobilier transparent, digital et accessible depuis son téléphone.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg mt-4">
            Nous croyons que la technologie peut transformer le secteur immobilier africain
            en offrant des outils modernes adaptés aux réalités locales : paiement via
            Mobile Money, interface en français, support client dédié.
          </p>
        </div>

        {/* Catégories */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Ce que vous trouvez sur Maison+</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.nom} className="bg-gray-50 rounded-xl p-4">
                <span className="text-3xl">{c.emoji}</span>
                <h3 className="font-bold text-gray-800 mt-2">{c.nom}</h3>
                <p className="text-gray-500 text-sm mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Valeurs */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {valeurs.map((v) => (
              <div key={v.titre} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="text-3xl">{v.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{v.titre}</h3>
                  <p className="text-gray-500 text-sm mt-1">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comment ça marche ?</h2>
          <div className="space-y-4">
            {[
              { num: '1', titre: 'Créez votre compte gratuitement', desc: 'Inscription en 2 minutes, particulier ou professionnel.' },
              { num: '2', titre: 'Publiez ou cherchez une annonce', desc: '5 annonces gratuites, recherche avancée par ville, catégorie et prix.' },
              { num: '3', titre: 'Contactez et négociez', desc: 'Messagerie intégrée, appel direct, réservation en ligne.' },
              { num: '4', titre: 'Payez en toute sécurité', desc: 'Orange Money, Moov Money, Coris Money. Commission 5% seulement.' },
            ].map((e) => (
              <div key={e.num} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {e.num}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{e.titre}</h3>
                  <p className="text-gray-600 text-sm">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Rejoignez Maison+ aujourd&apos;hui !</h2>
          <p className="text-green-100 mb-6">Inscription gratuite · Aucune carte bancaire requise</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/inscription"
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">
              Créer un compte gratuit
            </Link>
            <Link href="/annonces"
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition">
              Voir les annonces
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Nous contacter</h2>
          <div className="space-y-2 text-gray-600">
            <p>📧 <a href="mailto:contact@maisonplus.bf" className="text-blue-600 hover:underline">contact@maisonplus.bf</a></p>
            <p>📱 WhatsApp : +226 XX XX XX XX</p>
            <p>📍 Ouagadougou, Burkina Faso</p>
          </div>
          <div className="flex gap-4 justify-center mt-6">
            <Link href="/cgu" className="text-blue-600 hover:underline text-sm">CGU</Link>
            <Link href="/confidentialite" className="text-blue-600 hover:underline text-sm">Confidentialité</Link>
          </div>
        </div>
      </div>
    </div>
  );
}