'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TypingAnimation } from '../terminal/TypingAnimation';

import ParticleBackground from '../particles/ParticleBackground';

interface HeroProps {
  name: string;
  title: string;
  tagline: string;
  skills: string[];
  ctaButtons: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}

export function Hero({ name, title, tagline, skills, ctaButtons }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');

  // Track mouse position for 3D scene interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect performance capabilities
  useEffect(() => {
    const checkPerformance = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      
      if (!gl) {
        setPerformanceMode('low');
        return;
      }

      const renderer = gl.getParameter(gl.RENDERER);
      
      // Simple heuristic for performance detection
      if (renderer && (renderer.includes('Intel') || renderer.includes('Software'))) {
        setPerformanceMode('medium');
      } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        setPerformanceMode('medium');
      } else {
        setPerformanceMode('high');
      }
    };

    checkPerformance();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background Scene - Temporarily disabled for deployment */}
      
      
      {/* Particle Background */}
      <ParticleBackground 
        section="hero"
        particleCount={performanceMode === 'low' ? 20 : performanceMode === 'medium' ? 35 : 50}
        enableWebWorker={performanceMode === 'high'}
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Name and Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
            {name}
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground/80 mb-6">
            {title}
          </h2>
        </div>

        {/* Animated Tagline */}
        <div className="mb-12">
          <div className="text-lg sm:text-xl md:text-2xl text-foreground/70 min-h-[2em] flex items-center justify-center">
            <TypingAnimation
              text={tagline}
              speed={50}
              delay={1000}
              showCursor={true}
              cursorChar="|"
              cursorBlinkDuration={2000}
              className="text-primary font-mono"
            />
          </div>
        </div>

        {/* Skills Highlights */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill}
                className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm sm:text-base backdrop-blur-sm animate-fade-in-up"
                style={{
                  animationDelay: `${2000 + index * 200}ms`,
                  animationFillMode: 'both'
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {ctaButtons.map((button, index) => (
            <Link
              key={button.href}
              href={button.href}
              className={`
                px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[200px] text-center
                ${button.variant === 'primary' 
                  ? 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-lg hover:shadow-xl' 
                  : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary backdrop-blur-sm'
                }
                animate-fade-in-up
              `}
              style={{
                animationDelay: `${3000 + index * 200}ms`,
                animationFillMode: 'both'
              }}
            >
              {button.label}
            </Link>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground/30 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}