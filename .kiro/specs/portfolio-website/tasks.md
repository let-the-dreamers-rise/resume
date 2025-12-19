# Implementation Plan

- [x] 1. Initialize Next.js project with TypeScript and core dependencies
  - Create Next.js 14+ project with App Router
  - Install TypeScript, Tailwind CSS, and ESLint
  - Configure tsconfig.json for strict type checking
  - Set up Tailwind CSS with custom theme configuration
  - Install core dependencies: framer-motion, zustand, react-query
  - Create basic folder structure (app/, components/, lib/, content/, public/)
  - _Requirements: All_

- [x] 1.1 Set up testing infrastructure
  - Install Vitest, React Testing Library, and fast-check
  - Configure Vitest for component and property-based testing
  - Install axe-core for accessibility testing
  - Create test utilities and custom render functions
  - Set up test generators for Project, BlogPost, ContactFormData models
  - _Requirements: All_

- [x] 2. Implement theme system and global providers
  - Create ThemeProvider with Context API for light/dark mode
  - Implement system preference detection (prefers-color-scheme)
  - Add localStorage persistence for theme preference
  - Define CSS variables for colors in both themes
  - Create ThemeToggle component with smooth transitions
  - Set up root layout with theme provider
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2.1 Write property test for theme system
  - **Property 21: System preference detection**
  - **Property 22: Theme toggle functionality**
  - **Property 23: Theme persistence**
  - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 3. Create navigation and layout components
  - Build Header component with sticky navigation
  - Implement Navigation with Next.js Link components
  - Create mobile hamburger menu with animations
  - Add active page highlighting based on current route
  - Build Footer component with social links
  - Implement responsive layout wrapper
  - _Requirements: 3.1, 3.2, 5.4, 5.5_

- [x] 3.1 Write property tests for navigation
  - **Property 8: Mobile navigation**
  - **Property 20: External link behavior**
  - **Validates: Requirements 3.2, 5.5**

- [x] 4. Build particle system background
  - Create ParticleBackground component with canvas rendering
  - Implement particle physics (position, velocity, interactions)
  - Add mouse interaction (attraction/repulsion effects)
  - Implement Web Worker for particle calculations
  - Add section-based color transitions on scroll
  - Implement prefers-reduced-motion detection and disable animations
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 4.1 Write property tests for particle system
  - **Property 40: Particle system rendering**
  - **Property 41: Particle mouse interaction**
  - **Property 42: Particle layering**
  - **Property 44: Reduced motion compliance**
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.5**

- [x] 5. Implement 3D scene with Three.js
  - Install three, @react-three/fiber, @react-three/drei
  - Create Scene component with R3F Canvas
  - Build animated 3D geometry (rotating shapes, abstract forms)
  - Implement mouse parallax and camera movement
  - Add performance monitoring and adaptive quality settings
  - Implement WebGL detection and 2D fallback for unsupported devices
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 5.1 Write property tests for 3D scene
  - **Property 27: 3D canvas presence**
  - **Property 28: Scene interactivity**
  - **Property 29: Performance degradation**
  - **Validates: Requirements 8.1, 8.3, 8.5**

- [x] 6. Create terminal and typing animation components
  - Build TypingAnimation component with character-by-character reveal
  - Add blinking cursor effect
  - Create TerminalText component with command prompt styling
  - Implement configurable typing speed
  - Use monospace fonts and terminal color schemes
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 6.1 Write property tests for terminal interface
  - **Property 50: Typing animation presence**
  - **Property 52: Terminal typography**
  - **Validates: Requirements 13.1, 13.4**

- [x] 7. Build homepage with hero section
  - Create app/page.tsx for homepage
  - Build Hero component with name, title, tagline
  - Integrate TypingAnimation for tagline
  - Add 3D Scene as background
  - Integrate ParticleBackground
  - Add CTA buttons linking to projects and contact
  - Display skill highlights with animations
  - Implement responsive layout for mobile
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 7.1 Write property tests for hero section
  - **Property 1: Hero section completeness**
  - **Property 2: Hero navigation links**
  - **Property 3: Hero skill display**
  - **Validates: Requirements 1.1, 1.3, 1.4, 1.5**

- [x] 8. Set up content management for projects
  - Create content/projects/ directory for MDX files
  - Define Project TypeScript interface and validation schema
  - Create lib/content/projects.ts for loading project data
  - Implement getProjects() and getProjectBySlug() functions
  - Add sample project MDX files with frontmatter
  - Parse and validate project metadata
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 9. Build projects listing page
  - Create app/projects/page.tsx
  - Build ProjectCard component with image, title, description, tech tags
  - Implement hover animations with Framer Motion
  - Add grid layout with responsive columns
  - Display 3-6 featured projects
  - Integrate ParticleBackground
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 9.1 Write property tests for project cards
  - **Property 4: Project card required fields**
  - **Validates: Requirements 2.1, 2.2, 2.6, 2.7**

