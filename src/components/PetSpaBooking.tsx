/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSession, Booking } from '../types';
import { Sparkles, Scissors, Clock, Calendar, Check, CalendarCheck, CheckCircle, Trash2 } from 'lucide-react';

interface PetSpaBookingProps {
  session: UserSession;
  onAddBooking: (booking: Booking) => void;
  bookings: Booking[];
  onRemoveBooking: (id: string) => void;
}

export default function PetSpaBooking({ session, onAddBooking, bookings, onRemoveBooking }: PetSpaBookingProps) {
  const [selectedPetId, setSelectedPetId] = useState(session.selectedPetId || session.pets[0]?.id || '');
  const [selectedPackage, setSelectedPackage] = useState<string>('banho');
  const [bookingDate, setBookingDate] = useState<string>('2026-05-28');
  const [bookingTime, setBookingTime] = useState<string>('14:00');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Spa detailed packages
  const packages = [
    {
      id: 'banho',
      name: 'Banho de Espuma Perfumada',
      price: 49.00,
      icon: '🧼',
      timeDesc: '45 minutos de mimos',
      description: 'Banho quente relaxante usando shampoo neutro de camomila, hidratação de aveia e secagem hiper silenciosa para não assustar.'
    },
    {
      id: 'tosa',
      name: 'Tosa Ursinho Premium',
      price: 85.00,
      icon: '✂️',
      timeDesc: '1h 15m de estilismo',
      description: 'Corte tesoura especializado dando estilo arredondado super fofo (ursinho). Perfeito para pets peludões!'
    },
    {
      id: 'massagem',
      name: 'Spa Relax com Hidratação',
      price: 39.00,
      icon: '🐾',
      timeDesc: '30 minutos de zen',
      description: 'Massagem suave nas patinhas com bálsamo hidratante 100% natural, prevenindo ressecamentos e trazendo paz.'
    },
    {
      id: 'claws',
      name: 'Pintura de Patas (Segura)',
      price: 25.00,
      icon: '💅',
      timeDesc: '20 minutos de cor',
      description: 'Esmaltação de garras para festinhas usando pigmentação vegana e base de água ultra-rápida, totalmente segura e atóxica.'
    }
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) {
      alert("Por favor, selecione ou cadastre um pet primeiro!");
      return;
    }

    const pkg = packages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      petId: selectedPetId,
      serviceName: pkg.name,
      date: bookingDate,
      time: bookingTime,
      status: 'scheduled',
      price: pkg.price
    };

    onAddBooking(newBooking);
    setShowSuccessModal(true);
  };

  const getPetName = (id: string) => {
    const found = session.pets.find(p => p.id === id);
    return found ? found.name : 'Vários';
  };

  const getPetAvatar = (id: string) => {
    const found = session.pets.find(p => p.id === id);
    return found ? found.avatar : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=100';
  };

  return (
    <div className="space-y-6">
      
      {/* Intro info card */}
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100/70 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <span className="text-3xl block">🛀✨</span>
        <div className="space-y-1">
          <h2 className="font-sans text-sm font-black text-amber-900">
            Bem-vindo ao Banho & Tosa Estrelar Paws & Play!
          </h2>
          <p className="font-body text-xs text-amber-800 leading-relaxed">
            Aqui nós tratamos seu pet como a realeza que ele é. Nossos profissionais são especialistas em massagens antiestresse, secadores sussurrantes e muito amor!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER PANEL: Main scheduling picker */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-purple-100 shadow-sm">
          <h2 className="font-sans text-base font-black text-zinc-800 mb-4 flex items-center gap-1.5 leading-none">
            <span>Agendar Novo Serviço</span>
          </h2>

          <form onSubmit={handleBook} className="space-y-6">
            
            {/* STEP 1: SELECT PET */}
            <div className="space-y-2">
              <span className="font-sans text-xs font-bold text-zinc-500 tracking-wider uppercase block">
                1. Quem vai ganhar o spa?
              </span>
              
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {session.pets.map(pet => {
                  const isChosen = pet.id === selectedPetId;
                  return (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 whitespace-nowrap min-w-[150px] cursor-pointer ${
                        isChosen
                          ? 'border-primary bg-purple-50/50 outline-none ring-2 ring-purple-100'
                          : 'border-zinc-100 hover:border-purple-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <img 
                        src={pet.avatar} 
                        alt={pet.name} 
                        className="w-10 h-10 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left">
                        <p className="font-sans text-xs font-bold text-zinc-800">{pet.name}</p>
                        <p className="font-body text-[10px] text-zinc-400 capitalize">{pet.type}</p>
                      </div>
                    </button>
                  );
                })}

                {session.pets.length === 0 && (
                  <p className="font-body text-xs text-rose-500">Nenhum pet cadastrado. Adicione um na página inicial! ❤️</p>
                )}
              </div>
            </div>

            {/* STEP 2: SELECT PACK */}
            <div className="space-y-3">
              <span className="font-sans text-xs font-bold text-zinc-500 tracking-wider uppercase block">
                2. Escolha o Pacote de Mimamento
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {packages.map(pkg => {
                  const isSelected = pkg.id === selectedPackage;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer flex gap-3.5 relative ${
                        isSelected
                          ? 'border-primary bg-purple-50/20'
                          : 'border-zinc-100 hover:border-purple-200 hover:bg-zinc-50/50'
                      }`}
                    >
                      {/* Check dot */}
                      {isSelected && (
                        <span className="absolute top-3 right-3 p-0.5 bg-primary text-white rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}

                      <span className="text-2xl p-2 bg-zinc-50 rounded-2xl h-fit">
                        {pkg.icon}
                      </span>
                      <div className="space-y-1 pr-4">
                        <h3 className="font-sans text-xs font-bold text-zinc-800 flex items-center gap-1.5 leading-none">
                          <span>{pkg.name}</span>
                        </h3>
                        <p className="font-body text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1 font-sans text-[11px] font-extrabold">
                          <span className="text-primary">R$ {pkg.price.toFixed(2)}</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-zinc-600 font-medium">{pkg.timeDesc}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: DATE & TIME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <label className="font-sans text-xs font-bold text-zinc-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Data do Atendimento
                </label>
                <input 
                  type="date"
                  required
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-body text-xs outline-none focus:border-primary"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <label className="font-sans text-xs font-bold text-zinc-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Horário Desejado
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-body text-xs outline-none focus:border-primary"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                >
                  <option value="09:00">09:00 (Manhã fresquinha)</option>
                  <option value="10:30">10:30 (Sesta matinal)</option>
                  <option value="13:00">13:00 (Solinho da tarde)</option>
                  <option value="14:30">14:30 (Hora do carinho)</option>
                  <option value="16:00">16:00 (Pôr-do-sol fofo)</option>
                  <option value="17:30">17:30 (Soneca final)</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-secondary-yellow hover:brightness-105 active:scale-98 text-secondary-on font-sans text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300"
            >
              <CalendarCheck className="w-4.5 h-4.5" />
              <span>Reservar Sessão Estrelar</span>
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: Scheduled Bookings List */}
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-sans text-base font-black text-zinc-800 mb-4 flex items-center gap-1.5 leading-none">
              <span>Agendamentos do Lar</span>
              <span className="text-zinc-400 font-medium font-body text-2xs">({bookings.length})</span>
            </h2>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {bookings.map(book => (
                <div key={book.id} className="p-3.5 rounded-2xl border border-zinc-100 relative group flex gap-3 items-start hover:border-purple-100 transition-all">
                  
                  {/* Delete button */}
                  <button
                    onClick={() => onRemoveBooking(book.id)}
                    className="absolute top-2.5 right-2.5 p-1 hover:bg-rose-50 text-zinc-300 hover:text-rose-500 rounded-lg group-hover:opacity-100 transition-opacity"
                    title="Remover Agendamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <img 
                    src={getPetAvatar(book.petId)} 
                    alt="Pet Avatar" 
                    className="w-10 h-10 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />

                  <div className="space-y-1">
                    <h3 className="font-sans text-xs font-bold text-zinc-800">{book.serviceName}</h3>
                    <p className="font-body text-[10px] text-zinc-500">
                      Pet: <strong>{getPetName(book.petId)}</strong>
                    </p>
                    <div className="flex gap-1.5 p-1 rounded-lg bg-purple-50/50 font-body text-[10px] text-primary w-fit font-bold">
                      <span>📅 {book.date}</span>
                      <span>•</span>
                      <span>⏰ {book.time}</span>
                    </div>
                  </div>

                </div>
              ))}

              {bookings.length === 0 && (
                <div className="py-12 text-center text-zinc-400 space-y-2">
                  <span className="text-3xl block">🔮</span>
                  <h3 className="font-sans text-xs font-bold text-zinc-500">Nenhuma reserva agendada</h3>
                  <p className="font-body text-[11px]">Seu pet está esperando um ótimo dia de hidratação de patinhas!</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-[11px] font-body text-zinc-600 leading-relaxed">
            🌿 <strong>Canonicidade Higiênica:</strong> Nós usamos apenas essências hipoalergênicas e toalhas térmicas limpas de algodão fofo esterilizado.
          </div>
        </div>

      </div>

      {/* CONFIRMATION POPUP */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-purple-100 shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-purple-50 text-primary rounded-full flex items-center justify-center mx-auto shadow-sm animate-cute-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="font-sans text-lg font-black text-zinc-800">
              Sessão Agendada! ✨🐩
            </h3>
            <p className="font-body text-xs text-zinc-500 leading-relaxed">
              O agendamento foi salvo com sucesso! Diga para o seu pet que a banheira de bolhas já o aguarda com muitos petiscos orgânicos.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 bg-primary text-white font-sans text-sm font-bold rounded-xl cursor-pointer shadow-sm hover:brightness-105 transition-all"
            >
              Uhuul, legal! 🌟
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
