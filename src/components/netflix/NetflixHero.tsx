
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Play } from 'lucide-react';

export function NetflixHero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
      
      {/* Background image placeholder - in production, this would be a featured restaurant image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Comida deliciosa na sua porta
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Descubra os melhores restaurantes da sua região e peça sua comida favorita 
            com entrega rápida e segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/restaurants/discover">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-netflix-red hover:bg-netflix-red-dark text-white font-semibold"
              >
                <Play className="h-5 w-5 mr-2 fill-current" />
                Descobrir Restaurantes
              </Button>
            </Link>
            <Link href="/auth/register/customer">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-2 border-white/70 text-white hover:bg-white/10 font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}
