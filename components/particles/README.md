# Particle System

A high-performance particle system for creating dynamic background effects with mouse interaction and section-based color transitions.

## Features

- Canvas-based particle rendering with physics simulation
- Mouse interaction (attraction/repulsion effects)
- Section-based color transitions on scroll
- Web Worker support for heavy calculations
- Prefers-reduced-motion compliance
- Responsive design with device pixel ratio support

## Usage

### Basic Usage

```tsx
import { ParticleBackground } from '@/components/particles';

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground 
        section="hero"
        particleCount={50}
      />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### Advanced Usage with Web Worker

```tsx
import { ParticleBackground } from '@/components/particles';

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground 
        section="projects"
        particleCount={100}
        enableWebWorker={true}
        className="opacity-80"
      />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `particleCount` | `number` | `50` | Number of particles to render |
| `particleColor` | `string` | Section-based | Custom particle color (hex) |
| `section` | `string` | `'default'` | Section name for color theming |
| `enableWebWorker` | `boolean` | `false` | Use Web Worker for calculations |

## Section Colors

- `hero`: Blue (`#3b82f6`)
- `about`: Green (`#10b981`)
- `projects`: Amber (`#f59e0b`)
- `blog`: Purple (`#8b5cf6`)
- `contact`: Red (`#ef4444`)
- `default`: Gray (`#6b7280`)

## Performance

- Automatically detects `prefers-reduced-motion` and disables animations
- Uses `requestAnimationFrame` for smooth 60fps performance
- Web Worker support for heavy particle calculations
- Responsive canvas with device pixel ratio support
- Efficient collision detection and physics simulation

## Accessibility

- Respects `prefers-reduced-motion: reduce`
- Canvas has `aria-hidden="true"` and `pointer-events: none`
- Positioned behind content with negative z-index
- Reduced opacity when motion is disabled