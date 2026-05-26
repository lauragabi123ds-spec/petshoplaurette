/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserSession, ChatMessage } from '../types';
import { Send, Sparkles, MessageCircle, RefreshCw, Star, Info } from 'lucide-react';

interface AIPetAssistantProps {
  session: UserSession;
}

export default function AIPetAssistant({ session }: AIPetAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active pet context
  const activePet = session.pets.find(p => p.id === session.selectedPetId) || session.pets[0];

  const defaultPrompts = [
    { label: "🥦 Melhores rações" },
    { label: "🙀 Brinquedos para felinos" },
    { label: "🧸 Pet tristonho, o que fazer?" },
    { label: "🛁 Como dar Banho de Campo fofo?" }
  ];

  // Load first greeting
  useEffect(() => {
    let petNameStr = activePet ? `do seu amiguinho(a) ${activePet.name}` : "do seu pet";
    
    setMessages([
      {
        id: 'initial',
        sender: 'assistant',
        text: `Miau! Au-au! Olá, mamãe ou papai de pet! ✨ Eu sou a **Dra. Miauravilha**, sua consultora virtual de bem-estar aqui no **Paws & Play**.

Hoje nós estamos conversando sobre a saúde e diversão ${petNameStr}! Como posso ajudar a dengozo ou planejar o melhor banho para ele hoje? 💖🐾`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [session.selectedPetId]);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          petContext: activePet,
          chatHistory: chatHistory
        })
      });

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        text: data.text || "Hum, me distraí brincando com um novelinho de lã! O que você estava dizendo? 🌸",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `assist-error-${Date.now()}`,
        sender: 'assistant',
        text: "Desculpe, meu cérebro de hamster deu uma travadinha na internet. Mas lembre-se de dar uma comidinha gostosa para o seu pet! 🥩",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Deseja brincar com um novo novelo de lã e limpar a conversa? ✨")) {
      const petNameStr = activePet ? `do seu amiguinho(a) ${activePet.name}` : "do seu pet";
      setMessages([
        {
          id: 'initial',
          sender: 'assistant',
          text: `Miau! Conversa fresquinha iniciada. Estou toda ouvidos sobre a saúde ${petNameStr}! O que vamos descobrir hoje? 🔮`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden flex flex-col h-[580px] max-w-4xl mx-auto">
      
      {/* Bot Chat Header */}
      <div className="p-4.5 bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-between border-b border-purple-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-secondary-yellow text-secondary-on rounded-full flex items-center justify-center font-bold text-lg animate-cute-bounce shadow-sm border border-white/20">
              🔮🐱
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="font-sans text-sm font-bold text-white flex items-center gap-1.5 leading-none">
              <span>Dra. Miauravilha</span>
              <span className="px-1.5 py-0.5 bg-purple-500/40 text-[9px] font-sans font-black tracking-widest rounded text-purple-200 uppercase">Consultora AI</span>
            </h2>
            <p className="font-body text-[11px] text-purple-100 mt-1">
              {activePet ? `Focada no bem-estar de ${activePet.name} 🐶` : 'On-line e cheia de amor'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleClearChat}
          className="p-1 px-2.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-100 text-xs font-sans font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          title="Limpar conversa"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Limpar
        </button>
      </div>

      {/* Messages bubble log scrollpane */}
      <div className="flex-grow p-4 md:p-6 overflow-y-auto bg-stone-50/40 space-y-4">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
              
              {/* Profile character thumbnail */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-secondary-yellow text-xs font-bold flex items-center justify-center border shadow-sm">
                  🐱
                </div>
              )}

              {/* actual speech bubble container */}
              <div className={`p-4.5 rounded-3xl text-sm leading-relaxed ${
                isUser 
                  ? 'bg-primary text-white rounded-tr-none shadow-sm' 
                  : 'bg-white text-zinc-800 border border-purple-50 rounded-tl-none shadow-sm shadow-purple-900/5'
              }`}>
                {/* Simulated rendering or Markdown parsing formatting support of bold lists */}
                <span className="font-body whitespace-pre-line text-xs md:text-sm">
                  {msg.text}
                </span>

                <span className={`block text-[9px] mt-1.5 text-right ${isUser ? 'text-purple-300' : 'text-zinc-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-secondary-yellow text-xs font-bold flex items-center justify-center animate-spin">
              💫
            </div>
            <div className="p-3 bg-white border border-purple-50 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="font-body text-xs text-zinc-400 pl-1">Dra. Miauravilha está digitando...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompting list */}
      <div className="p-3 bg-white border-t border-zinc-100 flex gap-2 overflow-x-auto scrollbar-none items-center">
        <span className="text-zinc-400 font-sans text-[11px] font-bold shrink-0">Sugestões:</span>
        {defaultPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.label.substring(2))}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100/70 border border-purple-100 rounded-full font-body text-xs text-primary font-bold whitespace-nowrap cursor-pointer transition-all shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Message input space footer */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-100">
        <div className="flex gap-2 bg-white border border-purple-100 rounded-2xl p-1 shadow-inner items-center">
          <input 
            type="text"
            className="flex-grow pl-3 pr-2 py-2 bg-white font-body text-sm outline-none transition-all border-none focus:ring-0"
            placeholder={activePet ? `Pergunte à Dra. Miauravilha sobre ${activePet.name}...` : "Pergunte algo sobre nutrição ou diversão!"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputValue);
            }}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="p-2.5 bg-primary hover:bg-primary-light text-white rounded-xl shadow-md transition-all self-end cursor-pointer"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
