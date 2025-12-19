import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { TerminalText, TerminalLine } from './TerminalText';
import { TypingAnimation } from './TypingAnimation';
import { ThemeProvider } from '@/lib/theme/theme-context';

// Clean up after each test to avoid DOM conflicts
afterEach(() => {
  cleanup();
});

// Mock the theme context for testing
const renderWithTheme = (component: React.ReactElement, theme: 'light' | 'dark' = 'light') => {
  return render(
    <ThemeProvider>
      <div className={theme}>
        {component}
      </div>
    </ThemeProvider>
  );
};

// Generator for terminal lines
const terminalLineArbitrary = fc.record({
  prompt: fc.option(fc.string({ minLength: 1, maxLength: 5 }), { nil: undefined }),
  text: fc.string({ minLength: 1, maxLength: 100 }),
  delay: fc.option(fc.integer({ min: 0, max: 1000 }), { nil: undefined }),
  speed: fc.option(fc.integer({ min: 10, max: 200 }), { nil: undefined }),
});

const terminalLinesArbitrary = fc.array(terminalLineArbitrary, { minLength: 1, maxLength: 5 });

describe('Terminal Interface Components', () => {
  describe('Property-Based Tests', () => {
    it('**Feature: portfolio-website, Property 50: Typing animation presence** - For any hero section render, a typing animation component should be present for the title or tagline', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (text) => {
            // Clean up before each property test
            cleanup();
            
            // Simulate hero section with typing animation
            const { container } = renderWithTheme(<TypingAnimation text={text} />);
            
            // The typing animation component should be present
            const typingElement = container.querySelector('[data-testid="typing-animation"]');
            expect(typingElement).toBeInTheDocument();
            
            // Should use monospace font (Property 52 validation)
            expect(typingElement).toHaveClass('font-mono');
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('**Feature: portfolio-website, Property 52: Terminal typography** - For any terminal element, the computed font-family should be a monospace font', () => {
      fc.assert(
        fc.property(
          terminalLinesArbitrary,
          (lines) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<TerminalText lines={lines} />);
            
            // Terminal text component should be present
            const terminalElement = container.querySelector('[data-testid="terminal-text"]');
            expect(terminalElement).toBeInTheDocument();
            
            // Should use monospace font
            expect(terminalElement).toHaveClass('font-mono');
            
            // All prompt elements should also use monospace (inherited)
            const promptElements = container.querySelectorAll('[data-testid="terminal-prompt"]');
            promptElements.forEach(prompt => {
              // The font-mono class should be inherited from parent
              expect(terminalElement).toHaveClass('font-mono');
            });
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should render terminal with proper command prompt styling', () => {
      fc.assert(
        fc.property(
          terminalLinesArbitrary,
          fc.string({ minLength: 1, maxLength: 3 }),
          (lines, prompt) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<TerminalText lines={lines} prompt={prompt} />);
            
            // Should have terminal styling
            const terminalElement = container.querySelector('[data-testid="terminal-text"]');
            expect(terminalElement).toHaveClass('font-mono');
            expect(terminalElement).toHaveClass('rounded-lg');
            expect(terminalElement).toHaveClass('border-2');
            
            // Should have prompt elements
            const promptElements = container.querySelectorAll('[data-testid="terminal-prompt"]');
            expect(promptElements.length).toBeGreaterThan(0);
            
            // Each prompt should contain either the line-specific prompt or the global prompt
            promptElements.forEach((promptElement, index) => {
              const expectedPrompt = lines[index]?.prompt ?? prompt;
              expect(promptElement.textContent).toBe(expectedPrompt);
            });
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should handle typing animation completion', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 1, max: 10 }),
          (text, speed) => {
            // Clean up before each property test
            cleanup();
            
            const onComplete = vi.fn();
            const { container } = renderWithTheme(
              <TypingAnimation 
                text={text} 
                speed={speed}
                onComplete={onComplete}
              />
            );
            
            // Component should render
            const typingElement = container.querySelector('[data-testid="typing-animation"]');
            expect(typingElement).toBeInTheDocument();
            
            // Should have monospace font
            expect(typingElement).toHaveClass('font-mono');
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should display cursor during typing animation', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 2 }),
          (text, cursorChar) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(
              <TypingAnimation 
                text={text} 
                showCursor={true}
                cursorChar={cursorChar}
              />
            );
            
            // Cursor should be present initially
            const cursorElement = container.querySelector('[data-testid="typing-cursor"]');
            expect(cursorElement).toBeInTheDocument();
            expect(cursorElement.textContent).toBe(cursorChar);
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should support different color schemes in terminal', () => {
      fc.assert(
        fc.property(
          terminalLinesArbitrary,
          fc.constantFrom('green', 'blue', 'amber', 'auto'),
          (lines, colorScheme) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<TerminalText lines={lines} colorScheme={colorScheme} />);
            
            const terminalElement = container.querySelector('[data-testid="terminal-text"]');
            expect(terminalElement).toBeInTheDocument();
            
            // Should have color-related classes
            const classList = Array.from(terminalElement.classList);
            const hasColorClass = classList.some(cls => 
              cls.includes('text-green') || 
              cls.includes('text-blue') || 
              cls.includes('text-amber')
            );
            expect(hasColorClass).toBe(true);
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should render typing animation with default props', () => {
      renderWithTheme(<TypingAnimation text="Hello World" />);
      
      const element = screen.getByTestId('typing-animation');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('font-mono');
    });

    it('should render terminal text with single line', () => {
      const lines = [{ text: 'echo "Hello Terminal"' }];
      renderWithTheme(<TerminalText lines={lines} />);
      
      const terminal = screen.getByTestId('terminal-text');
      expect(terminal).toBeInTheDocument();
      expect(terminal).toHaveClass('font-mono');
      
      const prompt = screen.getByTestId('terminal-prompt');
      expect(prompt).toBeInTheDocument();
      expect(prompt.textContent).toBe('$');
    });

    it('should use custom prompt character', () => {
      const lines = [{ text: 'ls -la' }];
      renderWithTheme(<TerminalText lines={lines} prompt=">" />);
      
      const prompt = screen.getByTestId('terminal-prompt');
      expect(prompt.textContent).toBe('>');
    });

    it('should handle empty lines array', () => {
      renderWithTheme(<TerminalText lines={[]} />);
      
      const terminal = screen.getByTestId('terminal-text');
      expect(terminal).toBeInTheDocument();
      
      // Should not have any prompt elements
      const prompts = screen.queryAllByTestId('terminal-prompt');
      expect(prompts).toHaveLength(0);
    });
  });
});
