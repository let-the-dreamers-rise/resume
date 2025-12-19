'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParticleSystem, ParticleSystemConfig, Particle } from './ParticleSystem';

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  section?: string;
  enableWebWorker?: boolean;
}

const defaultConfig: ParticleSystemConfig = {
  particleCount: 50,
  particleSize: 3,
  particleColor: '#3b82f6',
  interactionRadius: 150,
  animationSpeed: 1,
  mouseInfluence: true,
  reducedMotion: false,
};

const sectionColors: Record<string, string> = {
  hero: '#3b82f6',
  about: '#10b981',
  projects: '#f59e0b',
  blog: '#8b5cf6',
  contact: '#ef4444',
  default: '#6b7280',
};

function ParticleBackground({
  className = '',
  particleCount = 50,
  particleColor,
  section = 'default',
  enableWebWorker = false,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get section-based color
  const getSectionColor = useCallback(() => {
    return particleColor || sectionColors[section] || sectionColors.default;
  }, [particleColor, section]);

  // Initialize Web Worker
  useEffect(() => {
    if (!enableWebWorker || isReducedMotion) return;

    try {
      workerRef.current = new Worker('/workers/particle-worker.js');
      
      workerRef.current.onmessage = (e) => {
        const { type, particles: workerParticles } = e.data;
        if (type === 'updated' && workerParticles) {
          setParticles(workerParticles);
        }
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
      };
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread');
    }
  }, [enableWebWorker, isReducedMotion]);

  // Initialize particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config: ParticleSystemConfig = {
      ...defaultConfig,
      particleCount,
      particleColor: getSectionColor(),
      reducedMotion: isReducedMotion,
    };

    if (enableWebWorker && workerRef.current && !isReducedMotion) {
      // Use Web Worker
      const rect = canvas.getBoundingClientRect();
      workerRef.current.postMessage({
        type: 'init',
        data: {
          count: particleCount,
          width: rect.width,
          height: rect.height,
          config,
        },
      });
    } else {
      // Use main thread
      try {
        particleSystemRef.current = new ParticleSystem(canvas, config);
        if (!isReducedMotion) {
          particleSystemRef.current.start();
        }
      } catch (error) {
        console.error('Failed to initialize particle system:', error);
      }
    }

    return () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.destroy();
        particleSystemRef.current = null;
      }
    };
  }, [particleCount, getSectionColor, isReducedMotion, enableWebWorker]);

  // Handle mouse movement
  useEffect(() => {
    if (isReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (particleSystemRef.current) {
        particleSystemRef.current.updateMousePosition(x, y);
      }

      if (enableWebWorker && workerRef.current) {
        workerRef.current.postMessage({
          type: 'update',
          data: {
            width: rect.width,
            height: rect.height,
            mousePosition: { x, y },
          },
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isReducedMotion, enableWebWorker]);

  // Handle section color changes
  useEffect(() => {
    const newColor = getSectionColor();
    
    if (particleSystemRef.current) {
      particleSystemRef.current.updateConfig({ particleColor: newColor });
    }

    if (enableWebWorker && workerRef.current) {
      workerRef.current.postMessage({
        type: 'updateConfig',
        data: { config: { particleColor: newColor } },
      });
    }
  }, [getSectionColor, enableWebWorker]);

  // Web Worker animation loop
  useEffect(() => {
    if (!enableWebWorker || !workerRef.current || isReducedMotion) return;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      workerRef.current?.postMessage({
        type: 'update',
        data: {
          width: rect.width,
          height: rect.height,
          mousePosition: null,
        },
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [enableWebWorker, isReducedMotion]);

  // Render Web Worker particles
  useEffect(() => {
    if (!enableWebWorker || !particles.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, [particles, enableWebWorker]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: -1,
        opacity: isReducedMotion ? 0.3 : 1,
      }}
      aria-hidden="true"
      data-testid="particle-canvas"
    />
  );
}

export default ParticleBackground;
export { ParticleBackground };