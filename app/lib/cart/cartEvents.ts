'use client';

// Event for cart updates
export const CART_UPDATED_EVENT = 'cart-updated';

// Helper function to trigger cart update event
export function triggerCartUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}