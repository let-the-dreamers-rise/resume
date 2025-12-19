'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { OfflineIndicator } from '../ui/OfflineIndicator';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className={`flex-1 ${className}`}>
        {children}
      </div>
      <Footer />
      <OfflineIndicator />
    </div>
  );
}

// Export individual components for flexibility
export { Header } from './Header';
export { Footer } from './Footer';