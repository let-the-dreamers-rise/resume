import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// 3D Scene - Heavy component, load only when needed
export const DynamicScene = dynamic(
  () => import('../../components/3d/Scene').then(mod => ({ default: mod.Scene })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for WebGL components
  }
);

// Particle Background - Heavy component with Web Worker
export const DynamicParticleBackground = dynamic(
  () => import('../../components/particles/ParticleBackground'),
  {
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10" />
    ),
    ssr: false, // Disable SSR for canvas components
  }
);

// Code Sandbox - Heavy component with Monaco Editor
export const DynamicCodeSandbox = dynamic(
  () => import('../../components/code/CodeSandbox').then(mod => ({ default: mod.CodeSandbox })),
  {
    loading: () => (
      <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading code editor...</p>
        </div>
      </div>
    ),
    ssr: false, // Monaco Editor doesn't work with SSR
  }
);

// Chatbot Interface - Heavy component with AI integration
export const DynamicChatInterface = dynamic(
  () => import('../../components/chatbot/ChatInterface').then(mod => ({ default: mod.ChatInterface })),
  {
    loading: () => null, // No loading state for floating chat button
    ssr: false, // Disable SSR for interactive components
  }
);

// Blog Post Layout with MDX - Heavy component
export const DynamicBlogPostLayout = dynamic(
  () => import('../../components/ui/BlogPostLayout').then(mod => ({ default: mod.BlogPostLayout })),
  {
    loading: () => <LoadingSpinner />,
  }
);

// GitHub Repos - API-dependent component
export const DynamicGitHubRepos = dynamic(
  () => import('../../components/ui/GitHubRepos').then(mod => ({ default: mod.GitHubRepos })),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    ),
  }
);

// Utility function for lazy loading components based on intersection
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) {
  return dynamic(importFn, {
    loading: fallback ? () => <fallback /> : LoadingSpinner,
    ssr: false,
  });
}

// Utility function for preloading components
export function preloadComponent(importFn: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Preload on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFn();
      });
    } else {
      setTimeout(() => {
        importFn();
      }, 2000);
    }
  }
}

// Preload heavy components on page load
export function preloadHeavyComponents() {
  if (typeof window !== 'undefined') {
    // Preload components that are likely to be used
    preloadComponent(() => import('../../components/chatbot/ChatInterface'));
    preloadComponent(() => import('../../components/code/CodeSandbox'));
    
    // Preload 3D scene only on high-performance devices
    const connection = (navigator as any).connection;
    const isHighPerformance = navigator.hardwareConcurrency >= 4 && 
                             (!connection || connection.effectiveType === '4g');
    
    if (isHighPerformance) {
      preloadComponent(() => import('../../components/3d/Scene'));
    }
  }
}

// Export all dynamic components
export {
  LoadingSpinner,
};