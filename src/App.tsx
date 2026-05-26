/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession, Booking } from './types';
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import PetStore from './components/PetStore';
import PetSpaBooking from './components/PetSpaBooking';
import AIPetAssistant from './components/AIPetAssistant';
import PetHotel from './components/PetHotel';
import { PawPrint, LogOut, Heart, Sparkles, MessageCircle, ShoppingBag, ShowerHead, CalendarDays, Milestone, Home, Activity } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    name: 'Laura Gabriela',
    email: 'laura@pawsplay.com',
    pets: [],
    selectedPetId: null
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Spa bookings state managed globally
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const cachedSession = localStorage.getItem('paws_play_session');
      if (cachedSession) {
        setSession(JSON.parse(cachedSession));
      }
      
      const cachedBookings = localStorage.getItem('paws_play_bookings');
      if (cachedBookings) {
        setBookings(JSON.parse(cachedBookings));
      }
    } catch (e) {
      console.error("Erro ao ler LocalStorage", e);
    }
  }, []);

  // Save to LocalStorage helper
  const handleUpdateSession = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem('paws_play_session', JSON.stringify(newSession));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBooking = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem('paws_play_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    try {
      localStorage.setItem('paws_play_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    if (confirm("Deseja mesmo sair do Paws & Play e dar tchauzinho para os bichinhos? 🥺")) {
      const reset = {
        isLoggedIn: false,
        name: '',
        email: '',
        pets: [],
        selectedPetId: null
      };
      setSession(reset);
      setBookings([]);
      try {
        localStorage.removeItem('paws_play_session');
        localStorage.removeItem('paws_play_bookings');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Toast feedback helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Render proper tab based on state
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <MainDashboard 
            session={session} 
            onUpdateSession={handleUpdateSession} 
            onSelectTab={(tab) => {
              setActiveTab(tab);
              // Small visual helper
              triggerToast(`Navegando para o espaço de ${tab === 'chat' ? 'Consulta AI 🔮' : tab === 'store' ? 'Lojinha 🛍️' : 'Reservas 🛀'}`);
            }}
          />
        );
      case 'store':
        return <PetStore onAddCartMessage={triggerToast} />;
      case 'spa':
        return (
          <PetSpaBooking 
            session={session} 
            bookings={bookings} 
            onAddBooking={handleAddBooking} 
            onRemoveBooking={handleRemoveBooking}
          />
        );
      case 'chat':
        return <AIPetAssistant session={session} />;
      case 'hotel':
        return <PetHotel session={session} onUpdateSession={handleUpdateSession} />;
      default:
        return <MainDashboard session={session} onUpdateSession={handleUpdateSession} onSelectTab={setActiveTab} />;
    }
  };

  // If user is not logged in, show replicated gorgeous glass login card
  if (!session.isLoggedIn) {
    return <LoginScreen onSuccess={(user) => {
      // Set session & triggers onboarding message
      handleUpdateSession(user);
      triggerToast(`Bem-vindo de volta, ${user.name}! Que alegria ver você e seus pets de novo! 🐾💖`);
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#fbf9f1] text-zinc-800 flex flex-col font-body">
      
      {/* GLOBAL TOAST BANNER */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className="p-4 bg-white/95 border border-purple-200 shadow-xl rounded-2xl flex items-center gap-3 glassmorphism transition-all">
            <span className="p-2 bg-gradient-to-tr from-purple-500 to-amber-300 rounded-xl text-md inline-block animate-cute-bounce">
              ✨
            </span>
            <p className="font-body text-xs font-semibold text-zinc-700 leading-relaxed">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* TOP HEADER MENU BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100/60 px-4 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-secondary-yellow flex items-center justify-center font-extrabold shadow-sm animate-cute-bounce">
            <PawPrint className="w-5.5 h-5.5 text-secondary-on fill-current" />
          </div>
          <div>
            <span className="font-sans text-lg font-black tracking-tight text-primary">
              Paws & Play
            </span>
            <span className="hidden md:inline-block pl-2 text-[10px] font-sans font-extrabold uppercase tracking-widest text-zinc-400">
              Pet Boutique & Spa
            </span>
          </div>
        </div>

        {/* Profile and log out section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="font-body text-xs font-semibold text-zinc-500">
              {session.name}
            </span>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-rose-50 text-zinc-400 hover:text-rose-500 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-sans text-xs font-bold"
            title="Sair da Conta"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* BODY SHELL (Sidebar + Navigation + Content) */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* DESKTOP SIDEBAR NAVIGATION (hidden on mobile size) */}
        <nav className="hidden md:flex flex-col w-64 bg-white border-r border-purple-100/50 p-5 space-y-2.5 shrink-0 self-stretch">
          <span className="text-[10px] font-sans font-black uppercase text-zinc-400 tracking-widest pl-3 mb-1">
            Menu Principal
          </span>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full px-4 py-3 rounded-2xl font-sans text-xs font-extrabold flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === 'dashboard'
                ? 'bg-purple-50 text-primary shadow-sm border border-purple-100'
                : 'text-zinc-600 hover:bg-zinc-50/50 hover:text-primary'
            }`}
          >
            <Home className="w-4.5 h-4.5 shrink-0" />
            <span>Painel do Lar 🏡</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`w-full px-4 py-3 rounded-2xl font-sans text-xs font-extrabold flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === 'store'
                ? 'bg-purple-50 text-primary shadow-sm border border-purple-100'
                : 'text-zinc-600 hover:bg-zinc-50/50 hover:text-primary'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
            <span>Lojinha de Mimos 🛍️</span>
          </button>

          <button
            onClick={() => setActiveTab('spa')}
            className={`w-full px-4 py-3 rounded-2xl font-sans text-xs font-extrabold flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === 'spa'
                ? 'bg-purple-50 text-primary shadow-sm border border-purple-100'
                : 'text-zinc-600 hover:bg-zinc-50/50 hover:text-primary'
            }`}
          >
            <ShowerHead className="w-4.5 h-4.5 shrink-0" />
            <span>Spa & Grooming 🛀</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full px-4 py-3 rounded-2xl font-sans text-xs font-extrabold flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === 'chat'
                ? 'bg-purple-50 text-primary shadow-sm border border-purple-100'
                : 'text-zinc-600 hover:bg-zinc-50/50 hover:text-primary'
            }`}
          >
            <MessageCircle className="w-4.5 h-4.5 shrink-0" />
            <span>IAutoridade (AI Vet) 🔮</span>
          </button>

          <button
            onClick={() => setActiveTab('hotel')}
            className={`w-full px-4 py-3 rounded-2xl font-sans text-xs font-extrabold flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === 'hotel'
                ? 'bg-purple-50 text-primary shadow-sm border border-purple-100'
                : 'text-zinc-600 hover:bg-zinc-50/50 hover:text-primary'
            }`}
          >
            <Activity className="w-4.5 h-4.5 shrink-0" />
            <span>Hotelzinho & Creche 🏨</span>
          </button>

          {/* Adorable promotional banner card inside the sidebar */}
          <div className="pt-8">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100/50 to-purple-100/30 border border-amber-200/50 text-center space-y-2 text-zinc-700">
              <span className="text-2xl animate-cute-bounce block">🏆🐾</span>
              <h4 className="font-sans text-xs font-black">Ganhe Selinhos de Dengo</h4>
              <p className="font-body text-[10px] leading-relaxed text-zinc-600">
                A cada banho agendado ou mimo comprado, seu pet acumula milhas para trocar por biscoitinhos gourmet!
              </p>
            </div>
          </div>
        </nav>

        {/* CENTRAL DYNAMIC SUB-VIEW WORKSPACE */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {renderTabContent()}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (hidden on desktop sizes) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-purple-100 px-4 py-2 flex justify-around items-center shadow-lg">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'dashboard' ? 'text-primary font-bold' : 'text-zinc-400'}`}
        >
          <Home className="w-5 h-5" />
          <span className="font-body text-[9px]">Painel</span>
        </button>

        <button 
          onClick={() => setActiveTab('store')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'store' ? 'text-primary font-bold' : 'text-zinc-400'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-body text-[9px]">Lojinha</span>
        </button>

        <button 
          onClick={() => setActiveTab('spa')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'spa' ? 'text-primary font-bold' : 'text-zinc-400'}`}
        >
          <ShowerHead className="w-5 h-5" />
          <span className="font-body text-[9px]">PetSpa</span>
        </button>

        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'chat' ? 'text-primary font-bold' : 'text-zinc-400'}`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-body text-[9px]">AI Vet</span>
        </button>

        <button 
          onClick={() => setActiveTab('hotel')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'hotel' ? 'text-primary font-bold' : 'text-zinc-400'}`}
        >
          <Activity className="w-5 h-5" />
          <span className="font-body text-[9px]">Creche</span>
        </button>
      </div>

    </div>
  );
}
