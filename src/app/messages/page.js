'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Send, ArrowLeft, Home, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

export default function Messages() {
  const { utilisateur, chargement: authChargement } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationActive, setConversationActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authChargement && !utilisateur) {
      router.push('/connexion');
      return;
    }
    if (utilisateur) {
      initialiserSocket();
      chargerConversations();

      // Si on vient d'une annonce
      const annonceId = searchParams.get('annonce');
      const destinataireId = searchParams.get('destinataire');
      if (annonceId && destinataireId) {
        ouvrirConversationDirecte(annonceId, destinataireId);
      }
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [utilisateur, authChargement]);

  useEffect(() => {
    scrollBasDePage();
  }, [messages]);

  const initialiserSocket = () => {
    const nouveauSocket = io('http://localhost:3000');
    nouveauSocket.on('connect', () => {
      nouveauSocket.emit('rejoindre', utilisateur.id);
    });
    nouveauSocket.on('message_recu', (message) => {
      setMessages(prev => {
        if (prev.find(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });
    nouveauSocket.on('notification_message', () => {
      chargerConversations();
    });
    setSocket(nouveauSocket);
  };

  const chargerConversations = async () => {
    try {
      const response = await api.get('/messages/mes-conversations');
      setConversations(response.data.conversations || []);
    } catch (erreur) {
      console.error('Erreur chargement conversations:', erreur);
    } finally {
      setChargement(false);
    }
  };

  const ouvrirConversationDirecte = async (annonceId, destinataireId) => {
    try {
      const annonceRes = await api.get(`/annonces/${annonceId}`);
      const annonce = annonceRes.data.annonce;
      const conv = {
        annonce_id: annonceId,
        annonce_titre: annonce.titre,
        autre_utilisateur_id: destinataireId,
        autre_utilisateur_nom: annonce.nom,
        autre_utilisateur_prenom: annonce.prenom,
      };
      ouvrirConversation(conv);
    } catch (err) {
      console.error('Erreur ouverture conversation:', err);
    }
  };

  const ouvrirConversation = async (conv) => {
    setConversationActive(conv);
    const autreId = conv.autre_utilisateur_id ||
      (conv.expediteur_id === utilisateur.id ? conv.destinataire_id : conv.expediteur_id);

    if (socket) {
      socket.emit('rejoindre_conversation', {
        annonceId: conv.annonce_id,
        userId1: utilisateur.id,
        userId2: autreId
      });
    }

    try {
      const response = await api.get(`/messages/${conv.annonce_id}/${autreId}`);
      setMessages(response.data.messages || []);
    } catch (erreur) {
      console.error('Erreur chargement messages:', erreur);
    }
  };

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !conversationActive) return;

    const autreId = conversationActive.autre_utilisateur_id ||
      (conversationActive.expediteur_id === utilisateur.id
        ? conversationActive.destinataire_id
        : conversationActive.expediteur_id);

    setEnvoi(true);
    try {
      const response = await api.post('/messages', {
        annonce_id: conversationActive.annonce_id,
        destinataire_id: autreId,
        contenu: nouveauMessage.trim()
      });

      const msg = response.data.data;

      // Émettre via socket
      if (socket) {
        socket.emit('nouveau_message', {
          ...msg,
          expediteur_nom: utilisateur.prenom,
          expediteur_prenom: utilisateur.prenom
        });
      }

      setMessages(prev => [...prev, msg]);
      setNouveauMessage('');
      chargerConversations();
    } catch (erreur) {
      toast.error(erreur?.response?.data?.message || 'Erreur envoi message');
    } finally {
      setEnvoi(false);
    }
  };

  const scrollBasDePage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formaterHeure = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formaterDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const diff = today - d;
    if (diff < 86400000) return 'Aujourd\'hui';
    if (diff < 172800000) return 'Hier';
    return d.toLocaleDateString('fr-FR');
  };

  const getAutreUtilisateur = (conv) => {
    if (conv.autre_utilisateur_id) {
      return {
        id: conv.autre_utilisateur_id,
        nom: conv.autre_utilisateur_nom,
        prenom: conv.autre_utilisateur_prenom,
        photo: conv.autre_utilisateur_photo
      };
    }
    if (conv.expediteur_id === utilisateur?.id) {
      return {
        id: conv.destinataire_id,
        nom: conv.destinataire_nom,
        prenom: conv.destinataire_prenom,
        photo: null
      };
    }
    return {
      id: conv.expediteur_id,
      nom: conv.expediteur_nom,
      prenom: conv.expediteur_prenom,
      photo: conv.expediteur_photo
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: '75vh' }}>
          <div className="flex h-full">

            {/* Liste conversations */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${conversationActive ? 'hidden md:flex' : 'flex'}`}>

              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Messages</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Rechercher..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Liste */}
              <div className="flex-1 overflow-y-auto">
                {chargement ? (
                  <div className="p-4 space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"/>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"/>
                          <div className="h-3 bg-gray-200 rounded w-1/2"/>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Home size={32} className="text-blue-300" />
                    </div>
                    <p className="text-gray-500 text-sm">Aucune conversation</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Contactez un propriétaire depuis une annonce
                    </p>
                  </div>
                ) : (
                  conversations.map((conv, index) => {
                    const autre = getAutreUtilisateur(conv);
                    const estActive = conversationActive?.annonce_id === conv.annonce_id;
                    return (
                      <button key={index} onClick={() => ouvrirConversation(conv)}
                        className={`w-full p-4 flex gap-3 hover:bg-gray-50 transition text-left border-b border-gray-50 ${
                          estActive ? 'bg-blue-50' : ''
                        }`}>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {autre.photo ? (
                            <img src={autre.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-blue-600 font-bold">
                              {autre.prenom?.[0]}{autre.nom?.[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {autre.prenom} {autre.nom}
                            </p>
                            <span className="text-gray-400 text-xs flex-shrink-0 ml-2">
                              {formaterDate(conv.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs truncate mt-0.5">
                            {conv.annonce_titre}
                          </p>
                          <p className="text-gray-400 text-xs truncate mt-0.5">
                            {conv.contenu}
                          </p>
                          {conv.non_lus > 0 && (
                            <span className="inline-block bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 mt-1">
                              {conv.non_lus}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Zone de chat */}
            <div className={`flex-1 flex flex-col ${!conversationActive ? 'hidden md:flex' : 'flex'}`}>

              {!conversationActive ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home size={40} className="text-blue-300" />
                    </div>
                    <p className="text-gray-500">Sélectionnez une conversation</p>
                    <p className="text-gray-400 text-sm mt-1">
                      ou contactez un propriétaire depuis une annonce
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header conversation */}
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <button onClick={() => setConversationActive(null)}
                      className="md:hidden text-gray-600 hover:text-gray-800">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {conversationActive.autre_utilisateur_photo ? (
                        <img src={conversationActive.autre_utilisateur_photo} alt=""
                          className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-blue-600 font-bold text-sm">
                          {conversationActive.autre_utilisateur_prenom?.[0]}
                          {conversationActive.autre_utilisateur_nom?.[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {conversationActive.autre_utilisateur_prenom} {conversationActive.autre_utilisateur_nom}
                      </p>
                      <p className="text-gray-400 text-xs truncate max-w-48">
                        {conversationActive.annonce_titre}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">Commencez la conversation !</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const estMoi = msg.expediteur_id === utilisateur?.id;
                        return (
                          <div key={index} className={`flex ${estMoi ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                              estMoi
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                            }`}>
                              <p className="text-sm leading-relaxed">{msg.contenu}</p>
                              <p className={`text-xs mt-1 ${estMoi ? 'text-blue-200' : 'text-gray-400'}`}>
                                {formaterHeure(msg.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Zone de saisie */}
                  <form onSubmit={envoyerMessage}
                    className="p-4 border-t border-gray-100 flex gap-3">
                    <input
                      type="text"
                      value={nouveauMessage}
                      onChange={(e) => setNouveauMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition text-sm"
                    />
                    <button type="submit"
                      disabled={!nouveauMessage.trim() || envoi}
                      className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}