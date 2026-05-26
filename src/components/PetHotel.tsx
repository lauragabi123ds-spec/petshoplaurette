/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession } from '../types';
import { ShieldCheck, Sparkles, Building, Video, LogIn, LogOut, CheckCircle } from 'lucide-react';

interface PetHotelProps {
  session: UserSession;
  onUpdateSession: (updated: UserSession) => void;
}

export default function PetHotel({ session, onUpdateSession }: PetHotelProps) {
  const [checkedInPetIds, setCheckedInPetIds] = useState<string[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState('petite');
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  const [activityTrigger, setActivityTrigger] = useState(0);

  const suites = [
    {
      id: 'petite',
      name: 'Suíte Mon Petit',
      icon: '🌸🐶',
      price: 65,
      description: 'Ideal para filhotinhos e raças mini, equipada com mini sofás de veludo e móbiles rilhaváveis.'
    },
    {
      id: 'catle',
      name: 'Castelo Real do Gato',
      icon: '🏰🐱',
      price: 75,
      description: 'Torres integradas com pontes suspensas, arranhadores em todas as paredes e caminhas aromáticas.'
    },
    {
      id: 'field',
      name: 'Toca da Cenoura Feliz',
      icon: '🥕🐰',
      price: 55,
      description: 'Espaço com solo de feno fofo, brinquedos de madeira para roer e vegetais frescos colhidos.'
    }
  ];

  const handleCheckIn = (petId: string) => {
    if (checkedInPetIds.includes(petId)) return;
    
    // Check in pet
    setCheckedInPetIds([...checkedInPetIds, petId]);
    
    const pet = session.pets.find(p => p.id === petId);
    const petName = pet ? pet.name : 'Seu pet';
    
    // Add custom welcome log
    const introAlerts = [
      `🔔 [Check-in] O(A) fofo(a) do(a) ${petName} acabou de entrar em sua suíte temática! Ele(a) já correu para cheirar as caminhas!`,
      `💤 [Atividade] ${petName} deitou no tapete macio e está balançando o rabinho com sono.`,
      `🍖 [Atividade] Nosso monitor de dengo deu um pedaço de biscoitinho artesanal para ${petName} que pulou de alegria!`
    ];
    setActivityLogs(prev => [introAlerts[0], ...prev]);
  };

  const handleCheckOut = (petId: string) => {
    setCheckedInPetIds(checkedInPetIds.filter(id => id !== petId));
    const pet = session.pets.find(p => p.id === petId);
    const petName = pet ? pet.name : 'Seu pet';
    setActivityLogs(prev => [`🏠 [Check-out] ${petName} saiu do hotelzinho cheiroso e com as energias recarregadas!`, ...prev]);
  };

  // Simulate dynamic webcam updates
  useEffect(() => {
    if (checkedInPetIds.length === 0) return;

    const interval = setInterval(() => {
      // Pick random checked-in pet
      const randomPetId = checkedInPetIds[Math.floor(Math.random() * checkedInPetIds.length)];
      const pet = session.pets.find(p => p.id === randomPetId);
      if (!pet) return;

      const actions = [
        `🐾 [Monitor] ${pet.name} está brincando de pique-esconde com uma bolinha de pelos!`,
        `💤 [Monitor] ${pet.name} deitou com a barriga para cima pegando um ventinho fresco!`,
        `🥣 [Monitor] ${pet.name} bebeu bastante água geladinha e soltou um suspiro de alívio.`,
        `🧼 [Monitor] Monitor fez massagem nas costelas de ${pet.name} que fechou os olhos de felicidade!`,
        `🍪 [Monitor] Senti cheiro de dengo! ${pet.name} recebeu um petisco orgânico em forma de estrela.`
      ];

      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setActivityLogs(prev => [randomAction, ...prev.slice(0, 15)]); // Limit to 15 logs
    }, 4500);

    return () => clearInterval(interval);
  }, [checkedInPetIds, session.pets]);

  return (
    <div className="space-y-6">
      
      {/* Hotel intro summary banner */}
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100/70 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <span className="text-3xl block">🏨🛌</span>
        <div className="space-y-1">
          <h2 className="font-sans text-sm font-black text-amber-900">
            Hotel fofinho de Férias & Creche Paws & Play!
          </h2>
          <p className="font-body text-xs text-amber-800 leading-relaxed">
            Vai viajar no feriado ou trabalhar o dia todo fora? Hospede seu melhor amigo em nossas suítes climatizadas e acompanhe todas as travessuras dele ao vivo pelo nosso diário de bordo!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Suites available */}
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-purple-100 shadow-sm space-y-4">
          <h2 className="font-sans text-base font-black text-zinc-800">
            Suítes Disponíveis
          </h2>

          <div className="space-y-3">
            {suites.map(suite => (
              <div 
                key={suite.id}
                onClick={() => setSelectedSuiteId(suite.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedSuiteId === suite.id
                    ? 'border-primary bg-purple-50/30'
                    : 'border-zinc-100 hover:border-purple-100 bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-sans text-xs font-black text-zinc-800 flex items-center gap-1.5 leading-none">
                    <span className="text-lg">{suite.icon.substring(0, 2)}</span>
                    <span>{suite.name}</span>
                  </span>
                  <span className="font-sans text-xs font-black text-primary">R$ {suite.price}/dia</span>
                </div>
                <p className="font-body text-[11px] text-zinc-500 leading-relaxed">
                  {suite.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN: Hotel active guests check-in */}
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-sans text-base font-black text-zinc-800 mb-4">
              Hospedar Seus Pets (Check-In)
            </h2>

            <div className="space-y-3">
              {session.pets.map(pet => {
                const isCheckedIn = checkedInPetIds.includes(pet.id);
                return (
                  <div key={pet.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={pet.avatar} 
                        alt={pet.name} 
                        className="w-10 h-10 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-sans text-xs font-bold text-zinc-800">{pet.name}</h4>
                        <p className="font-body text-[10px] text-zinc-400 capitalize">{pet.breed}</p>
                      </div>
                    </div>

                    {isCheckedIn ? (
                      <button
                        onClick={() => handleCheckOut(pet.id)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-sans text-[11.5px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Fazer Checkout
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(pet.id)}
                        className="px-3 py-1 bg-purple-50 hover:bg-primary hover:text-white text-primary rounded-xl font-sans text-[11.5px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Fazer Check-in
                      </button>
                    )}
                  </div>
                );
              })}

              {session.pets.length === 0 && (
                <p className="font-body text-xs text-rose-500">Nenhum pet cadastrado para hospedar. Adicione um na página inicial! 🥺</p>
              )}
            </div>
          </div>

          <div className="mt-6 p-3.5 bg-purple-100/30 rounded-2xl flex items-start gap-2.5 border border-purple-100">
            <span className="text-lg">🚑</span>
            <p className="font-body text-[10px] text-purple-950 leading-relaxed font-semibold">
              <strong>Veterinário de plantão 24h:</strong> Nosso hotel conta com monitoramento médico constante para garantir a maior tranquilidade de todas as fofurinhas!
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Live feed Activity logs monitor */}
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-sans text-base font-black text-zinc-800 mb-2 flex items-center gap-1.5">
              <Video className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              <span>Câmera ao Vivo do Hotel</span>
            </h2>
            <p className="font-body text-[10px] text-zinc-500 mb-4">
              Acompanhe as travessuras e sonecas dos hóspedes em tempo real pelo feed abaixo!
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 bg-stone-50 border p-3 rounded-2xl">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="font-body text-[11px] text-zinc-700 leading-relaxed border-b border-dashed border-stone-200/60 pb-1.5 last:border-b-0">
                  {log}
                </div>
              ))}

              {checkedInPetIds.length === 0 && (
                <div className="py-20 text-center text-zinc-400 space-y-1">
                  <span className="text-3xl block">🎥</span>
                  <h3 className="font-sans text-xs font-bold text-zinc-500">Nenhum pet hospedado</h3>
                  <p className="font-body text-[11px] max-w-[150px] mx-auto">Faça check-in em hotel para ver as atualizações ao vivo!</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-emerald-50 rounded-2xl flex items-center gap-2 border border-emerald-100 text-emerald-800 font-sans text-[11px] font-bold">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
            <span>Câmeras certificadas e seguras</span>
          </div>
        </div>

      </div>

    </div>
  );
}
