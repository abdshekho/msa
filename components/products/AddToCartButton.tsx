'use client';

import { useState } from 'react';
import { addToCart } from '@/app/lib/cart/actions';
import { triggerCartUpdate } from '@/app/lib/cart/cartEvents';
import { FaCartPlus } from 'react-icons/fa';
import { Locale } from '@/i18n-config';

interface AddToCartButtonProps {
  productId: string;
  className?: string;
  lang?: Locale;
  children?: React.ReactNode;
}

export default function AddToCartButton({ productId, lang, className }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const result = await addToCart(productId, 1);

      if (result.success) {
        // Trigger cart update event to refresh cart UI
        triggerCartUpdate();
        setAdded(true); // Show "Added"
        setTimeout(() => setAdded(false), 500); // Revert after 2s
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
      className={ className || `flex items-center gap-2 text-white  bg-green-600 dark:bg-green-700 px-4 py-3  
        rounded-lg ${loading ? ' animate-pulse' : ''} ${added ? ' animate-ping' : ''}` }
    >
      <FaCartPlus />
      { lang === 'ar' ? (loading ? 'يتم الإضافة...'
        : added ? 'تمت الإضافة'
          : 'أضف إلى السلة')
        : (loading ? 'Adding...'
          : added ? 'Added'
            : 'Add to Cart')
      }
    </button>
  );
}