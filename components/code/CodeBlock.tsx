'use client';

import React, { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';

export interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
  title?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = true,
  theme = 'light',
  title,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [code]);

  const syntaxTheme = theme === 'dark' ? oneDark : oneLight;

  return (
    <div className={`relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      {(title || true) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {title && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {language}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardIcon className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          lineNumberStyle={{
            minWidth: '2.5rem',
            paddingRight: '1rem',
            color: theme === 'dark' ? '#6b7280' : '#9ca3af',
            userSelect: 'none',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;