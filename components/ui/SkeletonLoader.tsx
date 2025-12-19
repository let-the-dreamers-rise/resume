'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={style}
    />
  );
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-lg p-6 space-y-4">
      <Skeleton height={200} className="rounded-lg" />
      <div className="space-y-2">
        <Skeleton height={24} width="80%" />
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="90%" />
      </div>
      <div className="flex gap-2">
        <Skeleton height={20} width={60} className="rounded-full" />
        <Skeleton height={20} width={80} className="rounded-full" />
        <Skeleton height={20} width={70} className="rounded-full" />
      </div>
    </div>
  );
}

// Blog Card Skeleton
export function BlogCardSkeleton() {
  return (
    <div className="bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton height={24} width="90%" />
        <Skeleton height={16} width="60%" />
      </div>
      <div className="space-y-2">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="80%" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Skeleton height={20} width={50} className="rounded-full" />
          <Skeleton height={20} width={60} className="rounded-full" />
        </div>
        <Skeleton height={16} width={80} />
      </div>
    </div>
  );
}

// GitHub Repo Skeleton
export function GitHubRepoSkeleton() {
  return (
    <div className="bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton height={20} width="70%" />
        <Skeleton height={16} width={40} />
      </div>
      <Skeleton height={16} width="100%" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Skeleton height={12} width={12} className="rounded-full" />
          <Skeleton height={14} width={60} />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton height={12} width={12} />
          <Skeleton height={14} width={20} />
        </div>
      </div>
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <Skeleton height={60} width="80%" className="mx-auto" />
        <Skeleton height={32} width="60%" className="mx-auto" />
        <div className="space-y-2">
          <Skeleton height={20} width="90%" className="mx-auto" />
          <Skeleton height={20} width="70%" className="mx-auto" />
        </div>
        <div className="flex gap-4 justify-center">
          <Skeleton height={48} width={140} className="rounded-lg" />
          <Skeleton height={48} width={120} className="rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={24} width={80} className="rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Page Loading Skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <Skeleton height={48} width="60%" className="mx-auto" />
          <Skeleton height={20} width="80%" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Chat Message Skeleton
export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton height={32} width={32} className="rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} width="30%" />
        <div className="space-y-1">
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="80%" />
          <Skeleton height={16} width="60%" />
        </div>
      </div>
    </div>
  );
}

// Code Editor Skeleton
export function CodeEditorSkeleton() {
  return (
    <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
        <Skeleton height={12} width={12} className="rounded-full" />
        <Skeleton height={12} width={12} className="rounded-full" />
        <Skeleton height={12} width={12} className="rounded-full" />
        <Skeleton height={16} width={100} className="ml-4" />
      </div>
      <div className="p-4 space-y-2">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton height={16} width={20} />
            <Skeleton height={16} width={`${Math.random() * 60 + 40}%`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;