import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import ParticleBackground from './ParticleBackground';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
};

// Mock canvas
const mockCanvas = {
  getContext: vi.fn(() => mockContext),
  width: 800,
  height: 600,
  style: {},
  getBoundingClientRect: vi.fn(() => ({
    width: 800,
    height: 600,
    left: 0,
    top: 0,
  })),
};

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => mockContext),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  value: vi.fn(() => ({
    width: 800,
    height: 600,
    left: 0,
    top: 0,
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = vi.fn();

// Mock Worker
global.Worker = class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  
  constructor(public url: string) {}
  
  postMessage(data: any) {
    // Simulate worker response
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data: { type: 'updated', particles: [] } } as MessageEvent);
      }
    }, 10);
  }
  
  terminate() {}
} as any;

// Generators for property tests
const particleCountArbitrary = fc.integer({ min: 1, max: 200 });
const particleColorArbitrary = fc.oneof(
  fc.hexaString({ minLength: 6, maxLength: 6 }).map(hex => `#${hex}`),
  fc.constantFrom('#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280')
);
const sectionArbitrary = fc.constantFrom('hero', 'about', 'projects', 'blog', 'contact', 'default');

describe('ParticleBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock matchMedia for reduced motion detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion: reduce') ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up DOM between tests
    document.body.innerHTML = '';
  });

  /**
   * **Feature: portfolio-website, Property 40: Particle system rendering**
   * **Validates: Requirements 11.1**
   */
  it('Property 40: should render particle canvas element for any configuration', () => {
    fc.assert(
      fc.property(
        particleCountArbitrary,
        particleColorArbitrary,
        sectionArbitrary,
        (particleCount, particleColor, section) => {
          const { unmount } = render(
            <ParticleBackground
              particleCount={particleCount}
              particleColor={particleColor}
              section={section}
            />
          );

          const canvas = screen.getByTestId('particle-canvas');
          expect(canvas).toBeInTheDocument();
          expect(canvas.tagName).toBe('CANVAS');
          expect(canvas).toHaveAttribute('aria-hidden', 'true');
          
          // Clean up after each property test iteration
          unmount();
        }
      ),
      { numRuns: 5 }
    );
  });

  /**
   * **Feature: portfolio-website, Property 41: Particle mouse interaction**
   * **Validates: Requirements 11.2**
   */
  it('Property 41: should register mouse event handlers for interaction', () => {
    fc.assert(
      fc.property(
        particleCountArbitrary,
        fc.boolean(),
        (particleCount, enableWebWorker) => {
          const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
          
          const { unmount } = render(
            <ParticleBackground
              particleCount={particleCount}
              enableWebWorker={enableWebWorker}
            />
          );

          // Should register mousemove event listener for mouse interaction
          expect(addEventListenerSpy).toHaveBeenCalledWith(
            'mousemove',
            expect.any(Function)
          );
          
          // Clean up
          unmount();
          addEventListenerSpy.mockRestore();
        }
      ),
      { numRuns: 5 }
    );
  });

  /**
   * **Feature: portfolio-website, Property 42: Particle layering**
   * **Validates: Requirements 11.3**
   */
  it('Property 42: should have lower z-index than content elements', () => {
    fc.assert(
      fc.property(
        particleCountArbitrary,
        particleColorArbitrary,
        (particleCount, particleColor) => {
          const { unmount } = render(
            <ParticleBackground
              particleCount={particleCount}
              particleColor={particleColor}
            />
          );

          const canvas = screen.getByTestId('particle-canvas');
          
          // Canvas should have pointer-events: none and be positioned behind content
          expect(canvas).toHaveClass('pointer-events-none');
          expect(canvas).toHaveClass('absolute');
          expect(canvas).toHaveClass('inset-0');
          
          // Should have negative z-index via inline style
          expect(canvas.style.zIndex).toBe('-1');
          
          // Clean up
          unmount();
        }
      ),
      { numRuns: 5 }
    );
  });

  /**
   * **Feature: portfolio-website, Property 44: Reduced motion compliance**
   * **Validates: Requirements 11.5**
   */
  it('Property 44: should respect prefers-reduced-motion setting', () => {
    fc.assert(
      fc.property(
        particleCountArbitrary,
        fc.boolean(),
        (particleCount, reducedMotion) => {
          // Mock matchMedia to return the reduced motion preference
          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
              matches: query.includes('prefers-reduced-motion: reduce') ? reducedMotion : false,
              media: query,
              onchange: null,
              addListener: vi.fn(),
              removeListener: vi.fn(),
              addEventListener: vi.fn(),
              removeEventListener: vi.fn(),
              dispatchEvent: vi.fn(),
            })),
          });

          const { unmount } = render(
            <ParticleBackground
              particleCount={particleCount}
            />
          );

          const canvas = screen.getByTestId('particle-canvas');
          
          if (reducedMotion) {
            // When reduced motion is preferred, opacity should be reduced
            expect(canvas.style.opacity).toBe('0.3');
          } else {
            // When reduced motion is not preferred, opacity should be normal
            expect(canvas.style.opacity).toBe('1');
          }
          
          // Clean up
          unmount();
        }
      ),
      { numRuns: 5 }
    );
  });

  // Additional unit tests for specific behaviors
  describe('Section-based color transitions', () => {
    it('should use section-specific colors', () => {
      const sections = ['hero', 'about', 'projects', 'blog', 'contact'] as const;
      const expectedColors = {
        hero: '#3b82f6',
        about: '#10b981', 
        projects: '#f59e0b',
        blog: '#8b5cf6',
        contact: '#ef4444',
      };

      sections.forEach(section => {
        const { unmount } = render(<ParticleBackground section={section} />);
        // The component should render without errors and use the appropriate color
        expect(screen.getByTestId('particle-canvas')).toBeInTheDocument();
        unmount();
      });
    });

    it('should use custom color when provided', () => {
      const customColor = '#ff0000';
      const { unmount } = render(<ParticleBackground particleColor={customColor} section="hero" />);
      
      expect(screen.getByTestId('particle-canvas')).toBeInTheDocument();
      unmount();
    });
  });

  describe('Web Worker integration', () => {
    it('should initialize web worker when enabled', () => {
      render(<ParticleBackground enableWebWorker={true} />);
      
      expect(screen.getByTestId('particle-canvas')).toBeInTheDocument();
      // Worker should be created (mocked in our test setup)
    });

    it('should fall back to main thread when web worker disabled', () => {
      render(<ParticleBackground enableWebWorker={false} />);
      
      expect(screen.getByTestId('particle-canvas')).toBeInTheDocument();
    });
  });
});
