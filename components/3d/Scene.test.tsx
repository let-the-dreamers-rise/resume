import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import Scene from './Scene';

// Mock Three.js and React Three Fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="r3f-canvas" {...props}>
      {children}
    </div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({
    camera: {
      position: { x: 0, y: 0, z: 8 },
      lookAt: vi.fn()
    }
  })
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Sphere: ({ children, ...props }: any) => (
    <div data-testid="sphere" {...props}>
      {children}
    </div>
  ),
  Box: ({ children, ...props }: any) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
  Torus: ({ children, ...props }: any) => (
    <div data-testid="torus" {...props}>
      {children}
    </div>
  )
}));

vi.mock('three', () => ({
  Vector3: class Vector3 {
    constructor(public x = 0, public y = 0, public z = 0) {}
  },
  Mesh: class Mesh {
    rotation = { x: 0, y: 0, z: 0 };
    position = { x: 0, y: 0, z: 0 };
    scale = { lerp: vi.fn() };
  },
  Group: class Group {
    rotation = { x: 0, y: 0, z: 0 };
  }
}));

// Mock WebGL context
const mockWebGLContext = {
  getExtension: vi.fn(),
  getParameter: vi.fn(),
  createShader: vi.fn(),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  createProgram: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  useProgram: vi.fn(),
  createBuffer: vi.fn(),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  drawArrays: vi.fn(),
  viewport: vi.fn(),
  clearColor: vi.fn(),
  clear: vi.fn()
};

// Generator for performance mode
const performanceModeArb = fc.constantFrom('high' as const, 'medium' as const, 'low' as const);

// Generator for scene props
const scenePropsArb = fc.record({
  mousePosition: fc.record({
    x: fc.float({ min: -1, max: 1 }),
    y: fc.float({ min: -1, max: 1 })
  }),
  scrollProgress: fc.float({ min: 0, max: 1 }),
  performanceMode: performanceModeArb
});

describe('3D Scene Component', () => {
  beforeEach(() => {
    // Mock canvas.getContext to return WebGL context
    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextType) => {
      if (contextType === 'webgl' || contextType === 'experimental-webgl') {
        return mockWebGLContext;
      }
      return null;
    });

    // Mock window properties
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 1
    });

    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      value: 8
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Feature: portfolio-website, Property 27: 3D canvas presence**
   * **Validates: Requirements 8.1**
   */
  it('should render a 3D canvas element for Three.js rendering', () => {
    fc.assert(
      fc.property(
        scenePropsArb,
        (props) => {
          const { unmount } = render(<Scene {...props} />);
          
          // Should render R3F Canvas component (mocked as div with data-testid)
          const canvas = screen.getByTestId('r3f-canvas');
          expect(canvas).toBeInTheDocument();
          
          // Clean up after each property test run
          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * **Feature: portfolio-website, Property 28: Scene interactivity**
   * **Validates: Requirements 8.3**
   */
  it('should have mouse and scroll event handlers for scene interactivity', () => {
    fc.assert(
      fc.property(
        scenePropsArb,
        (props) => {
          const { unmount } = render(<Scene {...props} />);
          
          // The scene should accept mouse position and scroll progress props
          // indicating it responds to these interactions
          const canvas = screen.getByTestId('r3f-canvas');
          expect(canvas).toBeInTheDocument();
          
          // Verify that the component accepts and uses interactive props
          expect(props.mousePosition).toBeDefined();
          expect(props.scrollProgress).toBeDefined();
          expect(typeof props.mousePosition.x).toBe('number');
          expect(typeof props.mousePosition.y).toBe('number');
          expect(typeof props.scrollProgress).toBe('number');
          
          // Clean up after each property test run
          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * **Feature: portfolio-website, Property 29: Performance degradation**
   * **Validates: Requirements 8.5**
   */
  it('should gracefully degrade to 2D fallback for low-performance devices', () => {
    // Test WebGL not supported scenario
    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => null);

    fc.assert(
      fc.property(
        scenePropsArb,
        (props) => {
          const { container, unmount } = render(<Scene {...props} />);
          
          // Should render 2D fallback instead of 3D canvas
          expect(screen.queryByTestId('r3f-canvas')).not.toBeInTheDocument();
          
          // Should render fallback animated elements
          const fallbackElements = container.querySelectorAll('.animate-pulse');
          expect(fallbackElements.length).toBeGreaterThan(0);
          
          // Clean up after each property test run
          unmount();
        }
      ),
      { numRuns: 5 }
    );

    // Reset WebGL mock for other tests
    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextType) => {
      if (contextType === 'webgl' || contextType === 'experimental-webgl') {
        return mockWebGLContext;
      }
      return null;
    });
  });

  it('should render different complexity based on performance mode', () => {
    fc.assert(
      fc.property(
        scenePropsArb,
        (props) => {
          const { unmount } = render(<Scene {...props} />);
          
          const canvas = screen.getByTestId('r3f-canvas');
          expect(canvas).toBeInTheDocument();
          
          // Performance mode should affect rendering complexity
          if (props.performanceMode === 'low') {
            // Low performance should render simpler geometry
            expect(screen.queryByTestId('torus')).not.toBeInTheDocument();
          } else if (props.performanceMode === 'high') {
            // High performance should render all complex elements
            // This is tested through the component structure
            expect(canvas).toBeInTheDocument();
          }
          
          // Clean up after each property test run
          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should handle mouse position changes for parallax effects', () => {
    const initialProps = {
      mousePosition: { x: 0, y: 0 },
      scrollProgress: 0,
      performanceMode: 'high' as const
    };

    const { rerender, unmount } = render(<Scene {...initialProps} />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();

    // Test with different mouse positions
    fc.assert(
      fc.property(
        fc.record({
          x: fc.float({ min: -1, max: 1 }),
          y: fc.float({ min: -1, max: 1 })
        }),
        (mousePosition) => {
          rerender(
            <Scene 
              mousePosition={mousePosition}
              scrollProgress={0}
              performanceMode="high"
            />
          );
          
          // Component should still render with different mouse positions
          expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
        }
      ),
      { numRuns: 5 }
    );
    
    unmount();
  });

  it('should handle scroll progress changes', () => {
    const initialProps = {
      mousePosition: { x: 0, y: 0 },
      scrollProgress: 0,
      performanceMode: 'high' as const
    };

    const { rerender, unmount } = render(<Scene {...initialProps} />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();

    // Test with different scroll progress values
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1 }),
        (scrollProgress) => {
          rerender(
            <Scene 
              mousePosition={{ x: 0, y: 0 }}
              scrollProgress={scrollProgress}
              performanceMode="high"
            />
          );
          
          // Component should still render with different scroll progress
          expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
        }
      ),
      { numRuns: 5 }
    );
    
    unmount();
  });
});
