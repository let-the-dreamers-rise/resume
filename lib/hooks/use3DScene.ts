'use client';

import { useState, useEffect, useCallback } from 'react';

interface Mouse3DPosition {
  x: number;
  y: number;
}

interface Use3DSceneReturn {
  mousePosition: Mouse3DPosition;
  scrollProgress: number;
  performanceMode: 'high' | 'medium' | 'low';
}

export function use3DScene(): Use3DSceneReturn {
  const [mousePosition, setMousePosition] = useState<Mouse3DPosition>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');

  // Mouse tracking
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  }, []);

  // Scroll tracking
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
  }, []);

  // Performance detection
  useEffect(() => {
    // Detect device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setPerformanceMode('low');
      return;
    }

    // Check for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check memory (if available)
    const memory = (navigator as any).deviceMemory;
    
    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 1;
    
    // Determine performance mode based on device capabilities
    if (isMobile || (memory && memory < 4) || cores < 4) {
      setPerformanceMode('medium');
    } else if (memory && memory >= 8 && cores >= 8) {
      setPerformanceMode('high');
    } else {
      setPerformanceMode('medium');
    }
  }, []);

  // Event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  return {
    mousePosition,
    scrollProgress,
    performanceMode
  };
}