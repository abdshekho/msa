'use client';

import { useState } from 'react';
import { addToCart } from '@/app/lib/cart/actions';
import { triggerCartUpdate } from '@/app/lib/cart/cartEvents';
import { FaCartPlus } from 'react-icons/fa';

interface AddToCartButtonProps {
  productId: string;
  className?: string;
  children?: React.ReactNode;
}

export default function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const result = await addToCart(productId, 1);

      if (result.success) {
        // Trigger cart update event to refresh cart UI
        triggerCartUpdate();
      } else {
        console.error('Failed to add to cart:', result.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={ handleAddToCart }
      disabled={ loading }
      className={ className || "flex items-center gap-2 text-white  bg-green-600 dark:bg-green-700 px-4 py-3  rounded-lg" }
    >
      <FaCartPlus />
      { loading ? 'Adding...' : 'Add to Cart' }
    </button>
  );
}