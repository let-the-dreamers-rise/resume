import React from 'react';
import { ContactForm } from '@/components/ui/ContactForm';
import ParticleBackground from '@/components/particles/ParticleBackground';

// Simple SVG icons
const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

export default function Contact() {
  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hello? 
            I'd love to hear from you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-black dark:text-foreground mb-6">
                Send me a message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Direct Contact */}
              <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Let's connect
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MailIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <p className="text-foreground/70 mb-2">
                        Prefer email? Drop me a line directly
                      </p>
                      <a
                        href="mailto:ashwingoyal2006@gmail.com"
                        className="text-primary hover:underline"
                      >
                        ashwingoyal2006@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <LinkedInIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">LinkedIn</h3>
                      <p className="text-foreground/70 mb-2">
                        Let's connect professionally
                      </p>
                      <a
                        href="https://www.linkedin.com/in/ashwin-goyal-b5b8b8259/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        linkedin.com/in/ashwin-goyal
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Follow me
                </h2>
                
                <div className="flex gap-4">
                  <a
                    href="https://github.com/let-the-dreamers-rise"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-foreground/10 hover:bg-foreground/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="w-6 h-6 text-foreground" />
                  </a>
                  
                  <a
                    href="https://www.linkedin.com/in/ashwin-goyal-b5b8b8259/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-foreground/10 hover:bg-foreground/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="w-6 h-6 text-foreground" />
                  </a>
                  
                  <a
                    href="https://x.com/ashgoyal1990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-foreground/10 hover:bg-foreground/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label="X (Twitter)"
                  >
                    <TwitterIcon className="w-6 h-6 text-foreground" />
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Response Time
                </h2>
                <p className="text-foreground/70">
                  I typically respond to messages within 24-48 hours. For urgent matters, 
                  feel free to reach out on LinkedIn for a faster response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}