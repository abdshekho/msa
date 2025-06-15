'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  const handleImageClick = (image: string) => {
    setMainImage(image);
  };
  
  const handleMouseEnter = () => {
    setIsZooming(true);
  };
  
  const handleMouseLeave = () => {
    setIsZooming(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };
  
  return (
    <div className="md:w-1/2">
      <div className="relative">
        <div 
          ref={imageRef}
          className="relative h-96 w-full mb-4 bg-card-10 dark:bg-card rounded-lg overflow-hidden cursor-crosshair"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={mainImage}
            alt={productName}
            fill
            className="object-contain bg-card-10 dark:bg-card transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            style={{
              transform: isZooming ? 'scale(1.7)' : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }}
          />
          
          {/* Zoom Square Indicator */}
          {/* {isZooming && (
            <div
              className="absolute w-20 h-20 border-2 border-white border-opacity-80 bg-white bg-opacity-20 pointer-events-none rounded-sm shadow-lg"
              style={{
                left: `${Math.max(0, Math.min(zoomPosition.x - 10, 90))}%`,
                top: `${Math.max(0, Math.min(zoomPosition.y - 10, 90))}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
           */}
          {/* Zoom Instructions */}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {product.images && product.images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          <div 
            className="relative h-20 bg-card-10 dark:bg-card rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleImageClick(product.imageCover)}
          >
            <Image
              src={product.imageCover}
              alt={`${productName} - main image`}
              fill
              className={`object-cover hover:opacity-80 transition-opacity ${mainImage === product.imageCover ? 'border-2 border-primary' : ''}`}
              sizes="(max-width: 768px) 20vw, 10vw"
            />
          </div>
          {product.images.map((image, index) => (
            image && (
              <div 
                key={index} 
                className="relative h-20 bg-card-10 dark:bg-card rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`${productName} - image ${index + 1}`}
                  fill
                  className={`object-cover hover:opacity-80 transition-opacity ${mainImage === image ? 'border-2 border-primary' : ''}`}
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