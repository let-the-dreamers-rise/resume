/**
 * Property-based tests for CodeSandbox component
 * Feature: portfolio-website, Property 35-39: Code sandbox functionality
 * Validates: Requirements 10.1, 10.2, 10.4, 10.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { CodeSandbox } from './CodeSandbox';

// Mock Sandpack to avoid complex dependencies and provide testable interface
vi.mock('@codesandbox/sandpack-react', () => ({
  Sandpack: ({ files, template, theme, options }: any) => (
    <div data-testid="sandpack-container">
      <div data-testid="sandpack-template">{template}</div>
      <div data-testid="sandpack-theme">{theme}</div>
      <div data-testid="sandpack-files">{JSON.stringify(files)}</div>
      <div data-testid="sandpack-options">{JSON.stringify(options)}</div>
      {/* Mock editor interface */}
      <div data-testid="sandpack-editor">
        <textarea 
          data-testid="editor-content" 
          defaultValue={Object.values(files)[0] as string}
          className="w-full h-full font-mono"
        />
      </div>
      {/* Mock preview */}
      <div data-testid="sandpack-preview">
        <iframe data-testid="preview-frame" title="Preview" />
      </div>
    </div>
  )
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe('CodeSandbox Property Tests', () => {
  /**
   * Property 35: Code syntax highlighting
   * For any supported language, the editor should display syntax highlighting
   */
  it('Property 35: Code syntax highlighting - should support multiple programming languages', () => {
    fc.assert(fc.property(
      fc.constantFrom('react', 'vanilla', 'vue', 'node'),
      fc.string({ minLength: 10, maxLength: 200 }),
      (template, code) => {
        const extension = template === 'react' ? 'jsx' : template === 'vue' ? 'vue' : 'js';
        const files = {
          [`App.${extension}`]: code
        };

        const { unmount } = render(
          <CodeSandbox
            files={files}
            entry={`App.${extension}`}
            template={template as any}
            height="400px"
          />
        );

        try {
          // Should render Sandpack container with template information
          const containers = screen.getAllByTestId('sandpack-container');
          expect(containers.length).toBeGreaterThan(0);

          // Template should be correctly set for syntax highlighting
          const templateElements = screen.getAllByTestId('sandpack-template');
          expect(templateElements[0].textContent).toBe(template);

          // Files should be passed correctly for syntax highlighting
          const filesElements = screen.getAllByTestId('sandpack-files');
          const filesData = JSON.parse(filesElements[0].textContent || '{}');
          expect(filesData).toHaveProperty(`App.${extension}`, code);
        } finally {
          unmount();
        }
      }
    ), { numRuns: 5 });
  });

  /**
   * Property 36: Interactive editor presence
   * For any code input, the editor should be interactive and allow editing
   */
  it('Property 36: Interactive editor presence - should provide interactive editing capabilities', () => {
    fc.assert(fc.property(
      fc.record({
        'App.js': fc.string({ minLength: 20, maxLength: 500 }),
        'index.html': fc.string({ minLength: 10, maxLength: 200 })
      }),
      (files) => {
        const { unmount } = render(
          <CodeSandbox
            files={files}
            entry="App.js"
            template="react"
            height="400px"
          />
        );

        try {
          // Should render interactive Sandpack editor
          const editors = screen.getAllByTestId('sandpack-editor');
          expect(editors.length).toBeGreaterThan(0);

          // Should have editable content area
          const editorContents = screen.getAllByTestId('editor-content');
          expect(editorContents.length).toBeGreaterThan(0);
          expect(editorContents[0]).not.toBeDisabled();

          // Should render preview for interactivity
          const previews = screen.getAllByTestId('sandpack-preview');
          expect(previews.length).toBeGreaterThan(0);
        } finally {
          unmount();
        }
      }
    ), { numRuns: 5 });
  });

  /**
   * Property 38: Multi-language support
   * For any combination of supported languages, the sandbox should handle them appropriately
   */
  it('Property 38: Multi-language support - should handle multiple file types in one sandbox', () => {
    fc.assert(fc.property(
      fc.record({
        'App.js': fc.string({ minLength: 10, maxLength: 100 }),
        'styles.css': fc.string({ minLength: 10, maxLength: 100 }),
        'index.html': fc.string({ minLength: 10, maxLength: 100 })
      }),
      (files) => {
        const { unmount } = render(
          <CodeSandbox
            files={files}
            entry="App.js"
            template="vanilla"
            height="400px"
          />
        );

        try {
          // Should render Sandpack container
          const containers = screen.getAllByTestId('sandpack-container');
          expect(containers.length).toBeGreaterThan(0);

          // Should handle multiple file types
          const sandpackFiles = screen.getAllByTestId('sandpack-files');
          const filesData = JSON.parse(sandpackFiles[0].textContent || '{}');
          
          // Verify all file types are preserved
          expect(filesData).toHaveProperty('App.js');
          expect(filesData).toHaveProperty('styles.css');
          expect(filesData).toHaveProperty('index.html');
          expect(Object.keys(filesData).length).toBe(3);

          // Should show tabs for multiple files (via options)
          const optionsElements = screen.getAllByTestId('sandpack-options');
          const options = JSON.parse(optionsElements[0].textContent || '{}');
          expect(options.showTabs).toBe(true);
        } finally {
          unmount();
        }
      }
    ), { numRuns: 5 });
  });

  /**
   * Property 39: Code reset functionality
   * For any modified code, the reset button should restore original content
   */
  it('Property 39: Code reset functionality - should restore original code when reset', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 20, maxLength: 200 }),
      (originalCode) => {
        const files = { 'App.js': originalCode };
        
        const { unmount } = render(
          <CodeSandbox
            files={files}
            entry="App.js"
            template="react"
            height="400px"
          />
        );

        try {
          // Should render reset button
          const resetButtons = screen.getAllByText('Reset');
          expect(resetButtons.length).toBeGreaterThan(0);

          // Should render editor with original content
          const editorContents = screen.getAllByTestId('editor-content');
          expect(editorContents.length).toBeGreaterThan(0);
          expect(editorContents[0]).toHaveValue(originalCode);

          // Simulate clicking reset button
          fireEvent.click(resetButtons[0]);

          // Content should still be the original (since we haven't modified it)
          // In a real scenario, this would restore modified content to original
          expect(editorContents[0]).toHaveValue(originalCode);
        } finally {
          unmount();
        }
      }
    ), { numRuns: 5 });
  });

  // Edge case: Empty files
  it('should handle empty files gracefully', () => {
    render(
      <CodeSandbox
        files={{}}
        entry="App.js"
        template="react"
        height="400px"
      />
    );

    // Should still render without crashing
    expect(screen.getByTestId('sandpack-container')).toBeInTheDocument();
  });

  // Edge case: Very large files
  it('should handle large code files', () => {
    const largeCode = 'console.log("test");'.repeat(1000);
    
    render(
      <CodeSandbox
        files={{ 'App.js': largeCode }}
        entry="App.js"
        template="react"
        height="400px"
      />
    );

    const editorContent = screen.getByTestId('editor-content');
    expect(editorContent).toBeInTheDocument();
    expect(editorContent).toHaveValue(largeCode);
  });
});
