import React, { useState, useRef, useEffect } from 'react';
import { MessageCircleMore, X, Bot, SendHorizontal } from 'lucide-react';
import { findRelevantData } from '../../services/DataService.ts';
import { getAiResponse, getSearchKeywords } from '../../services/GeminiService.ts';
import '../../assets/css/Home/ChatBot.css';
import ChatBotIcon from '../../assets/img/chat-bot.webp';

interface Message {
  text: string;
  isBot: boolean;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasToggled, setHasToggled] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      text: '¡Hola! Soy LearnBot. ¿Qué quieres descubrir hoy sobre centros culturales o educativos en Tenerife? También puedo informarte sobre rutas culturales.',
      isBot: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setLatestAnnouncement('¡Hola! Soy LearnBot. ¿Qué quieres descubrir hoy sobre centros culturales o educativos en Tenerife? También puedo informarte sobre rutas culturales.');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input;
    setMessages(prev => [...prev, { text: userQuery, isBot: false }]);
    setInput('');
    setLatestAnnouncement('');

    try {
      setIsTyping(true);
      const cleanKeywords = await getSearchKeywords(userQuery);

      const contextData = await findRelevantData(cleanKeywords);
      if (contextData.length === 0) {
        const backupKeywords = userQuery.toLowerCase().split(' ').filter(w => w.length > 4);
        const backupContextData = await findRelevantData(backupKeywords);
        contextData.push(...backupContextData);
      }

      const aiText = await getAiResponse(userQuery, contextData);
      setMessages(prev => [...prev, { text: aiText, isBot: true }]);
      setLatestAnnouncement(aiText);

    } catch (error) {
      const errorText = "Error de conexión con el servidor. Inténtalo de nuevo.";
      setMessages(prev => [...prev, { text: errorText, isBot: true }]);
      setLatestAnnouncement(errorText);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button
        className="chat-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!hasToggled) setHasToggled(true);
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Cerrar asistente GeoBot' : 'Abrir asistente GeoBot para buscar centros en Tenerife'}
      >
        <div className={`chat-toggle-icon-wrapper ${hasToggled ? (isOpen ? 'open' : 'closed') : 'initial'}`}>
          <X aria-hidden="true" color='white' className="icon-close" />
          <MessageCircleMore aria-hidden="true" color='white' className="icon-message" />
        </div>
      </button>

      {isOpen && (
        <section
          id="geobot-chat-window"
          className="chat-window"
          role="region"
          aria-label="Ventana de chat con LearnBot"
        >
          <header className="chat-header" aria-hidden="true">
            <div className="chat-title-text">
              <h2>LearnBot</h2>
            </div>
            <div className="chat-header-slogan">
              <p>¡Siempre listo para ayudarte!</p>
            </div>
          </header>

          <div aria-live="assertive" className="sr-only" aria-atomic="true">
            {latestAnnouncement}
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.isBot ? 'bot-wrapper' : 'user-wrapper'}`}>
                {msg.isBot && (
                  <img src={ChatBotIcon} alt="" className="message-avatar" loading="lazy" aria-hidden="true" />
                )}

                <div className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                  <span className="sr-only">
                    {msg.isBot ? 'LearnBot dice: ' : 'Tú dijiste: '}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}

            <div className="typing-indicator-container" aria-hidden="true">
              {isTyping && (
                <div className="message-wrapper bot-wrapper">
                  <img src={ChatBotIcon} alt="" className="message-avatar" />
                  <div className="message bot typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            aria-label="Formulario para enviar mensaje"
          >
            <Bot className="input-bot-icon" aria-hidden="true" color="#1367d3" size={26} />
            <input
              id="geobot-input"
              type="text"
              ref={inputRef}
              placeholder="¿Museos en La Laguna?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = '¿Museos en La Laguna?'}
              aria-label="Escribe tu pregunta sobre centros en Tenerife. Para salir del chat, presiona la parte inferior derecha de la pantalla."
              autoComplete="off"
            />
            <button type="submit" className="chat-send-button" aria-label="Enviar mensaje">
              <SendHorizontal aria-hidden="true" color="white" size={24} />
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default ChatBot;