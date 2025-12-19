'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  performanceMode: 'high' | 'medium' | 'low';
}

interface AnimatedGeometryProps {
  position: [number, number, number];
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

// Animated rotating shapes component
function AnimatedGeometry({ position, mousePosition, scrollProgress }: AnimatedGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the geometry
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      
      // Mouse parallax effect
      const mouseInfluence = 0.1;
      meshRef.current.rotation.x += mousePosition.y * mouseInfluence;
      meshRef.current.rotation.y += mousePosition.x * mouseInfluence;
      
      // Scroll-based animation
      meshRef.current.position.y = position[1] + Math.sin(scrollProgress * Math.PI) * 0.5;
      
      // Hover effect
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={hovered ? '#60a5fa' : '#3b82f6'} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
}

// Floating spheres component
function FloatingSpheres({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }; scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      
      // Mouse influence on group rotation
      groupRef.current.rotation.x = mousePosition.y * 0.2;
      groupRef.current.rotation.z = mousePosition.x * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 5 }, (_, i) => (
        <Sphere
          key={i}
          args={[0.3, 16, 16]}
          position={[
            Math.cos(i * 1.26) * 3,
            Math.sin(i * 1.26) * 2,
            Math.sin(i * 0.8) * 2
          ]}
        >
          <meshStandardMaterial 
            color={`hsl(${200 + i * 30}, 70%, 60%)`} 
            transparent 
            opacity={0.7}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Torus ring component
function TorusRing({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.02;
      torusRef.current.rotation.y += 0.01;
      
      // Mouse parallax
      torusRef.current.rotation.z = mousePosition.x * 0.3;
    }
  });

  return (
    <Torus ref={torusRef} args={[2, 0.5, 16, 100]} position={[0, 0, -2]}>
      <meshStandardMaterial 
        color="#8b5cf6" 
        transparent 
        opacity={0.6}
        wireframe
      />
    </Torus>
  );
}

// Camera controller for mouse parallax
function CameraController({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { camera } = useThree();

  useFrame(() => {
    // Smooth camera movement based on mouse position
    const targetX = mousePosition.x * 2;
    const targetY = mousePosition.y * 2;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Performance monitor component
function PerformanceMonitor({ onPerformanceChange }: { onPerformanceChange: (mode: 'high' | 'medium' | 'low') => void }) {
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());

  useFrame(() => {
    setFrameCount(prev => prev + 1);
    
    const now = Date.now();
    if (now - lastTime > 1000) { // Check every second
      const fps = frameCount;
      setFrameCount(0);
      setLastTime(now);
      
      // Adjust performance mode based on FPS
      if (fps < 20) {
        onPerformanceChange('low');
      } else if (fps < 40) {
        onPerformanceChange('medium');
      } else {
        onPerformanceChange('high');
      }
    }
  });

  return null;
}

// Loading fallback component
function SceneLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading 3D Scene...</p>
      </div>
    </div>
  );
}

// Main Scene component
export default function Scene({ mousePosition, scrollProgress, performanceMode }: SceneProps) {
  const [currentPerformanceMode, setCurrentPerformanceMode] = useState(performanceMode);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglSupported(false);
    }
  }, []);

  // Fallback for unsupported devices
  if (!webglSupported) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-pink-400 rounded-full animate-pulse delay-2000"></div>
        </div>
      </div>
    );
  }

  // Adjust quality based on performance mode
  const getCanvasSettings = () => {
    switch (currentPerformanceMode) {
      case 'low':
        return {
          antialias: false,
          powerPreference: 'low-power' as const,
          pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1) : 1
        };
      case 'medium':
        return {
          antialias: true,
          powerPreference: 'default' as const,
          pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1
        };
      case 'high':
      default:
        return {
          antialias: true,
          powerPreference: 'high-performance' as const,
          pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
        };
    }
  };

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={getCanvasSettings()}
        dpr={getCanvasSettings().pixelRatio}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
          
          {/* Performance monitoring */}
          <PerformanceMonitor onPerformanceChange={setCurrentPerformanceMode} />
          
          {/* Camera controller for mouse parallax */}
          <CameraController mousePosition={mousePosition} />
          
          {/* 3D Objects - adjust complexity based on performance */}
          {currentPerformanceMode !== 'low' && (
            <>
              <AnimatedGeometry 
                position={[2, 1, 0]} 
                mousePosition={mousePosition} 
                scrollProgress={scrollProgress} 
              />
              <AnimatedGeometry 
                position={[-2, -1, 1]} 
                mousePosition={mousePosition} 
                scrollProgress={scrollProgress} 
              />
              <FloatingSpheres 
                mousePosition={mousePosition} 
                scrollProgress={scrollProgress} 
              />
            </>
          )}
          
          {currentPerformanceMode === 'high' && (
            <TorusRing mousePosition={mousePosition} />
          )}
          
          {/* Simple geometry for low performance mode */}
          {currentPerformanceMode === 'low' && (
            <Box position={[0, 0, 0]} args={[1, 1, 1]}>
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
            </Box>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}