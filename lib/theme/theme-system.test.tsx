import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { ThemeProvider, useTheme } from './theme-context';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { themeArbitrary } from '../test/generators';

// Test component to access theme context
function TestThemeComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle
      </button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
    </div>
  );
}

describe('Theme System Property-Based Tests', () => {
  // Mock functions
  let mockLocalStorage: any;
  let mockMatchMedia: any;
  let mockClassList: any;
  let mockStyle: any;
  let originalLocalStorage: any;
  let originalMatchMedia: any;
  let originalDocumentElement: any;

  beforeEach(() => {
    // Clear all mocks first
    vi.clearAllMocks();
    
    // Store original values
    originalLocalStorage = global.localStorage;
    originalMatchMedia = global.matchMedia;
    originalDocumentElement = document.documentElement;

    // Create fresh mocks for each test
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    mockMatchMedia = vi.fn();
    mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
    };
    mockStyle = {
      setProperty: vi.fn(),
    };

    // Setup localStorage mock with proper descriptor
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
    
    // Setup window.localStorage as well
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
    
    // Setup matchMedia mock with proper descriptor
    Object.defineProperty(global, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
      configurable: true,
    });
    
    // Setup window.matchMedia as well for consistency
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
      configurable: true,
    });
    
    // Setup document.documentElement mock with proper descriptor
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: mockClassList,
        style: mockStyle,
      },
      writable: true,
      configurable: true,
    });

    // Default matchMedia return value - must be set before any component renders
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    // Set default localStorage behavior
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    
    // Restore original values if they exist
    try {
      if (originalLocalStorage !== undefined) {
        Object.defineProperty(global, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(window, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
          configurable: true,
        });
      }
      if (originalMatchMedia !== undefined) {
        Object.defineProperty(global, 'matchMedia', {
          value: originalMatchMedia,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(window, 'matchMedia', {
          value: originalMatchMedia,
          writable: true,
          configurable: true,
        });
      }
      if (originalDocumentElement !== undefined) {
        Object.defineProperty(document, 'documentElement', {
          value: originalDocumentElement,
          writable: true,
          configurable: true,
        });
      }
    } catch (error) {
      // Ignore cleanup errors in test environment
    }
  });

  /**
   * **Feature: portfolio-website, Property 21: System preference detection**
   * **Validates: Requirements 6.1**
   */
  it('Property 21: System preference detection - should detect and apply system preference when no saved theme exists', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (prefersDark) => {
        // Setup: No saved theme, system preference varies
        mockLocalStorage.getItem.mockReturnValue(null);
        mockMatchMedia.mockReturnValue({
          matches: prefersDark,
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        });

        const { unmount } = render(
          <ThemeProvider>
            <TestThemeComponent />
          </ThemeProvider>
        );

        // Wait for the theme to be applied after useEffect runs
        const expectedTheme = prefersDark ? 'dark' : 'light';
        await waitFor(() => {
          const themeDisplay = screen.getByTestId('current-theme');
          expect(themeDisplay.textContent).toBe(expectedTheme);
        }, { timeout: 3000 });
        
        // Clean up this specific render
        unmount();
        
        return true;
      }),
      { numRuns: 5 }
    );
  });

  /**
   * **Feature: portfolio-website, Property 22: Theme toggle functionality**
   * **Validates: Requirements 6.2**
   */
  it('Property 22: Theme toggle functionality - should switch to opposite theme when toggled', async () => {
    await fc.assert(
      fc.asyncProperty(themeArbitrary, async (initialTheme) => {
        // Setup: Start with a specific theme
        mockLocalStorage.getItem.mockReturnValue(initialTheme);
        // Ensure matchMedia returns consistent value
        mockMatchMedia.mockReturnValue({
          matches: initialTheme === 'dark',
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        });

        const { unmount } = render(
          <ThemeProvider>
            <TestThemeComponent />
          </ThemeProvider>
        );

        // Wait for initial theme to be applied
        await waitFor(() => {
          const themeDisplay = screen.getByTestId('current-theme');
          expect(themeDisplay.textContent).toBe(initialTheme);
        }, { timeout: 3000 });

        const toggleButton = screen.getByTestId('toggle-theme');

        // Toggle theme
        fireEvent.click(toggleButton);

        // Wait for theme to switch and verify it switched to opposite
        const expectedTheme = initialTheme === 'light' ? 'dark' : 'light';
        await waitFor(() => {
          const themeDisplay = screen.getByTestId('current-theme');
          expect(themeDisplay.textContent).toBe(expectedTheme);
        }, { timeout: 3000 });
        
        // Clean up this specific render
        unmount();
        
        return true;
      }),
      { numRuns: 5 }
    );
  });

  /**
   * **Feature: portfolio-website, Property 23: Theme persistence**
   * **Validates: Requirements 6.3**
   */
  it('Property 23: Theme persistence - should save theme changes to localStorage', async () => {
    await fc.assert(
      fc.asyncProperty(themeArbitrary, async (newTheme) => {
        // Setup: Start with opposite theme
        const initialTheme = newTheme === 'light' ? 'dark' : 'light';
        mockLocalStorage.getItem.mockReturnValue(initialTheme);
        // Ensure matchMedia returns consistent value
        mockMatchMedia.mockReturnValue({
          matches: initialTheme === 'dark',
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        });

        const { unmount } = render(
          <ThemeProvider>
            <TestThemeComponent />
          </ThemeProvider>
        );

        // Wait for component to mount and initial theme to be set
        await waitFor(() => {
          const themeDisplay = screen.getByTestId('current-theme');
          expect(themeDisplay.textContent).toBe(initialTheme);
        }, { timeout: 3000 });

        const setButton = screen.getByTestId(`set-${newTheme}`);

        // Change theme
        fireEvent.click(setButton);

        // Wait for theme change and verify localStorage was called
        await waitFor(() => {
          expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', newTheme);
        }, { timeout: 3000 });
        
        // Clean up this specific render
        unmount();
        
        return true;
      }),
      { numRuns: 5 }
    );
  });

  /**
   * Additional test: Theme toggle component rendering
   */
  it('should render ThemeToggle component with proper accessibility attributes', async () => {
    await fc.assert(
      fc.asyncProperty(themeArbitrary, async (theme) => {
        mockLocalStorage.getItem.mockReturnValue(theme);
        mockMatchMedia.mockReturnValue({
          matches: theme === 'dark',
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        });

        const { unmount } = render(
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        );

        // Wait for component to mount and theme to be applied
        await waitFor(() => {
          const toggleButton = screen.getByRole('button');
          const expectedLabel = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;
          expect(toggleButton.getAttribute('aria-label')).toBe(expectedLabel);
        }, { timeout: 3000 });
        
        // Clean up this specific render
        unmount();
        
        return true;
      }),
      { numRuns: 5 }
    );
  });

  /**
   * Additional test: CSS class application
   */
  it('should apply correct CSS classes to document element', async () => {
    await fc.assert(
      fc.asyncProperty(themeArbitrary, async (theme) => {
        mockLocalStorage.getItem.mockReturnValue(theme);
        mockMatchMedia.mockReturnValue({
          matches: theme === 'dark',
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        });

        const { unmount } = render(
          <ThemeProvider>
            <TestThemeComponent />
          </ThemeProvider>
        );

        // Wait for theme to be applied and verify classes are managed correctly
        await waitFor(() => {
          expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
          expect(mockClassList.add).toHaveBeenCalledWith(theme);
        }, { timeout: 3000 });
        
        // Clean up this specific render
        unmount();
        
        return true;
      }),
      { numRuns: 5 }
    );
  });

  /**
   * Additional test: CSS variables are set correctly
   */
  it('should set correct CSS variables for each theme', async () => {
    await fc.assert(
      fc.asyncProperty(themeArbitrary, async (theme) => {
        mockLocalStorage.getItem.mockReturnValue(theme);
        mockMatchMedia.mockReturnValue({
          matches: theme === 'dark',
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        });

        const { unmount } = render(
          <ThemeProvider>
            <TestThemeComponent />
          </ThemeProvider>
        );

        // Wait for theme to be applied and verify CSS variables are set correctly
        await waitFor(() => {
          if (theme === 'dark') {
            expect(mockStyle.setProperty).toHaveBeenCalledWith('--background', '#0a0a0a');
            expect(mockStyle.setProperty).toHaveBeenCalledWith('--foreground', '#ededed');
          } else {
            expect(mockStyle.setProperty).toHaveBeenCalledWith('--background', '#ffffff');
            expect(mockStyle.setProperty).toHaveBeenCalledWith('--foreground', '#171717');
          }
        }, { timeout: 3000 });
        
        // Clean up this specific render
        unmount();
        
        return true;
      }),
      { numRuns: 5 }
    );
  });
});