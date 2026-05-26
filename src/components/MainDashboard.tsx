/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Pet, UserSession } from '../types';
import { 
  Heart, Flame, Smile, ShieldAlert, Sparkles, 
  Plus, Coffee, Trash2, Milestone, HelpCircle, AlertCircle
} from 'lucide-react';

interface MainDashboardProps {
  session: UserSession;
  onUpdateSession: (updated: UserSession) => void;
  onSelectTab: (tab: string) => void;
}

export default function MainDashboard({ session, onUpdateSession, onSelectTab }: MainDashboardProps) {
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<'dog' | 'cat' | 'bird' | 'rabbit' | 'other'>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');

  // Find currently active pet
  const activePet = session.pets.find(p => p.id === session.selectedPetId) || session.pets[0];

  const handleSelectPet = (id: string) => {
    onUpdateSession({
      ...session,
      selectedPetId: id
    });
  };

  // Metries updates
  const handleCareAction = (action: 'feed' | 'play' | 'shower' | 'sleep') => {
    if (!activePet) return;

    let updatedPct = { ...activePet };

    if (action === 'feed') {
      updatedPct.hunger = Math.min(100, updatedPct.hunger + 25);
      updatedPct.happiness = Math.min(100, updatedPct.happiness + 5);
      updatedPct.energy = Math.min(100, updatedPct.energy + 10);
    } else if (action === 'play') {
      updatedPct.happiness = Math.min(100, updatedPct.happiness + 30);
      updatedPct.energy = Math.max(0, updatedPct.energy - 20);
      updatedPct.hunger = Math.max(0, updatedPct.hunger - 15);
      updatedPct.hygiene = Math.max(0, updatedPct.hygiene - 10);
    } else if (action === 'shower') {
      updatedPct.hygiene = Math.min(100, updatedPct.hygiene + 35);
      updatedPct.happiness = Math.min(100, updatedPct.happiness + 10);
    } else if (action === 'sleep') {
      updatedPct.energy = Math.min(100, updatedPct.energy + 40);
      updatedPct.hunger = Math.max(0, updatedPct.hunger - 10);
    }

    const updatedPets = session.pets.map(p => p.id === activePet.id ? updatedPct : p);
    onUpdateSession({
      ...session,
      pets: updatedPets
    });

    // Alert toast simulation via standard inline banner or cute pop-ups
  };

  const handleAddNewPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName) return;

    let avatar = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop';
    if (newPetType === 'cat') {
      avatar = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop';
    } else if (newPetType === 'bird') {
      avatar = 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?q=80&w=400&auto=format&fit=crop';
    } else if (newPetType === 'rabbit') {
      avatar = 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=400&auto=format&fit=crop';
    } else {
      avatar = 'https://images.unsplash.com/photo-1535268647977-a403b69fc756?q=80&w=400&auto=format&fit=crop'; // lovely sea lion or cute other
    }

    const newPet: Pet = {
      id: `custom-p-${Date.now()}`,
      name: newPetName,
      type: newPetType,
      breed: newPetBreed || 'Misto fofo',
      avatar,
      age: Number(newPetAge) || 1,
      hunger: 60,
      happiness: 80,
      hygiene: 70,
      energy: 90
    };

    onUpdateSession({
      ...session,
      pets: [...session.pets, newPet],
      selectedPetId: newPet.id
    });

    // Reset fields
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setShowAddPet(false);
  };

  const handleDeletePet = (id: string, name: string) => {
    if (session.pets.length <= 1) {
      alert("Seu lar precisa de pelo menos um bichinho fofo! ❤️");
      return;
    }
    if (confirm(`Tem certeza que deseja retirar o(a) fofura ${name} do cadastro? 🥺`)) {
      const remaining = session.pets.filter(p => p.id !== id);
      onUpdateSession({
        ...session,
        pets: remaining,
        selectedPetId: remaining[0].id
      });
    }
  };

  // Visual meter colors
  const getMeterColor = (val: number) => {
    if (val < 30) return 'bg-rose-500 animate-pulse';
    if (val < 65) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  const getMeterIcon = (action: string) => {
    if (action === 'hunger') return '🍖';
    if (action === 'happiness') return '❤️';
    if (action === 'hygiene') return '🧼';
    return '⚡';
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary to-primary-light text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-lg shadow-purple-900/10">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Heart className="w-64 h-64 fill-current" />
        </div>
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-yellow text-secondary-on font-black font-sans text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> VIP
            </span>
            <h1 className="font-sans text-2xl font-bold">Olá, {session.name}! 👋</h1>
          </div>
          <p className="font-body text-zinc-200 text-sm">
            Bem-vindo ao cantinho mais fofo do Paws & Play. Pronto para fazer a alegria dos seus pets hoje?
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <button 
            onClick={() => onSelectTab('chat')} 
            className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-white rounded-xl font-sans text-xs font-bold transition-all border border-purple-400/20 shadow-sm"
          >
            Falar com a Dra. Miauravilha 🔮
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Pet selector panel */}
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-sans text-lg font-bold text-zinc-800 flex items-center gap-1.5 leading-none">
                <span>Nossos Bichinhos</span>
                <span className="text-zinc-400 font-medium font-body text-xs">({session.pets.length})</span>
              </h2>
              <button 
                onClick={() => setShowAddPet(!showAddPet)}
                className="p-1 px-2.5 bg-purple-50 hover:bg-purple-100 text-primary hover:text-primary-light rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-1"
                aria-label="Adicionar novo pet"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Novo
              </button>
            </div>

            {/* Pets Map list */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {session.pets.map(pet => {
                const isActive = pet.id === activePet?.id;
                return (
                  <div 
                    key={pet.id}
                    onClick={() => handleSelectPet(pet.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive 
                        ? 'border-primary bg-purple-50/50 shadow-sm' 
                        : 'border-zinc-100 hover:border-purple-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={pet.avatar} 
                          alt={pet.name} 
                          className="w-11 h-11 rounded-xl object-cover shadow-sm border border-white"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs">
                          {pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : pet.type === 'bird' ? '🐦' : '🐰'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-bold text-zinc-800 group-hover:text-primary transition-colors">
                          {pet.name}
                        </h3>
                        <p className="font-body text-xs text-zinc-500">
                          {pet.breed} • {pet.age} {pet.age === 1 ? 'aninho' : 'aninhos'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Critical alert if any stat is low */}
                      {(pet.hunger < 30 || pet.happiness < 30 || pet.hygiene < 30 || pet.energy < 30) && (
                        <span className="text-rose-500 animate-pulse text-xs" title="Amor urgente necessário!">
                          ⚠️
                        </span>
                      )}
                      
                      <button 
                        onClick={() => handleDeletePet(pet.id, pet.name)}
                        className="p-1.5 hover:bg-rose-50 text-zinc-300 hover:text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Retirar Pet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-start gap-2.5">
            <span className="text-lg">💡</span>
            <div className="font-body text-xs text-amber-900 leading-relaxed">
              <strong>Dica Amigável:</strong> Bichinhos felizes crescem mais fortes! Agende um <strong>Banho Premium</strong> quinzenal para manter a higiene tinindo.
            </div>
          </div>
        </div>

        {/* MIDDLE & RIGHT PANEL (interactive pet space) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active play status and meters card */}
          {activePet ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-purple-100 shadow-sm relative">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                
                {/* Visual Avatar frame and interactive emotion bubble */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-md border-4 border-white ring-4 ring-purple-100/70 animate-cute-bounce">
                    <img 
                      src={activePet.avatar} 
                      alt={activePet.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-secondary-yellow text-secondary-on font-sans font-black text-[11px] rounded-full shadow-md scale-105">
                    {activePet.happiness > 75 ? 'Super Feliz! 🥰' : activePet.happiness > 40 ? 'Satisfeito 🧸' : 'Tristonho 🥺'}
                  </div>
                  
                  {/* Decorative status indicators */}
                  <div className="absolute -bottom-2 -left-2 bg-white px-2 py-0.5 rounded-lg border text-[11px] font-sans font-bold shadow-sm">
                    {activePet.type === 'dog' ? 'Cachorrinho' : activePet.type === 'cat' ? 'Gatinho' : activePet.type === 'bird' ? 'Passarinho' : 'Coelhinho'}
                  </div>
                </div>

                {/* Identity, description, active buttons */}
                <div className="flex-grow text-center md:text-left space-y-2">
                  <h2 className="font-sans text-xl md:text-2xl font-black text-primary">
                    {activePet.name} ✨
                  </h2>
                  <p className="font-body text-sm text-zinc-600">
                    O(A) amiguinho(a) fofo(a) da raça <strong>{activePet.breed}</strong>, com <strong>{activePet.age} {activePet.age === 1 ? 'aninho' : 'aninhos'}</strong> de pura doçura e brincadeira!
                  </p>
                  
                  {/* Quick summary check */}
                  {(activePet.hunger < 40 || activePet.happiness < 40 || activePet.hygiene < 40 || activePet.energy < 40) ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-body text-xs font-bold leading-none animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{activePet.name} precisa de cuidados urgentes!</span>
                    </div>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-body text-xs font-bold leading-none">
                      ✅ Todo sapeca e saudável!
                    </span>
                  )}
                </div>
              </div>

              {/* STATS METERS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-zinc-100">
                {/* Hunger Meter */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex justify-between items-center text-xs font-sans font-extrabold text-zinc-600">
                    <span>{getMeterIcon('hunger')} Fome</span>
                    <span>{activePet.hunger}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getMeterColor(activePet.hunger)}`}
                      style={{ width: `${activePet.hunger}%` }}
                    />
                  </div>
                </div>

                {/* Happiness Meter */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex justify-between items-center text-xs font-sans font-extrabold text-zinc-600">
                    <span>{getMeterIcon('happiness')} Alegria</span>
                    <span>{activePet.happiness}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getMeterColor(activePet.happiness)}`}
                      style={{ width: `${activePet.happiness}%` }}
                    />
                  </div>
                </div>

                {/* Hygiene Meter */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex justify-between items-center text-xs font-sans font-extrabold text-zinc-600">
                    <span>{getMeterIcon('hygiene')} Higiene</span>
                    <span>{activePet.hygiene}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getMeterColor(activePet.hygiene)}`}
                      style={{ width: `${activePet.hygiene}%` }}
                    />
                  </div>
                </div>

                {/* Energy Meter */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex justify-between items-center text-xs font-sans font-extrabold text-zinc-600">
                    <span>{getMeterIcon('energy')} Energia</span>
                    <span>{activePet.energy}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getMeterColor(activePet.energy)}`}
                      style={{ width: `${activePet.energy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ACTION CARE TRIGGERS */}
              <div className="mt-6">
                <h3 className="font-sans text-xs font-bold text-zinc-500 tracking-wider uppercase mb-3">
                  Ações de Carinho Direto
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  <button 
                    onClick={() => handleCareAction('feed')}
                    className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 rounded-2xl font-sans text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-lg">🍖</span>
                    <span>Alimentar</span>
                  </button>

                  <button 
                    onClick={() => handleCareAction('play')}
                    className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-700 rounded-2xl font-sans text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-lg">🎾</span>
                    <span>Brincar</span>
                  </button>

                  <button 
                    onClick={() => handleCareAction('shower')}
                    className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 rounded-2xl font-sans text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-lg">🧼</span>
                    <span>Banhar</span>
                  </button>

                  <button 
                    onClick={() => handleCareAction('sleep')}
                    className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-2xl font-sans text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-lg">💤</span>
                    <span>Dormir</span>
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-purple-100 text-center space-y-4">
              <span className="text-4xl block">✨</span>
              <h3 className="font-sans text-lg font-bold text-zinc-700">Adicione seu Primeiro Pet</h3>
              <p className="font-body text-zinc-500 text-sm max-w-md mx-auto">
                Registre uma fofura felpuda para ter acesso aos painéis de monitoramento, alimentá-los, deitá-los para dormir e tratá-los como realeza!
              </p>
              <button 
                onClick={() => setShowAddPet(true)}
                className="px-6 py-2 bg-primary text-white rounded-xl font-sans text-sm font-bold"
              >
                Cadastrar Agora
              </button>
            </div>
          )}

          {/* QUICK PATHS REDIRECT bento style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between items-start gap-4">
              <div>
                <span className="p-2.5 bg-amber-100 rounded-xl text-lg inline-block">🛍️</span>
                <h3 className="font-sans font-bold text-zinc-800 mt-2">Lojinha de Mimos</h3>
                <p className="font-body text-xs text-zinc-500 mt-1">
                  Compre brinquedos, roupinhas fofas e rações orgânicas premium no nosso pet shopping integrado.
                </p>
              </div>
              <button 
                onClick={() => onSelectTab('store')} 
                className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                Ir para o Shopping →
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between items-start gap-4">
              <div>
                <span className="p-2.5 bg-purple-100 rounded-xl text-lg inline-block">🌸</span>
                <h3 className="font-sans font-bold text-zinc-800 mt-2">Spa de Patinhas</h3>
                <p className="font-body text-xs text-zinc-500 mt-1">
                  Agende banhos de espuma perfumada, cortes com design em forma de ursinho e muito relaxamento para o pet.
                </p>
              </div>
              <button 
                onClick={() => onSelectTab('spa')} 
                className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                Agendar Spa →
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL: Add Pet */}
      {showAddPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 shadow-xl p-6 relative">
            <h2 className="font-sans text-lg font-black text-primary mb-1">
              🎉 Registrar Nova Fofura
            </h2>
            <p className="font-body text-xs text-zinc-500 mb-4">
              Preencha os dados e daremos as boas-vindas ao novo integrante da nossa família!
            </p>

            <form onSubmit={handleAddNewPet} className="space-y-4">
              <div className="space-y-1">
                <label className="font-sans text-xs font-bold text-zinc-600 block">Nome do Bichinho</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Pipoca, Mel, Frederico"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl font-body text-sm outline-none"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="font-sans text-xs font-bold text-zinc-600 block">Tipo do Pet</span>
                  <select
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl font-body text-sm outline-none"
                    value={newPetType}
                    onChange={(e) => setNewPetType(e.target.value as any)}
                  >
                    <option value="dog">Cachorrinho 🐶</option>
                    <option value="cat">Gatinho 🐱</option>
                    <option value="bird">Passarinho 🐦</option>
                    <option value="rabbit">Coelhinho 🐰</option>
                    <option value="other">Outro Fofo 🐥</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="font-sans text-xs font-bold text-zinc-600 block">Idade (anos)</span>
                  <input 
                    type="number"
                    min="0"
                    placeholder="Ex: 2 ou 0"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl font-body text-sm outline-none"
                    value={newPetAge}
                    onChange={(e) => setNewPetAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-xs font-bold text-zinc-600 block">Raça</label>
                <input 
                  type="text"
                  placeholder="Ex: Shitzu, Vira-lata, Angorá"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl font-body text-sm outline-none"
                  value={newPetBreed}
                  onChange={(e) => setNewPetBreed(e.target.value)}
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddPet(false)}
                  className="w-1/2 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-sans text-sm font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-2.5 bg-primary text-white font-sans text-sm font-bold rounded-xl shadow-md"
                >
                  Registrar Fofura ✨
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
