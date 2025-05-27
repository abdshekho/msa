'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCart } from './actions';
import { CART_UPDATED_EVENT } from './cartEvents';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    nameAr: string;
    price: number;
    imageCover: string;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCart();
    };
    
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}