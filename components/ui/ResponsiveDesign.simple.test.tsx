import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock components for testing
const TestComponent = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-responsive-xl font-bold mb-4">Test Heading</h1>
    <p className="text-responsive-base leading-relaxed">Test paragraph content</p>
    <button className="px-4 py-2 bg-primary text-white rounded-lg min-h-[44px] min-w-[44px]">
      Test Button
    </button>
    <img 
      src="/test-image.jpg" 
      alt="Test image description"
      className="w-full h-auto"
      loading="lazy"
    />
    {children}
  </div>
);

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (width: number) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      const matches = (() => {
        if (query.includes('min-width: 640px')) return width >= 640;
        if (query.includes('min-width: 768px')) return width >= 768;
        if (query.includes('min-width: 1024px')) return width >= 1024;
        if (query.includes('min-width: 1280px')) return width >= 1280;
        if (query.includes('max-width: 767px')) return width <= 767;
        return false;
      })();
      
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });
};

describe('Responsive Design Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render responsive container', () => {
    render(<TestComponent>Test content</TestComponent>);
    
    const container = document.querySelector('.container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('mx-auto', 'px-4', 'py-8');
  });

  it('should have responsive text classes', () => {
    render(<TestComponent>Test content</TestComponent>);
    
    const heading = screen.getByText('Test Heading');
    expect(heading).toHaveClass('text-responsive-xl', 'font-bold');
    
    const paragraph = screen.getByText('Test paragraph content');
    expect(paragraph).toHaveClass('text-responsive-base', 'leading-relaxed');
  });

  it('should have accessible button sizing', () => {
    render(<TestComponent>Test content</TestComponent>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
  });

  it('should have responsive images', () => {
    render(<TestComponent>Test content</TestComponent>);
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('w-full', 'h-auto');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('alt', 'Test image description');
  });

  it('should handle mobile viewport', () => {
    mockMatchMedia(320);
    
    render(<TestComponent>Mobile content</TestComponent>);
    
    // Should render without errors on mobile
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Mobile content')).toBeInTheDocument();
  });

  it('should handle tablet viewport', () => {
    mockMatchMedia(768);
    
    render(<TestComponent>Tablet content</TestComponent>);
    
    // Should render without errors on tablet
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Tablet content')).toBeInTheDocument();
  });

  it('should handle desktop viewport', () => {
    mockMatchMedia(1024);
    
    render(<TestComponent>Desktop content</TestComponent>);
    
    // Should render without errors on desktop
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Desktop content')).toBeInTheDocument();
  });

  it('should maintain accessibility across viewports', () => {
    const viewports = [320, 768, 1024, 1440];
    
    viewports.forEach(width => {
      mockMatchMedia(width);
      
      const { unmount } = render(<TestComponent>Test content</TestComponent>);
      
      // Button should maintain minimum touch target size
      const button = screen.getByRole('button');
      expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
      
      // Image should have alt text
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt');
      
      unmount();
    });
  });
});
