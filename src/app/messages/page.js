'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Send, ArrowLeft, Home, Search, Check, CheckCheck, Download } from 'lucide-react';
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
  const [autreUtilisateur, setAutreUtilisateur] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authChargement && !utilisateur) {
      router.push('/connexion');
      return;
    }
    if (utilisateur) {
      initialiserSocket();
      chargerConversations();
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
      chargerConversations();
    });
    nouveauSocket.on('notification_message', () => {
      chargerConversations();
    });
    nouveauSocket.on('message_lu', (data) => {
      setMessages(prev => prev.map(m =>
        m.id === data.messageId ? { ...m, est_lu: true } : m
      ));
    });
    setSocket(nouveauSocket);
  };

  const chargerConversations = async () => {
    try {
      const response = await api.get('/messages/mes-conversations');
      setConversations(response.data.conversations || []);
    } catch (erreur) {
      console.error('Erreur:', erreur);
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
        autre_utilisateur_photo: annonce.photo_profil
      };
      ouvrirConversation(conv);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const ouvrirConversation = async (conv) => {
    setConversationActive(conv);
    const autreId = conv.autre_utilisateur_id ||
      (conv.expediteur_id === utilisateur.id ? conv.destinataire_id : conv.expediteur_id);

    const autre = getAutreUtilisateur(conv);
    setAutreUtilisateur(autre);

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
      chargerConversations();
    } catch (erreur) {
      console.error('Erreur:', erreur);
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

      if (socket) {
        socket.emit('nouveau_message', {
          ...msg,
          expediteur_nom: utilisateur.nom,
          expediteur_prenom: utilisateur.prenom,
          expediteur_photo: utilisateur.photo_profil
        });
      }

      setMessages(prev => [...prev, msg]);
      setNouveauMessage('');
      chargerConversations();
    } catch (erreur) {
      const message = erreur?.response?.data?.message || 'Erreur envoi message';
      const raisons = erreur?.response?.data?.raisons;
      toast.error(message, { duration: 5000 });
      if (raisons && raisons.length > 0) {
        setTimeout(() => {
          toast('⚠️ ' + raisons[0], {
            icon: '🚫',
            duration: 4000,
            style: { background: '#FEF3C7', color: '#92400E' }
          });
        }, 500);
      }
    } finally {
      setEnvoi(false);
    }
  };

  const exporterConversation = async () => {
    if (!conversationActive) return;
    const autreId = conversationActive.autre_utilisateur_id ||
      (conversationActive.expediteur_id === utilisateur.id
        ? conversationActive.destinataire_id
        : conversationActive.expediteur_id);

    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/exporter/${conversationActive.annonce_id}/${autreId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation_${conversationActive.annonce_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Conversation exportée !');
    } catch (err) {
      toast.error('Erreur export');
    }
  };

  const scrollBasDePage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formaterHeure = (date) => new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit'
  });

  const formaterDate = (date) => {
    const d = new Date(date);
    const diff = new Date() - d;
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
        photo: conv.destinataire_photo
      };
    }
    return {
      id: conv.expediteur_id,
      nom: conv.expediteur_nom,
      prenom: conv.expediteur_prenom,
      photo: conv.expediteur_photo
    };
  };

  const Avatar = ({ nom, prenom, photo, taille = 'md' }) => {
    const classes = taille === 'sm' ? 'w-8 h-8 text-xs' :
      taille === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
    return (
      <div className={`${classes} rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
        {photo ? (
          <img src={photo} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-blue-600 font-bold">{prenom?.[0]}{nom?.[0]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: '75vh' }}>
          <div className="flex h-full">

            {/* Liste conversations */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${conversationActive ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Messages</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Rechercher..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

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
                    <p className="text-gray-400 text-xs mt-1">Contactez un propriétaire depuis une annonce</p>
                  </div>
                ) : (
                  conversations.map((conv, index) => {
                    const autre = getAutreUtilisateur(conv);
                    const estActive = conversationActive?.annonce_id === conv.annonce_id;
                    const nonLus = parseInt(conv.non_lus) || 0;
                    return (
                      <button key={index} onClick={() => ouvrirConversation(conv)}
                        className={`w-full p-4 flex gap-3 hover:bg-gray-50 transition text-left border-b border-gray-50 ${estActive ? 'bg-blue-50' : ''}`}>
                        <Avatar nom={autre.nom} prenom={autre.prenom} photo={autre.photo} taille="lg" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm truncate ${nonLus > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                              {autre.prenom} {autre.nom}
                            </p>
                            <span className="text-gray-400 text-xs flex-shrink-0 ml-2">
                              {formaterDate(conv.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs truncate mt-0.5">{conv.annonce_titre}</p>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className={`text-xs truncate ${nonLus > 0 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                              {conv.contenu}
                            </p>
                            {nonLus > 0 && (
                              <span className="flex-shrink-0 ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {nonLus}
                              </span>
                            )}
                          </div>
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
                    <p className="text-gray-400 text-sm mt-1">ou contactez un propriétaire depuis une annonce</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header conversation */}
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                    <button onClick={() => setConversationActive(null)}
                      className="md:hidden text-gray-600 hover:text-gray-800">
                      <ArrowLeft size={20} />
                    </button>
                    <Avatar
                      nom={autreUtilisateur?.nom || conversationActive.autre_utilisateur_nom}
                      prenom={autreUtilisateur?.prenom || conversationActive.autre_utilisateur_prenom}
                      photo={autreUtilisateur?.photo || conversationActive.autre_utilisateur_photo}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {autreUtilisateur?.prenom || conversationActive.autre_utilisateur_prenom}{' '}
                        {autreUtilisateur?.nom || conversationActive.autre_utilisateur_nom}
                      </p>
                      <p className="text-gray-400 text-xs truncate max-w-48">
                        {conversationActive.annonce_titre}
                      </p>
                    </div>

                    {/* Bouton export PDF */}
                    <button onClick={exporterConversation}
                      className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition">
                      <Download size={14} />
                      Exporter
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">Commencez la conversation !</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const estMoi = msg.expediteur_id === utilisateur?.id;
                        const photoExp = estMoi
                          ? utilisateur?.photo_profil
                          : (autreUtilisateur?.photo || msg.expediteur_photo);

                        return (
                          <div key={index} className={`flex items-end gap-2 ${estMoi ? 'justify-end' : 'justify-start'}`}>
                            {!estMoi && (
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {photoExp ? (
                                  <img src={photoExp} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-blue-600 font-bold text-xs">
                                    {msg.expediteur_prenom?.[0]}{msg.expediteur_nom?.[0]}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className={`max-w-xs lg:max-w-md ${estMoi ? 'items-end' : 'items-start'} flex flex-col`}>
                              <div className={`px-4 py-2.5 rounded-2xl ${
                                estMoi
                                  ? 'bg-blue-600 text-white rounded-br-sm'
                                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                              }`}>
                                <p className="text-sm leading-relaxed">{msg.contenu}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${estMoi ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs text-gray-400">{formaterHeure(msg.created_at)}</span>
                                {estMoi && (
                                  msg.est_lu
                                    ? <CheckCheck size={12} className="text-blue-500" />
                                    : <Check size={12} className="text-gray-400" />
                                )}
                              </div>
                            </div>
                            {estMoi && (
                              <div className="w-7 h-7 rounded-full bg-blue-600 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {utilisateur?.photo_profil ? (
                                  <img src={utilisateur.photo_profil} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-white font-bold text-xs">
                                    {utilisateur?.prenom?.[0]}{utilisateur?.nom?.[0]}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Zone de saisie */}
                  <form onSubmit={envoyerMessage}
                    className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                    <input type="text" value={nouveauMessage}
                      onChange={(e) => setNouveauMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition text-sm"
                    />
                    <button type="submit" disabled={!nouveauMessage.trim() || envoi}
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