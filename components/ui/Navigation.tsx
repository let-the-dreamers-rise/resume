'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavigationProps {
  items: NavItem[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showActiveIndicator?: boolean;
  currentPath?: string;
}

export function Navigation({
  items,
  className = '',
  orientation = 'horizontal',
  showActiveIndicator = true,
  currentPath,
}: NavigationProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(href);
  };

  const baseClasses = orientation === 'horizontal' 
    ? 'flex items-center space-x-6' 
    : 'flex flex-col space-y-3';

  return (
    <nav className={`${baseClasses} ${className}`}>
      {items.map((item) => {
        const isActive = showActiveIndicator && isActiveRoute(item.href);
        
        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-normal"
            >
              {item.label}
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors duration-normal hover:text-primary ${
              isActive
                ? orientation === 'horizontal'
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-primary border-l-2 border-primary pl-3'
                : 'text-foreground/70'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}