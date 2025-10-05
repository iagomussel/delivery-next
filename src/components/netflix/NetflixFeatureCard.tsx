
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface NetflixFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function NetflixFeatureCard({ icon: Icon, title, description }: NetflixFeatureCardProps) {
  return (
    <Card className="text-center bg-netflix-gray-dark border-netflix-gray-light hover:border-netflix-red transition-all duration-300 group">
      <CardHeader>
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-netflix-red/10 flex items-center justify-center group-hover:bg-netflix-red/20 transition-colors">
          <Icon className="h-8 w-8 text-netflix-red" />
        </div>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
