
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface NetflixCardProps {
  title: string;
  description?: string;
  image?: string;
  rating?: number;
  onClick?: () => void;
}

export function NetflixCard({ title, description, image, rating, onClick }: NetflixCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden bg-netflix-gray-dark border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
      onClick={onClick}
    >
      {/* Image container */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-900">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-600">{title.charAt(0)}</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
            {description && (
              <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 bg-netflix-gray-dark">
        <h3 className="text-white font-semibold text-base mb-1 truncate">{title}</h3>
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-300 text-sm">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
