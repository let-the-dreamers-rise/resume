'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/content/types';
import { CodeSandbox } from '../code/CodeSandbox';
// Simple SVG icons to avoid dependency issues
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CodeBracketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

interface ProjectDetailProps {
  project: Project;
  children?: React.ReactNode;
}

export function ProjectDetail({ project, children }: ProjectDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const displayImages = project.images.length > 0 ? project.images : [project.image];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-foreground/70 hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Title and Description */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              {project.longDescription}
            </p>
            
            {/* Technologies */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <ExternalLinkIcon className="w-5 h-5 mr-2" />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-foreground/10 text-foreground font-semibold rounded-lg hover:bg-foreground/20 transition-colors duration-200"
                >
                  <CodeBracketIcon className="w-5 h-5 mr-2" />
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* Project Metadata */}
          <div className="lg:w-80">
            <div className="bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Project Details</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-foreground/60">Category</span>
                  <p className="text-foreground capitalize">{project.category}</p>
                </div>
                
                <div>
                  <span className="text-sm text-foreground/60">Timeline</span>
                  <p className="text-foreground">
                    {project.startDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                    {project.endDate && (
                      <> - {project.endDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}</>
                    )}
                  </p>
                </div>

                {project.featured && (
                  <div>
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Featured Project
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {displayImages.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Project Gallery</h2>
          
          {/* Main Image */}
          <div className="mb-6">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-foreground/5">
              <Image
                src={displayImages[selectedImageIndex]}
                alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={selectedImageIndex === 0}
              />
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {displayImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? 'border-primary shadow-lg'
                      : 'border-foreground/20 hover:border-foreground/40'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Project Highlights */}
      {project.highlights.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <p className="text-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {project.challenges.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Challenges & Solutions</h2>
          <div className="space-y-4">
            {project.challenges.map((challenge, index) => (
              <div
                key={index}
                className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-foreground">{challenge}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outcomes */}
      {project.outcomes.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Results & Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.outcomes.map((outcome, index) => (
              <div
                key={index}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-foreground">{outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Demo */}
      {project.codeDemo && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Code Demo</h2>
          <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-6">
            <p className="text-foreground/70 mb-4">
              Try out the code below! You can modify it and see the results in real-time.
            </p>
            <CodeSandbox
              files={project.codeDemo.files}
              entry={project.codeDemo.entry}
              template={project.codeDemo.template}
              height="500px"
            />
          </div>
        </div>
      )}

      {/* MDX Content */}
      {children && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technical Details</h2>
          <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-8">
            {children}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center pt-8 border-t border-foreground/10">
        <Link
          href="/projects"
          className="inline-flex items-center px-6 py-3 bg-foreground/10 text-foreground font-semibold rounded-lg hover:bg-foreground/20 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to All Projects
        </Link>
      </div>
    </div>
  );
}