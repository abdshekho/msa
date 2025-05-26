'use client';

import React, { useState } from 'react';
import { addToCart } from '@/app/lib/cart/actions';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  lang: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, lang }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const isArabic = lang === 'ar';
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await addToCart(productId, quantity);
      
      if (result.success) {
        setMessage(isArabic ? 'تمت إضافة المنتج إلى سلة التسوق' : 'Product added to cart');
        router.refresh();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(result.error || (isArabic ? 'حدث خطأ ما' : 'Something went wrong'));
      }
    } catch (error) {
      setMessage(isArabic ? 'حدث خطأ ما' : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <span className="mr-3 dark:text-white">{isArabic ? 'الكمية:' : 'Quantity:'}</span>
        <div className="flex items-center border rounded">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)}
            className="px-3 py-1 border-r"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)}
            className="px-3 py-1 border-l"
          >
            +
          </button>
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors w-full"
      >
        {isLoading 
          ? (isArabic ? 'جاري الإضافة...' : 'Adding...') 
          : (isArabic ? 'أضف إلى السلة' : 'Add to Cart')}
      </button>
      
      {message && (
        <div className={`mt-3 p-2 text-center rounded ${message.includes('error') || message.includes('خطأ') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;