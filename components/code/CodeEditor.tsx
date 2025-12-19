'use client';

import React, { useState, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '../ui/Button';
import { PlayIcon, ArrowPathIcon, ClipboardIcon } from '@heroicons/react/24/outline';

export interface CodeEditorProps {
  initialCode: string;
  language: string;
  theme?: 'light' | 'dark';
  height?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
  showRunButton?: boolean;
  showResetButton?: boolean;
  showCopyButton?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  theme = 'light',
  height = '300px',
  onCodeChange,
  onRun,
  readOnly = false,
  showRunButton = true,
  showResetButton = true,
  showCopyButton = true,
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  }, [onCodeChange]);

  const handleRun = useCallback(() => {
    onRun?.(code);
  }, [code, onRun]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    onCodeChange?.(initialCode);
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
    }
  }, [initialCode, onCodeChange]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [code]);

  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Code Editor
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {language}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {showCopyButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ClipboardIcon className="w-4 h-4 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          )}
          
          {showResetButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
          
          {showRunButton && onRun && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleRun}
            >
              <PlayIcon className="w-4 h-4 mr-1" />
              Run
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div style={{ height }}>
        <Editor
          height={height}
          language={language}
          value={code}
          theme={monacoTheme}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;