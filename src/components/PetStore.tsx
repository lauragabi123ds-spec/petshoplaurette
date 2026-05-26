/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ShoppingBag, Search, Plus, Minus, Trash2, CheckCircle, Gift, Sparkles, X } from 'lucide-react';

interface PetStoreProps {
  onAddCartMessage: (text: string) => void;
}

export default function PetStore({ onAddCartMessage }: PetStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Boutique adorable listings
  const products: Product[] = [
    {
      id: 'p1',
      name: 'Cupcake Orgânico Integral',
      category: 'feed',
      price: 14.90,
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=400&auto=format&fit=crop',
      description: 'Lanchinho 100% natural com cobertura de abóbora e mel, livre de conservantes químicos.',
      cuteLabel: 'Fofura Saborosa! 🧁'
    },
    {
      id: 'p2',
      name: 'Maxi Ossinho Ultra Flex',
      category: 'toy',
      price: 29.90,
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=400&auto=format&fit=crop',
      description: 'Brinquedo de roer super divertido com cheirinho de menta e textura para massagear a gengiva.',
      cuteLabel: 'Campeão de Vendas! 🦴'
    },
    {
      id: 'p3',
      name: 'Castelo Real Arranhador',
      category: 'toy',
      price: 219.00,
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=400&auto=format&fit=crop',
      description: 'Estrutura luxuosa de 3 andares com cordas de sisal premium e almofadas de pelúcia fofa para gatos.',
      cuteLabel: 'Conforto Imperial 🏰'
    },
    {
      id: 'p4',
      name: 'Coleira Glitter Estrelar',
      category: 'accessory',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?q=80&w=400&auto=format&fit=crop',
      description: 'Coleira estilosa ajustável com brilho furta-cor e pingente dourado livre de níquel.',
      cuteLabel: 'Puro Brilho! ✨'
    },
    {
      id: 'p5',
      name: 'Casinha Nuvem de Argila',
      category: 'accessory',
      price: 119.90,
      image: 'https://images.unsplash.com/photo-1553736026-ff14d30a623c?q=80&w=400&auto=format&fit=crop',
      description: 'Cama macia e termostática perfeita para sestas reconfortantes em formato de novelinho fofo.',
      cuteLabel: 'Sesta dos Anjos ☁️'
    },
    {
      id: 'p6',
      name: 'Ração Salmão dos Mares',
      category: 'feed',
      price: 68.00,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=400&auto=format&fit=crop',
      description: 'Ração seca premium super premium enriquecida com ômega 3, espinafre fresco e fibras.',
      cuteLabel: 'Saúde de Ferro! 🐠'
    },
    {
      id: 'p7',
      name: 'Brinquedo Ratinho Alegre',
      category: 'toy',
      price: 19.90,
      image: 'https://images.unsplash.com/photo-1535268647977-a403b69fc756?q=80&w=400&auto=format&fit=crop',
      description: 'Pequeno ratinho de feltragem manual com erva-dos-gatos (catnip) que deita chacoalhes divertidos.',
      cuteLabel: 'Gatinho Sapeca! 🐱'
    },
    {
      id: 'p8',
      name: 'Bandana Amor do Dono',
      category: 'accessory',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400',
      description: 'Bandana de algodão egípcio macio com estampa artesanal de ossinhos e corações.',
      cuteLabel: 'Muito Adorável! ❤️'
    }
  ];

  // Filters logic
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    // Dynamic message feedback
    onAddCartMessage(`${product.name} foi adicionado ao seu carrinho de mimos! 🛍️`);
  };

  const updateQuantity = (id: string, change: number) => {
    const existing = cart.find(item => item.product.id === id);
    if (!existing) return;

    const newQty = existing.quantity + change;
    if (newQty <= 0) {
      setCart(cart.filter(item => item.product.id !== id));
    } else {
      setCart(cart.map(item => 
        item.product.id === id 
          ? { ...item, quantity: newQty } 
          : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.product.id !== id));
  };

  // Computations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryCost = subtotal > 150 ? 0 : (subtotal > 0 ? 12.90 : 0);
  const grandTotal = subtotal + deliveryCost;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Simulate API reservation logic
    onAddCartMessage(`Seu pedido no valor de R$ ${grandTotal.toFixed(2)} foi processado! 🐾`);
    setCheckoutSuccess(true);
    setCart([]);
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Cart Summary Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Adorable Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input 
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white border border-purple-100 focus:border-primary-light focus:ring-0 rounded-2xl font-body text-sm outline-none transition-all shadow-sm"
            placeholder="O que seu amiguinho deseja caçar hoje?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Toggle Cart button */}
        <button 
          onClick={() => setShowCartDrawer(true)}
          className="w-full md:w-auto px-5 py-3 bg-primary text-white font-sans text-sm font-bold rounded-2xl flex items-center justify-center gap-2 relative shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Ver Carrinho</span>
          
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 px-2.5 py-1 bg-secondary-yellow text-secondary-on text-xs font-black rounded-full animate-bounce">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Category Chips Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 pr-4 scrollbar-none">
        {[
          { id: 'all', label: 'Todos 🌟' },
          { id: 'feed', label: 'Petiscos Deliciosos 🧁' },
          { id: 'toy', label: 'Brincadeiras Felizes 🧸' },
          { id: 'accessory', label: 'Acessórios & Sonho 🎀' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4.5 py-2 rounded-full font-sans text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-secondary-yellow text-secondary-on shadow-sm border border-amber-300'
                : 'bg-white text-zinc-600 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(prod => (
          <div 
            key={prod.id}
            className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group relative"
          >
            {/* Cute tag */}
            {prod.cuteLabel && (
              <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-secondary-yellow text-secondary-on font-sans font-extrabold text-[10px] shadow-sm">
                {prod.cuteLabel}
              </span>
            )}

            {/* Img Container */}
            <div className="h-44 w-full relative overflow-hidden bg-purple-50/20">
              <img 
                src={prod.image} 
                alt={prod.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* details body */}
            <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold text-zinc-400 tracking-wider uppercase">
                  {prod.category === 'feed' ? 'Alimentação' : prod.category === 'toy' ? 'Brinquedo' : 'Acessórios'}
                </span>
                <h3 className="font-sans text-sm font-bold text-zinc-800 line-clamp-1 group-hover:text-primary transition-colors">
                  {prod.name}
                </h3>
                <p className="font-body text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-sans text-base font-black text-primary">
                  R$ {prod.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(prod)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-primary hover:text-white text-primary rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" /> Adicionar
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-400 space-y-2">
            <span className="text-3xl block">🔍</span>
            <h3 className="font-sans font-bold text-zinc-600">Nenhum mimo encontrado</h3>
            <p className="font-body text-xs">Tente buscar por outras palavras em nosso catálogo!</p>
          </div>
        )}
      </div>

      {/* CART DRAWER PANEL */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between p-6 relative animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                <h2 className="font-sans text-base font-black text-primary flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Sacola de Mimos</span>
                  <span className="font-body text-xs text-zinc-400">({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                </h2>
                <button 
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 hover:bg-zinc-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-zinc-400 hover:text-zinc-700" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto pr-1 py-4 space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3 bg-zinc-50/50 p-2.5 rounded-2xl border border-zinc-100">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-sans text-xs font-bold text-zinc-800 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="font-sans text-xs font-extrabold text-primary pt-0.5">
                        R$ {item.product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity modifiers */}
                      <div className="flex items-center gap-1.5 bg-white border border-purple-100 rounded-lg p-0.5">
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-purple-50 text-zinc-500 rounded"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-sans text-xs font-bold px-1.5">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-purple-50 text-zinc-500 rounded"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-zinc-300 hover:text-rose-500 transition-colors"
                        title="Remover Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-20 text-center text-zinc-400 space-y-2">
                  <span className="text-4xl block">🧺</span>
                  <h3 className="font-sans text-sm font-bold text-zinc-500">Seu carrinho está vazio</h3>
                  <p className="font-body text-xs">Explore nossa lojinha e encha de brinquedinhos!</p>
                </div>
              )}
            </div>

            {/* Subtotal and Summary */}
            <div className="border-t border-zinc-100 pt-4 space-y-3 bg-white">
              <div className="flex justify-between text-xs font-sans font-bold text-zinc-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-sans font-bold text-zinc-600">
                <span className="flex items-center gap-1">
                  Frete 
                  {subtotal > 150 && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] rounded font-black">Grátis</span>}
                </span>
                <span>{deliveryCost === 0 ? 'Festa! R$ 0,00' : `R$ ${deliveryCost.toFixed(2)}`}</span>
              </div>
              
              {subtotal < 150 && subtotal > 0 && (
                <p className="font-body text-[10px] text-purple-600 font-semibold bg-purple-50/50 p-2 rounded-xl">
                  🎁 Compre mais <strong>R$ {(150 - subtotal).toFixed(2)}</strong> para ganhar <strong>Frete Grátis</strong>!
                </p>
              )}

              <div className="flex justify-between text-sm font-sans font-black text-primary pt-1 pb-3">
                <span>Total Estimado</span>
                <span>R$ {grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3.5 text-center font-sans text-sm font-bold rounded-2xl shadow-md transition-all ${
                  cart.length > 0
                    ? 'bg-secondary-yellow hover:brightness-105 active:scale-98 text-secondary-on cursor-pointer'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                }`}
              >
                Finalizar Compra Fofinha 🐾
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CHECKOUT SUCCESS MODAL */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-purple-100 shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="font-sans text-lg font-black text-zinc-800">
              Uhuul! Pedido Processado! 🐶🎉
            </h3>
            <p className="font-body text-xs text-zinc-500 leading-relaxed">
              Os mimos do seu bichinho já estão sendo carinhosamente preparados e banhados em perfume de camomila. Logo chegarão para divertir o seu lar!
            </p>

            <button
              onClick={() => setCheckoutSuccess(false)}
              className="w-full py-2.5 bg-primary text-white font-sans text-sm font-bold rounded-xl cursor-pointer shadow-sm hover:brightness-105 transition-all"
            >
              Comprar mais coisas fofas 🧸
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
