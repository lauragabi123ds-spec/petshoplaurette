/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  avatar: string;
  age: number;
  // Dynamic metrics
  hunger: number;     // 0 - 100
  happiness: number;  // 0 - 100
  hygiene: number;    // 0 - 100
  energy: number;     // 0 - 100
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  pets: Pet[];
  selectedPetId: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: 'feed' | 'toy' | 'accessory' | 'spa';
  price: number;
  image: string;
  description: string;
  cuteLabel?: string; // e.g. "Mais Vendido!", "Purr-feito!"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Booking {
  id: string;
  petId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
