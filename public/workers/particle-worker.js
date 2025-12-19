// Particle Worker for heavy calculations
class ParticleWorker {
  constructor() {
    this.particles = [];
    this.config = {};
    this.mousePosition = { x: 0, y: 0 };
  }

  initializeParticles(count, width, height, config) {
    this.particles = [];
    this.config = config;
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.animationSpeed,
        vy: (Math.random() - 0.5) * config.animationSpeed,
        size: Math.random() * config.particleSize + 1,
        color: config.particleColor,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  updateParticles(width, height, mousePosition) {
    if (this.config.reducedMotion) return this.particles;

    this.mousePosition = mousePosition;

    for (const particle of this.particles) {
      // Apply mouse interaction if enabled
      if (this.config.mouseInfluence && mousePosition) {
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.interactionRadius) {
          const force = (this.config.interactionRadius - distance) / this.config.interactionRadius;
          const angle = Math.atan2(dy, dx);
          
          // Repulsion effect
          particle.vx -= Math.cos(angle) * force * 0.5;
          particle.vy -= Math.sin(angle) * force * 0.5;
        }
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(particle.x, width));
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(particle.y, height));
      }

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;
    }

    return this.particles;
  }
}

const worker = new ParticleWorker();

self.onmessage = function(e) {
  const { type, data } = e.data;

  switch (type) {
    case 'init':
      worker.initializeParticles(data.count, data.width, data.height, data.config);
      self.postMessage({ type: 'initialized', particles: worker.particles });
      break;
      
    case 'update':
      const updatedParticles = worker.updateParticles(data.width, data.height, data.mousePosition);
      self.postMessage({ type: 'updated', particles: updatedParticles });
      break;
      
    case 'updateConfig':
      worker.config = { ...worker.config, ...data.config };
      break;
      
    default:
      console.warn('Unknown message type:', type);
  }
};