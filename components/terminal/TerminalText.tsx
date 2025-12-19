'use client';

import React from 'react';
import { TypingAnimation } from './TypingAnimation';
import { useTheme } from '@/lib/theme/theme-context';

export interface TerminalLine {
  prompt?: string;
  text: string;
  delay?: number;
  speed?: number;
}

export interface TerminalTextProps {
  lines: TerminalLine[];
  prompt?: string;
  className?: string;
  colorScheme?: 'green' | 'blue' | 'amber' | 'auto';
  onComplete?: () => void;
}

export function TerminalText({
  lines,
  prompt = '$',
  className = '',
  colorScheme = 'auto',
  onComplete,
}: TerminalTextProps) {
  const { theme } = useTheme();
  const [completedLines, setCompletedLines] = React.useState(0);

  const handleLineComplete = React.useCallback(() => {
    setCompletedLines(prev => {
      const newCount = prev + 1;
      if (newCount === lines.length && onComplete) {
        onComplete();
      }
      return newCount;
    });
  }, [lines.length, onComplete]);

  // Reset completed lines when lines change
  React.useEffect(() => {
    setCompletedLines(0);
  }, [lines]);

  // Determine color scheme based on theme and prop
  const getColorClasses = () => {
    if (colorScheme === 'auto') {
      return theme === 'dark' 
        ? 'text-green-400 bg-gray-900 border-green-500/30' 
        : 'text-green-700 bg-gray-100 border-green-300';
    }
    
    const colorMap = {
      green: theme === 'dark' 
        ? 'text-green-400 bg-gray-900 border-green-500/30' 
        : 'text-green-700 bg-gray-100 border-green-300',
      blue: theme === 'dark' 
        ? 'text-blue-400 bg-gray-900 border-blue-500/30' 
        : 'text-blue-700 bg-gray-100 border-blue-300',
      amber: theme === 'dark' 
        ? 'text-amber-400 bg-gray-900 border-amber-500/30' 
        : 'text-amber-700 bg-gray-100 border-amber-300',
    };
    
    return colorMap[colorScheme];
  };

  return (
    <div 
      className={`font-mono text-sm p-4 rounded-lg border-2 ${getColorClasses()} ${className}`}
      data-testid="terminal-text"
    >
      {lines.map((line, index) => {
        const linePrompt = line.prompt ?? prompt;
        const shouldAnimate = index <= completedLines;
        const isCurrentLine = index === completedLines;
        
        return (
          <div key={index} className="flex items-start gap-2 min-h-[1.5rem]">
            <span 
              className="text-opacity-70 select-none shrink-0"
              data-testid="terminal-prompt"
            >
              {linePrompt}
            </span>
            <div className="flex-1">
              {shouldAnimate ? (
                <TypingAnimation
                  text={line.text}
                  speed={line.speed ?? 30}
                  delay={line.delay ?? (index === 0 ? 0 : 100)}
                  showCursor={isCurrentLine}
                  onComplete={isCurrentLine ? handleLineComplete : undefined}
                  className="break-words"
                />
              ) : (
                <span className="opacity-0">
                  {line.text}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}