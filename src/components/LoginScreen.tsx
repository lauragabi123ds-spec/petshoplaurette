/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, PawPrint, Sparkles, User, Heart } from 'lucide-react';
import { UserSession, Pet } from '../types';

interface LoginScreenProps {
  onSuccess: (session: UserSession) => void;
}

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  // Toggle between Login and signup
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [name, setName] = useState('Laura Gabriela');
  const [email, setEmail] = useState('laura@pawsplay.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up pet details
  const [petName, setPetName] = useState('Bento');
  const [petType, setPetType] = useState<'dog' | 'cat' | 'bird' | 'rabbit'>('dog');
  const [petBreed, setPetBreed] = useState('Golden Retriever');
  const [petAge, setPetAge] = useState(2);

  // Standard pets definition if they login straight away
  const defaultPets: Pet[] = [
    {
      id: 'default-1',
      name: 'Frederico',
      type: 'dog',
      breed: 'Shih Tzu',
      avatar: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop',
      age: 3,
      hunger: 65,
      happiness: 80,
      hygiene: 90,
      energy: 70
    },
    {
      id: 'default-2',
      name: 'Biscoito',
      type: 'cat',
      breed: 'Persa Siamês',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop',
      age: 1,
      hunger: 40,
      happiness: 95,
      hygiene: 60,
      energy: 85
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Simulate login
      onSuccess({
        isLoggedIn: true,
        name: name || 'Convidado Especial',
        email: email,
        pets: defaultPets,
        selectedPetId: defaultPets[0].id
      });
    } else {
      // Create user-defined pet
      // Avatars based on type
      let avatar = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop'; // standard dog
      if (petType === 'cat') {
        avatar = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop';
      } else if (petType === 'bird') {
        avatar = 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?q=80&w=400&auto=format&fit=crop';
      } else if (petType === 'rabbit') {
        avatar = 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=400&auto=format&fit=crop';
      }

      const customPet: Pet = {
        id: `custom-${Date.now()}`,
        name: petName || 'Fofinho',
        type: petType,
        breed: petBreed || 'Misto fofo',
        avatar: avatar,
        age: Number(petAge) || 1,
        hunger: 70,
        happiness: 100,
        hygiene: 80,
        energy: 100
      };

      onSuccess({
        isLoggedIn: true,
        name: name,
        email: email,
        pets: [customPet, ...defaultPets],
        selectedPetId: customPet.id
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden pt-4">
      {/* Background Image styling mirroring the material mockup exactly */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Paws and Play Blurry Background" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNUJahIl68NziRQJBKnzgDCNLKgVdsPbyl9IbrR3aszwrH7tHjDv5mJgQ0SP5KO7MwU5wRGGlYc5dz2pHpu4pI1X39DYoadHu44nJtks3KO8UzsW0XxCQ8n3BtpLqPvKn8rII5OMmAcpVT8JEXgbNej4AzgySNxMPYtldxwpCvJgfc0krkfv_IUN8SI3VJ1OXnwTy9EFVhw-7wrx37RDjQMjsG2-X2LfVhW4s_J3XN44xBiGGIfK-_d3hZum-QVR595_C1q0X5AQ3U"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Header section replicating the original image */}
      <header className="relative z-10 flex items-center w-full px-6 md:px-16 py-4 h-20">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-secondary-yellow flex items-center justify-center shadow-md animate-cute-bounce">
            <PawPrint className="w-6 h-6 text-secondary-on fill-current" />
          </div>
          <span className="font-sans text-2xl text-white font-extrabold tracking-tight drop-shadow-sm">
            Paws & Play
          </span>
        </div>
      </header>

      {/* Main Form container mirroring the material glass view */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px] login-glass rounded-[32px] p-8 md:p-10 border border-white/60 tinted-shadow transition-all duration-300">
          
          <div className="text-center mb-6">
            {/* Paw medallion */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-yellow rounded-full mb-4 shadow-sm border border-amber-300/30">
              <PawPrint className="w-9 h-9 text-secondary-on fill-current" />
            </div>
            
            <h1 className="font-sans text-2xl md:text-3xl text-primary font-bold tracking-tight mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar Conta Fofinha'}
            </h1>
            <p className="font-body text-sm text-on-surface-variant font-medium">
              {isLogin 
                ? 'Sentimos sua falta (e os pets também!)' 
                : 'Cadastre-se e comece a mimar seus melhores amigos!'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Active User Name (for sign up only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="font-sans text-xs font-bold text-on-surface-variant ml-1" htmlFor="name">
                  Seu Nome
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline text-purple-600" />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-stone-100 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl font-body text-sm transition-all outline-none"
                    id="name"
                    placeholder="Como podemos te chamar?"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-sans text-xs font-bold text-on-surface-variant ml-1" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-stone-100 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl font-body text-sm transition-all outline-none"
                  id="email"
                  placeholder="nome@exemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="font-sans text-xs font-bold text-on-surface-variant" htmlFor="password">
                  Senha
                </label>
                {isLogin && (
                  <button 
                    type="button" 
                    className="font-sans text-xs text-primary font-bold hover:underline transition-all"
                    onClick={() => alert("Função em desenvolvimento: Um e-mail de recuperação de senha foi simulado para seu endereço!")}
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  className="w-full pl-12 pr-12 py-3 bg-stone-100 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl font-body text-sm transition-all outline-none"
                  id="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* IF SIGNUP: Add lovely Pet section */}
            {!isLogin && (
              <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl space-y-3 mt-2">
                <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Cadastrar Seu Primeiro Pet</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-zinc-600">Nome do Pet</span>
                    <input 
                      className="w-full px-3 py-1.5 bg-white border border-purple-200 focus:border-primary rounded-xl font-body text-xs outline-none"
                      placeholder="Fifi, Pipoca..."
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-zinc-600">Idade (anos)</span>
                    <input 
                      type="number"
                      className="w-full px-3 py-1.5 bg-white border border-purple-200 focus:border-primary rounded-xl font-body text-xs outline-none"
                      placeholder="Anos"
                      value={petAge}
                      onChange={(e) => setPetAge(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-zinc-600">Raça</span>
                    <input 
                      className="w-full px-3 py-1.5 bg-white border border-purple-200 focus:border-primary rounded-xl font-body text-xs outline-none"
                      placeholder="Ex: Poodle, Persa"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-zinc-600">Tipo de Pet</span>
                    <select
                      className="w-full px-2 py-1.5 bg-white border border-purple-200 focus:border-primary rounded-xl font-body text-xs outline-none"
                      value={petType}
                      onChange={(e) => setPetType(e.target.value as any)}
                    >
                      <option value="dog">Cachorrinho 🐶</option>
                      <option value="cat">Gatinho 🐱</option>
                      <option value="bird">Passarinho 🐦</option>
                      <option value="rabbit">Coelhinho 🐰</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Action button mirroring sunny yellow exact theme */}
            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-3.5 bg-secondary-yellow text-secondary-on font-sans text-[16px] font-bold rounded-2xl shadow-md hover:brightness-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/30"
              >
                {isLogin ? 'Entrar' : 'Cadastrar e Começar'}
                <Sparkles className="w-5 h-5 fill-current text-purple-600" />
              </button>
            </div>
          </form>

          {/* Alternative triggers */}
          <div className="mt-6 pt-5 border-t border-purple-100 text-center">
            <p className="font-body text-sm text-zinc-600">
              {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta fofinha?'}
              <button 
                className="text-primary font-bold hover:underline underline-offset-4 ml-1.5 cursor-pointer"
                onClick={() => {
                  setIsLogin(!isLogin);
                  // Dynamic autofills for demo experience
                  if (isLogin) {
                    setName('Laura Gabriela');
                    setEmail('laura@pawsplay.com');
                  }
                }}
              >
                {isLogin ? 'Cadastre-se' : 'Entrar na Conta'}
              </button>
            </p>
          </div>

        </div>
      </div>

      {/* Footer mirroring mockup exactly */}
      <footer className="relative z-10 px-6 py-6 text-center">
        <p className="font-sans text-xs text-white/80 font-medium tracking-wide drop-shadow-sm">
          © {new Date().getFullYear()} Paws & Play. Criado com amor para os seus melhores amigos.
        </p>
      </footer>
    </div>
  );
}
