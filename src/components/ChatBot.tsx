import React, { useState } from 'react';
import { findRelevantData } from '../services/DataService.ts';
import { getAiResponse, getSearchKeywords } from '../services/GeminiService.ts'; 
import '../assets/css/ChatBot.css';
import ChatIcon from '../assets/img/icons/comment.svg';
import CloseIcon from '../assets/img/icons/x.svg';

interface Message {
  text: string;
  isBot: boolean;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "¡Hola! Soy GeoBot. ¿En qué puedo ayudarte a encontrar en Tenerife?", isBot: true }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input;
    setMessages(prev => [...prev, { text: userQuery, isBot: false }]);
    setInput('');

    try {
    // 1. LA IA INTERMEDIA: Limpia la búsqueda (ej: "universidades" -> ["universidad"])
    const cleanKeywords = await getSearchKeywords(userQuery);
    console.log("Buscando con estas claves:", cleanKeywords);

    // 2. BUSCADOR: Filtra el GeoJSON con las claves limpias
    const contextData = await findRelevantData(cleanKeywords);
    if (contextData.length === 0) {
      const backupKeywords = userQuery.toLowerCase().split(' ').filter(w => w.length > 4);
      const backupContextData = await findRelevantData(backupKeywords);
      contextData.push(...backupContextData);
    }
    
    // 3. LA IA FINAL: Redacta la respuesta con los datos reales
    const aiText = await getAiResponse(userQuery, contextData);

    setMessages(prev => [...prev, { text: aiText, isBot: true }]);

  } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Error al procesar la respuesta. Inténtalo de nuevo.", 
        isBot: true 
      }]);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Botón Flotante */}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <img src={CloseIcon} alt="Cerrar chat" /> : <img src={ChatIcon} alt="Abrir chat" />}
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>GeoBot AI</h3>
            <span>Datos Abiertos Tenerife</span>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Ej: ¿Museos en La Laguna?" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;