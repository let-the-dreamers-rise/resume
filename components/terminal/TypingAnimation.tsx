'use client';

import React, { useState, useEffect } from 'react';

export interface TypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  cursorChar?: string;
  cursorBlinkDuration?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypingAnimation({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  cursorChar = '|',
  cursorBlinkDuration = 2000,
  onComplete,
  className = '',
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showBlinkingCursor, setShowBlinkingCursor] = useState(false);

  // Reset state when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
    setShowBlinkingCursor(false);
  }, [text]);

  // Typing animation effect
  useEffect(() => {
    if (currentIndex >= text.length) {
      setIsComplete(true);
      if (showCursor && cursorBlinkDuration > 0) {
        setShowBlinkingCursor(true);
        const blinkTimer = setTimeout(() => {
          setShowBlinkingCursor(false);
        }, cursorBlinkDuration);
        return () => clearTimeout(blinkTimer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(prev => prev + 1);
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay, showCursor, cursorBlinkDuration]);

  // Call onComplete when animation finishes
  useEffect(() => {
    if (isComplete && onComplete) {
      const completeTimer = setTimeout(onComplete, showCursor ? cursorBlinkDuration : 0);
      return () => clearTimeout(completeTimer);
    }
    return undefined;
  }, [isComplete, onComplete, showCursor, cursorBlinkDuration]);

  const shouldShowCursor = showCursor && (currentIndex < text.length || showBlinkingCursor);

  return (
    <span className={`font-mono ${className}`} data-testid="typing-animation">
      {displayedText}
      {shouldShowCursor && (
        <span 
          className={`inline-block ${showBlinkingCursor ? 'animate-pulse' : ''}`}
          data-testid="typing-cursor"
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}