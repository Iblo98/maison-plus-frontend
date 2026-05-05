'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { Send, Bot, User } from 'lucide-react';

const FAQ = [
  {
    motsCles: ['publier', 'annonce', 'créer', 'ajouter', 'poster'],
    reponse: `Pour publier une annonce sur Maison+ :\n1. Connectez-vous à votre compte\n2. Cliquez sur le bouton vert "+ Publier"\n3. Remplissez le formulaire (titre, catégorie, prix, ville)\n4. Ajoutez des photos de qualité\n5. Validez — votre annonce est en ligne ! 🎉`
  },
  {
    motsCles: ['paiement', 'payer', 'orange money', 'orange', 'money'],
    reponse: `💳 Les paiements sur Maison+ se font via **Orange Money**.\n\nPour payer :\n1. Allez sur la fiche de l'annonce\n2. Cliquez sur "Payer"\n3. Entrez votre numéro Orange Money\n4. Confirmez le paiement\n\nVous recevrez une confirmation par email et SMS.`
  },
  {
    motsCles: ['prix', 'estimer', 'estimation', 'valeur', 'coût'],
    reponse: `🧠 Maison+ propose un outil d'estimation de prix IA !\n\nPour estimer le prix de votre bien :\n1. Cliquez sur "Estimation IA" dans le menu\n2. Renseignez la catégorie, ville, superficie\n3. Notre IA analyse les annonces similaires\n4. Vous obtenez une fourchette de prix recommandée !`
  },
  {
    motsCles: ['premium', 'plan', 'abonnement', 'agence', 'pro'],
    reponse: `👑 Maison+ propose 3 plans Premium pour les agences :\n\n• **Starter** : 5 000 XOF/mois — 10 annonces\n• **Business** : 15 000 XOF/mois — 50 annonces\n• **Enterprise** : 40 000 XOF/mois — illimité\n\nTous les plans incluent le badge Pro et les statistiques avancées.`
  },
  {
    motsCles: ['parrainage', 'parrainer', 'code', 'inviter', 'ami'],
    reponse: `🎁 Le programme de parrainage Maison+ :\n\n• Partagez votre code unique avec vos amis\n• Ils s'inscrivent avec votre code\n• Vous gagnez **7 jours** de sponsorisation gratuite\n• Votre filleul gagne **3 jours** gratuits\n\nAccédez à votre code dans Menu → Parrainage.`
  },
  {
    motsCles: ['réservation', 'réserver', 'booking', 'dates'],
    reponse: `📅 Pour réserver un bien en location :\n\n1. Allez sur la fiche de l'annonce\n2. Cliquez sur "📅 Réserver en ligne"\n3. Choisissez vos dates d'arrivée et départ\n4. Ajoutez un message au propriétaire\n5. Soumettez votre demande\n\nLe propriétaire reçoit une notification et confirme la réservation.`
  },
  {
    motsCles: ['favori', 'sauvegarder', 'enregistrer', 'coeur'],
    reponse: `❤️ Pour sauvegarder une annonce en favori :\n\n• Cliquez sur l'icône ❤️ sur la carte d'annonce\n• Ou sur la fiche annonce → "Ajouter aux favoris"\n\nRetrouvez tous vos favoris dans Menu → Mes favoris.`
  },
  {
    motsCles: ['alerte', 'notification', 'nouvelle annonce', 'email'],
    reponse: `🔔 Les alertes vous notifient par email quand une nouvelle annonce correspond à vos critères !\n\nPour créer une alerte :\n1. Allez dans Menu → Mes alertes\n2. Cliquez sur "Nouvelle alerte"\n3. Définissez vos critères (ville, prix, catégorie)\n4. Recevez des emails automatiques !`
  },
  {
    motsCles: ['vérification', 'vérifier', 'compte', 'kyc', 'identité', 'cnib'],
    reponse: `✅ Pour vérifier votre compte Maison+ :\n\n1. Allez dans vos Paramètres\n2. Section "Vérification KYC"\n3. Uploadez votre CNIB (recto/verso)\n4. Ajoutez votre numéro Orange Money\n5. Notre équipe valide sous 24-48h\n\nUn compte vérifié inspire plus confiance aux acheteurs/locataires !`
  },
  {
    motsCles: ['sponsoriser', 'sponsorisé', 'boost', 'mettre en avant', 'visibilité'],
    reponse: `⭐ Pour sponsoriser votre annonce :\n\n1. Allez dans votre Dashboard\n2. Cliquez sur "Sponsoriser" sur l'annonce\n3. Choisissez la durée (1-30 jours)\n4. Payez via Orange Money\n\nVotre annonce apparaît en tête des résultats ! Vous pouvez aussi utiliser vos crédits de parrainage.`
  },
  {
    motsCles: ['catégorie', 'type', 'maison', 'parcelle', 'hôtel', 'restaurant', 'marketplace'],
    reponse: `🏠 Maison+ couvre 5 catégories :\n\n• 🏠 **Maison** — Location et vente de maisons\n• 🌍 **Parcelle** — Terrains à vendre\n• 🏨 **Hôtel** — Hébergements\n• 🛒 **Marketplace** — Objets et équipements\n• 🍽️ **Restaurant** — Espaces de restauration`
  },
  {
    motsCles: ['crédit', 'simulation', 'mensualité', 'emprunt', 'banque'],
    reponse: `🏦 Maison+ propose un simulateur de crédit gratuit !\n\nPour simuler votre crédit :\n1. Sur une annonce en vente → "Simuler un crédit"\n2. Ou Menu → Simulation crédit\n3. Entrez le prix, apport et taux\n4. Obtenez vos mensualités et tableau d'amortissement !`
  },
  {
    motsCles: ['marché', 'rapport', 'tendance', 'statistique', 'prix moyen'],
    reponse: `📊 Consultez le rapport de marché Maison+ pour analyser :\n\n• Prix moyens par ville et quartier\n• Evolution des prix sur 12 mois\n• Top quartiers les plus chers\n• Nombre d'annonces actives\n\nAccédez via Menu → 📊 Marché`
  },
  {
    motsCles: ['contact', 'support', 'aide', 'problème', 'signaler'],
    reponse: `📞 Pour contacter le support Maison+ :\n\n• Email : support@maisonplus.bf\n• Via la messagerie interne de la plateforme\n• Heures d'ouverture : 8h-18h (heure de Ouaga)\n\nJe suis aussi disponible 24h/24 pour répondre à vos questions ! 😊`
  },
  {
    motsCles: ['inscription', 'créer compte', 'enregistrer', "s'inscrire"],
    reponse: `👤 Pour créer un compte Maison+ :\n\n1. Cliquez sur "S'inscrire" en haut à droite\n2. Remplissez vos informations\n3. Vérifiez votre email\n4. Connectez-vous et commencez à explorer !\n\nL'inscription est 100% gratuite 🎉`
  },
  {
    motsCles: ['message', 'contacter', 'propriétaire', 'vendeur', 'louer'],
    reponse: `💬 Pour contacter un propriétaire :\n\n1. Allez sur la fiche de l'annonce\n2. Cliquez sur "Envoyer un message"\n3. Ou appelez directement via "Appeler"\n\nVous pouvez aussi faire une demande de réservation en ligne pour les locations !`
  }
];

