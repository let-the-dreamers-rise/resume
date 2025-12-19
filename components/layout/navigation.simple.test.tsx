import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { Navigation } from '../ui/Navigation';
import { ThemeProvider } from '../../lib/theme/theme-context';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

// Test wrapper with theme provider
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('Navigation Simple Tests', () => {
  it('should render header component', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    // Should render without errors
    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('should render navigation with basic items', () => {
    const navItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ];

    render(
      <TestWrapper>
        <Navigation items={navItems} />
      </TestWrapper>
    );
    
    // Should render all navigation items
    navItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('should handle navigation links properly', () => {
    const navItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ];

    render(
      <TestWrapper>
        <Navigation items={navItems} />
      </TestWrapper>
    );
    
    // Links should have proper href attributes
    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should handle external links', () => {
    const navItems = [
      { label: 'GitHub', href: 'https://github.com', external: true },
    ];

    render(
      <TestWrapper>
        <Navigation items={navItems} />
      </TestWrapper>
    );
    
    const externalLink = screen.getByText('GitHub').closest('a');
    expect(externalLink).toHaveAttribute('href', 'https://github.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should be accessible', () => {
    const navItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ];

    render(
      <TestWrapper>
        <Navigation items={navItems} />
      </TestWrapper>
    );
    
    // Should have proper navigation role
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Links should be focusable
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('should handle mobile viewport', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('max-width: 767px'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    // Should render without errors on mobile
    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('should handle theme toggle', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    // Should have theme toggle button (use getAllByRole to handle multiple buttons)
    const themeToggleButtons = screen.getAllByRole('button');
    const themeToggle = themeToggleButtons.find(button => 
      button.getAttribute('aria-label')?.includes('Switch to')
    );
    expect(themeToggle).toBeInTheDocument();
  });
});
