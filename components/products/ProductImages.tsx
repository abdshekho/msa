'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  product: {
    imageCover: string;
    images: string[];
  };
  productName: string;
}

export default function ProductImages({ product, productName }: ProductImagesProps) {
  const [mainImage, setMainImage] = useState(product.imageCover);
  
  const handleImageClick = (image: string) => {
    setMainImage(image);
  };
  
  return (
    <div className="md:w-1/2">
      <div className="relative h-96 w-full mb-4 bg-card-10 dark:bg-card rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-contain bg-card-10 dark:bg-card"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail Gallery */}
      {product.images && product.images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          <div 
            className="relative h-20 bg-card-10 dark:bg-card rounded-md overflow-hidden cursor-pointer"
            onClick={() => handleImageClick(product.imageCover)}
          >
            <Image
              src={product.imageCover}
              alt={`${productName} - main image`}
              fill
              className={`object-cover hover:opacity-80 ${mainImage === product.imageCover ? 'border-2 border-primary' : ''}`}
              sizes="(max-width: 768px) 20vw, 10vw"
            />
          </div>
          {product.images.map((image, index) => (
            image && (
              <div 
                key={index} 
                className="relative h-20 bg-card-10 dark:bg-card rounded-md overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`${productName} - image ${index + 1}`}
                  fill
                  className={`object-cover hover:opacity-80 ${mainImage === image ? 'border-2 border-primary' : ''}`}
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}