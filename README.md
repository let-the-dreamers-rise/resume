# Modern Portfolio Website

A cutting-edge, responsive portfolio website built with Next.js 14, featuring 3D animations, AI-powered chatbot, and comprehensive project showcase. This portfolio demonstrates advanced web development skills including performance optimization, accessibility compliance, and modern AI integration.

## 🚀 Features

### Core Functionality
- **Modern Design**: Clean, professional interface with seamless dark/light theme support
- **3D Animations**: Interactive Three.js scenes and particle systems with WebGL optimization
- **AI Chatbot**: Intelligent assistant powered by OpenAI with RAG (Retrieval Augmented Generation)
- **Blog System**: MDX-powered blog with syntax highlighting, reading progress, and table of contents
- **Project Showcase**: Detailed project pages with live demos, code sandboxes, and GitHub integration
- **Contact System**: Functional contact form with email integration and rate limiting

### Technical Excellence
- **Performance Optimized**: Lighthouse score 95+ with advanced optimization techniques
- **Fully Responsive**: Mobile-first design tested across all device breakpoints
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **SEO Optimized**: Structured data, meta tags, and sitemap generation
- **Error Handling**: Comprehensive error boundaries and offline detection
- **Security**: Rate limiting, input sanitization, and secure headers

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router and React Server Components
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom design system
- **3D Graphics**: Three.js with React Three Fiber and Drei
- **Animations**: Framer Motion with reduced motion support
- **State Management**: Zustand for client state

### Backend & AI
- **API Routes**: Next.js API routes with edge runtime
- **AI Integration**: OpenAI GPT-4 with vector embeddings
- **Vector Search**: Custom vector store with semantic search
- **Email Service**: Resend for contact form submissions
- **Content Management**: MDX with frontmatter parsing

### Development & Deployment
- **Testing**: Vitest with React Testing Library and property-based testing
- **Linting**: ESLint with TypeScript and accessibility rules
- **Deployment**: Vercel with edge functions and image optimization
- **Monitoring**: Performance monitoring with Core Web Vitals tracking

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- OpenAI API key (for chatbot functionality)
- Resend API key (for contact form)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env
# Required for AI chatbot
OPENAI_API_KEY=your_openai_api_key_here

# Required for contact form
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# Optional for GitHub integration
GITHUB_TOKEN=your_github_personal_access_token

# Site configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="Your Portfolio"
```

### 3. Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your portfolio.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
portfolio-website/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (contact, chatbot, blog)
│   ├── blog/              # Blog pages with dynamic routing
│   ├── projects/          # Project showcase pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage with hero section
│   └── globals.css        # Global styles and design tokens
├── components/            # Reusable React components
│   ├── 3d/               # Three.js 3D components
│   ├── chatbot/          # AI chatbot interface
│   ├── code/             # Code sandbox and editor
│   ├── layout/           # Layout components (header, footer)
│   ├── particles/        # Particle system background
│   ├── terminal/         # Terminal-style animations
│   └── ui/               # UI components and design system
├── content/              # MDX content files
│   ├── blog/            # Blog posts in MDX format
│   └── projects/        # Project descriptions
├── lib/                 # Utility libraries and business logic
│   ├── chatbot/        # AI chatbot implementation
│   ├── content/        # Content management system
│   ├── github/         # GitHub API integration
│   ├── hooks/          # Custom React hooks
│   ├── theme/          # Theme system and context
│   └── utils/          # Utility functions
├── public/             # Static assets
│   ├── images/         # Project and blog images
│   └── workers/        # Web Workers for performance
└── .kiro/              # Kiro IDE configuration
    └── specs/          # Project specifications
```

## 🎨 Customization Guide

### Personal Information

1. **Hero Section**: Update `app/page.tsx` with your name, title, and skills
2. **About Page**: Modify `app/about/page.tsx` with your bio and experience
3. **Projects**: Add your projects in `content/projects/` as MDX files
4. **Blog Posts**: Create blog posts in `content/blog/` directory
5. **Contact Info**: Update contact details in `app/contact/page.tsx`

### Styling and Branding

1. **Colors**: Modify color palette in `tailwind.config.ts`
2. **Typography**: Update font choices in `app/layout.tsx`
3. **Design Tokens**: Customize CSS variables in `app/globals.css`
4. **Components**: Modify component styles in respective files

### AI Chatbot Configuration

The chatbot system includes:
- **Content Ingestion**: Automatically processes your portfolio content
- **Vector Embeddings**: Generates semantic embeddings for search
- **Context Retrieval**: Finds relevant information for user queries
- **Response Generation**: Uses GPT-4 to generate contextual responses

To customize:
1. Update system prompts in `lib/chatbot/chatEngine.ts`
2. Modify content processing in `lib/chatbot/embeddings.ts`
3. Adjust search parameters in `lib/chatbot/vectorStore.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables
3. **Domain Configuration**: Set up custom domain if desired
4. **Deploy**: Automatic deployment on every push to main branch

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Alternative Platforms

The project supports deployment on:
- **Netlify**: With Next.js runtime
- **AWS Amplify**: With SSR support
- **Railway**: With automatic builds
- **DigitalOcean App Platform**: With Node.js runtime

## 📊 Performance Metrics

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Core Web Vitals
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Features
- Code splitting and lazy loading
- Image optimization with WebP/AVIF
- Font optimization with display: swap
- Aggressive caching strategies
- Bundle size optimization
- Tree shaking and dead code elimination

## ♿ Accessibility Features

- **WCAG AA Compliance**: Meets accessibility guidelines
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Supports system preferences
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Minimum 4.5:1 ratio for text

## 🧪 Testing

### Test Suite
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API route and feature testing
- **Property-Based Tests**: Automated test case generation
- **Accessibility Tests**: Automated a11y testing with axe-core
- **Performance Tests**: Core Web Vitals monitoring

## 🔧 Development Tools

### Code Quality
- **ESLint**: Linting with TypeScript and accessibility rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Strict type checking

### Development Experience
- **Hot Reload**: Instant updates during development
- **Error Overlay**: Detailed error information
- **TypeScript IntelliSense**: Full IDE support
- **Component Storybook**: Component development environment

## 📈 Analytics and Monitoring

### Built-in Monitoring
- Performance metrics collection
- Error boundary reporting
- User interaction tracking
- Core Web Vitals monitoring

### Integration Options
- Google Analytics 4
- Plausible Analytics
- Vercel Analytics
- Custom analytics implementation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure accessibility compliance
- Maintain performance standards
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Three.js](https://threejs.org/)** - JavaScript 3D library
- **[OpenAI](https://openai.com/)** - AI and machine learning platform
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vercel](https://vercel.com/)** - Platform for frontend frameworks
- **[MDX](https://mdxjs.com/)** - Markdown for the component era


---

**Built with ❤️ using modern web technologies**
