'use client';

import React, { useState, useCallback } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { Button } from '../ui/Button';
import { ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export interface CodeSandboxProps {
  files: Record<string, string>;
  entry: string;
  template: 'react' | 'vanilla' | 'vue' | 'node';
  height?: string;
  theme?: 'light' | 'dark';
}

interface EditorFile {
  name: string;
  content: string;
  language: string;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  files,
  entry,
  template,
  height = '400px',
  theme = 'light'
}) => {
  const [originalFiles] = useState(files);
  const [currentFiles, setCurrentFiles] = useState(files);
  const [copied, setCopied] = useState(false);

  const handleReset = useCallback(() => {
    setCurrentFiles(originalFiles);
  }, [originalFiles]);

  const handleCopyCode = useCallback(async () => {
    try {
      const entryContent = currentFiles[entry] || Object.values(currentFiles)[0];
      await navigator.clipboard.writeText(entryContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [currentFiles, entry]);

  const sandpackTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Code Sandbox
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Sandpack Editor */}
      <div style={{ height }}>
        <Sandpack
          template={template}
          files={currentFiles}
          theme={sandpackTheme}
          options={{
            showNavigator: false,
            showTabs: Object.keys(files).length > 1,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: height,
            layout: 'preview',
            autorun: true,
          }}
          customSetup={{
            entry: entry,
          }}
        />
      </div>
    </div>
  );
};

export default CodeSandbox;