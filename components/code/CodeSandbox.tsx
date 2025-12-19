'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '../ui/Button';
import { ClipboardIcon } from '@heroicons/react/24/outline';

export interface CodeSandboxProps {
  files: Record<string, string>;
  entry: string;
  template: 'react' | 'vanilla' | 'vue' | 'node';
  height?: string;
  theme?: 'light' | 'dark';
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  files,
  entry,
  template,
  height = '400px',
  theme = 'light'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = useCallback(async () => {
    try {
      const entryContent = files[entry] || Object.values(files)[0];
      await navigator.clipboard.writeText(entryContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [files, entry]);

  const entryContent = files[entry] || Object.values(files)[0];

  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Code Preview
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {template}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ClipboardIcon className="w-4 h-4 mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Code Display */}
      <div style={{ height }} className="overflow-auto">
        <pre className="p-4 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
          <code>{entryContent}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeSandbox;