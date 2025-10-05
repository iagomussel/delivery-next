
'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2"
      title={`Switch to ${theme === 'original' ? 'Netflix' : 'Original'} theme`}
    >
      <Palette className="h-4 w-4" />
      <span className="hidden sm:inline">
        {theme === 'original' ? 'Netflix Theme' : 'Original Theme'}
      </span>
    </Button>
  );
}