- [x] 10. Build project detail page
  - Create app/projects/[slug]/page.tsx with dynamic routing
  - Build ProjectDetail component
  - Display full project description, highlights, challenges, outcomes
  - Add image gallery or video demo section
  - Include live demo and GitHub links
  - Integrate ParticleBackground
  - _Requirements: 2.4, 2.5_

- [x] 10.1 Write property tests for project details
  - **Property 5: Project detail completeness**
  - **Property 6: Project links presence**
  - **Validates: Requirements 2.4, 2.5**

- [x] 11. Implement code sandbox for project demos
  - Install @monaco-editor/react and @codesandbox/sandpack-react
  - Create CodeSandbox component with Monaco Editor
  - Implement live preview pane with iframe
  - Add file tabs for multi-file demos
  - Implement reset button to restore original code
  - Add copy-to-clipboard functionality
  - Support JavaScript, TypeScript, and Python syntax
  - Integrate into project detail pages
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 11.1 Write property tests for code sandbox
  - **Property 35: Code syntax highlighting**
  - **Property 36: Interactive editor presence**
  - **Property 38: Multi-language support**
  - **Property 39: Code reset functionality**
  - **Validates: Requirements 10.1, 10.2, 10.4, 10.5**
  - **Status: COMPLETED** - All property tests pass for CodeSandbox, CodeEditor, and CodeBlock components

- [x] 12. Create about page
  - Create app/about/page.tsx
  - Build bio section with 150-300 word professional bio
  - Create skills section with categorized skills (Frontend, ML/AI, Tools)
  - Add visual proficiency indicators (progress bars or icons)
  - Display education and certifications
  - Add career goals and current focus areas
  - Integrate ParticleBackground
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 12.1 Write property tests for about page
  - **Property 12: Bio length validation**
  - **Property 13: Skills categorization**
  - **Property 14: Skill proficiency indicators**
  - **Property 15: About section completeness**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**
  - **Status: COMPLETED** - All property tests pass for About page components and bio length meets requirements

- [x] 13. Implement GitHub integration
  - Create lib/github/api.ts for GitHub API calls
  - Implement getFeaturedRepos() function
  - Add GitHub profile link to about and projects pages
  - Display repository cards with name, stars, description, language
  - Implement error handling with fallback content
  - Add target="_blank" to repository links
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 13.1 Write property tests for GitHub integration
  - **Property 53: GitHub profile link**
  - **Property 54: Repository data display**
  - **Property 55: Repository link behavior**
  - **Property 56: GitHub API error handling**
  - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**
  - **Status: COMPLETED** - All 10 property tests pass for GitHubRepos component including error handling, repository display, and external links

- [x] 14. Set up blog content management
  - Create content/blog/ directory for MDX files
  - Define BlogPost TypeScript interface
  - Install and configure next-mdx-remote or contentlayer
  - Create lib/content/blog.ts for loading blog data
  - Implement getBlogPosts() and getBlogPostBySlug() functions
  - Add reading time calculation
  - Parse frontmatter (title, date, tags, excerpt)
  - Add sample blog post MDX files
  - _Requirements: 12.1, 12.2_

- [x] 15. Build blog listing page
  - Create app/blog/page.tsx
  - Build BlogCard component with title, date, excerpt, reading time
  - Implement tag filtering functionality
  - Add search functionality for articles
  - Display articles in grid layout
  - Add pagination or infinite scroll
  - Integrate ParticleBackground
  - _Requirements: 12.1, 12.5_

- [x] 15.1 Write property tests for blog listing
  - **Property 45: Article metadata completeness**
  - **Property 49: Article tagging**
  - **Validates: Requirements 12.1, 12.5**

- [x] 16. Build blog post page
  - Create app/blog/[slug]/page.tsx
  - Implement MDX rendering with proper typography
  - Install and configure Prism.js or Shiki for syntax highlighting
  - Create CodeBlock component with line numbers and copy button
  - Generate table of contents from headings
  - Add reading progress indicator
  - Include share buttons
  - Integrate ParticleBackground
  - _Requirements: 12.2, 12.3, 12.4_

- [ ] 16.1 Write property tests for blog posts
  - **Property 46: Markdown rendering**
  - **Property 47: Code block features**
  - **Property 48: Table of contents generation**
  - **Validates: Requirements 12.2, 12.3, 12.4**

- [x] 17. Create contact page with form
  - Create app/contact/page.tsx
  - Build ContactForm component with name, email, message fields
  - Implement client-side validation (required fields, email format)
  - Add loading states during submission
  - Display success/error messages
  - Show alternative contact methods (email, LinkedIn, GitHub)
  - Integrate ParticleBackground
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 17.1 Write property tests for contact form
  - **Property 16: Form field presence**
  - **Property 17: Valid submission success**
  - **Property 18: Invalid submission errors**
  - **Property 19: Alternative contact methods**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [x] 18. Implement contact form API endpoint
  - Create app/api/contact/route.ts
  - Install email service SDK (SendGrid, Resend, or Nodemailer)
  - Implement server-side validation
  - Send email with form data
  - Return success/error responses
  - Add rate limiting to prevent spam
  - _Requirements: 5.2_