const trouverReponse = (message) => {
  const msgLower = message.toLowerCase();
  for (const faq of FAQ) {
    if (faq.motsCles.some(mot => msgLower.includes(mot))) {
      return faq.reponse;
    }
  }
  return `Je ne suis pas sûr de comprendre votre question 🤔\n\nVoici ce que je peux vous aider avec :\n• Publier une annonce\n• Paiements Orange Money\n• Estimation de prix\n• Plans Premium\n• Réservations\n• Alertes et favoris\n\nOu contactez notre support : support@maisonplus.bf`;
};

export default function ChatSupport() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Bonjour ! Je suis l\'assistant virtuel de Maison+.\n\nComment puis-je vous aider aujourd\'hui ?\n\n• 🔍 Rechercher des annonces\n• 📝 Publier une annonce\n• 💰 Questions sur les prix\n• 🏠 Informations sur les biens\n• ❓ Toute autre question'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const envoyerMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageUtilisateur = input.trim();
    setInput('');

    const reponse = trouverReponse(messageUtilisateur);

    setMessages(prev => [
      ...prev,
      { role: 'user', content: messageUtilisateur },
      { role: 'assistant', content: reponse }
    ]);
  };

  const suggestionsRapides = [
    '📝 Publier une annonce',
    '💳 Paiement Orange Money',
    '🧠 Estimer mon bien',
    '👑 Plans Premium',
    '📅 Faire une réservation',
    '🎁 Programme parrainage'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Bot size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Assistant Maison+</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                <span className="text-blue-100 text-sm">En ligne 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  {msg.role === 'user'
                    ? <User size={16} className="text-white" />
                    : <Bot size={16} className="text-white" />
                  }
                </div>
                <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={line === '' ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides */}
          <div className="px-4 pb-3 flex flex-wrap gap-2 border-t border-gray-50 pt-3">
            {suggestionsRapides.map((suggestion, i) => (
              <button key={i}
                onClick={() => {
                  setInput(suggestion);
                  setTimeout(() => {
                    const reponse = trouverReponse(suggestion);
                    setMessages(prev => [
                      ...prev,
                      { role: 'user', content: suggestion },
                      { role: 'assistant', content: reponse }
                    ]);
                    setInput('');
                  }, 100);
                }}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium">
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <form onSubmit={envoyerMessage} className="flex gap-2">
              <input type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition text-sm"
              />
              <button type="submit" disabled={!input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          Assistant virtuel Maison+ • Disponible 24h/24 7j/7
        </p>
      </div>
    </div>
  );
}