- [x] 19. Build AI chatbot system
  - Install @ai-sdk/openai and ai package from Vercel
  - Create lib/chatbot/embeddings.ts for generating embeddings
  - Implement lib/chatbot/vectorStore.ts for semantic search
  - Generate embeddings for all portfolio content (projects, skills, experience)
  - Create lib/chatbot/chatEngine.ts for LLM integration
  - Build system prompt with portfolio context
  - _Requirements: 9.2, 9.3, 9.4_

- [x] 20. Create chatbot UI components
  - Build ChatInterface component with floating button
  - Create expandable chat window
  - Build ChatMessage component for user/assistant messages
  - Add ChatInput with text area
  - Implement typing indicators
  - Display suggested questions on open
  - Add conversation history management
  - _Requirements: 9.1, 9.5_

- [x] 21. Implement chatbot API endpoint
  - Create app/api/chatbot/route.ts
  - Integrate with OpenAI API or similar LLM service
  - Implement streaming responses
  - Perform vector search for relevant context
  - Construct prompts with retrieved context
  - Handle conversation history
  - Return responses with project navigation suggestions
  - _Requirements: 9.2, 9.3, 9.4_

- [x] 21.1 Write property tests for chatbot
  - **Property 30: Chat interface initialization**
  - **Property 31: Chatbot response relevance**
  - **Property 34: Suggested questions**
  - **Validates: Requirements 9.1, 9.2, 9.5**

- [x] 22. Implement responsive design and accessibility
  - Test all pages at breakpoints (320px, 768px, 1024px, 1440px, 2560px)
  - Ensure minimum 16px font size on mobile
  - Verify 44x44px touch targets on mobile
  - Add responsive images with srcset and sizes
  - Implement lazy loading for below-fold images
  - Add alt text to all images
  - Ensure proper heading hierarchy (h1 → h2 → h3)
  - Add ARIA labels to form inputs
  - Implement visible focus indicators
  - Test keyboard navigation (Tab, Enter, Space)
  - Verify WCAG AA color contrast ratios
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.3, 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 22.1 Write property tests for responsive design
  - **Property 7: Viewport adaptability**
  - **Property 9: Minimum text size**
  - **Property 10: Touch target size**
  - **Property 11: Responsive images**
  - **Property 25: Image lazy loading**
  - **Validates: Requirements 3.1, 3.3, 3.4, 3.5, 7.3**

- [x] 22.2 Write property tests for accessibility
  - **Property 57: Image alt text**
  - **Property 58: Focus indicators**
  - **Property 59: Keyboard accessibility**
  - **Property 60: Heading hierarchy**
  - **Property 61: Form label association**
  - **Property 62: Animation safety**
  - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5, 15.6**

- [x] 23. Optimize performance
  - Configure Next.js Image component for all images
  - Implement dynamic imports for heavy components (3D, chatbot, code sandbox)
  - Add font-display: swap to font declarations
  - Minimize and compress CSS/JS bundles
  - Set up code splitting by route
  - Implement Web Workers for particle system
  - Add error boundaries for 3D, chatbot, and code sandbox
  - Test and optimize Core Web Vitals (FCP, LCP, CLS, FID)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 23.1 Write property test for font loading
  - **Property 26: Font display strategy**
  - **Validates: Requirements 7.5**

- [x] 24. Add error handling and validation
  - Implement form validation for contact form
  - Add error boundaries for all major components
  - Create fallback UI for 3D scene failures
  - Handle API errors with retry logic
  - Display user-friendly error messages
  - Implement offline detection
  - Add skeleton loaders for content loading
  - _Requirements: 5.3, 8.5, 14.5_

- [x] 25. Set up deployment configuration
  - Create next.config.js with optimization settings
  - Set up environment variables (.env.local, .env.production)
  - Configure Vercel deployment settings
  - Set up custom domain
  - Enable compression and caching
  - Configure image optimization domains
  - Set up analytics (Vercel Analytics or Plausible)
  - _Requirements: All_

- [x] 26. Create sample content
  - Write 3-6 project MDX files with complete metadata
  - Add project images and screenshots
  - Write 3-5 blog post MDX files
  - Add code examples to blog posts
  - Create personal bio content
  - List skills with categories and proficiency levels
  - Add education and experience data
  - Prepare 3D models or use procedural geometry
  - _Requirements: 2.1, 4.1, 4.2, 12.1_

- [ ] 27. Final testing and polish
  - Run all property-based tests
  - Perform manual testing on all pages
  - Test on multiple browsers (Chrome, Firefox, Safari)
  - Test on mobile devices
  - Verify all links work correctly
  - Check theme switching across all pages
  - Test chatbot with various questions
  - Verify code sandbox functionality
  - Run Lighthouse audit
  - Fix any accessibility issues
  - _Requirements: All_

- [x] 28. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
