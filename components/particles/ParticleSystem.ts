export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

export interface ParticleSystemConfig {
  particleCount: number;
  particleSize: number;
  particleColor: string;
  interactionRadius: number;
  animationSpeed: number;
  mouseInfluence: boolean;
  reducedMotion: boolean;
}

export interface MousePosition {
  x: number;
  y: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: ParticleSystemConfig;
  private animationId: number | null = null;
  private mousePosition: MousePosition = { x: 0, y: 0 };
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement, config: ParticleSystemConfig) {
    this.canvas = canvas;
    this.config = config;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
    
    this.initializeParticles();
    this.setupCanvas();
  }

  private initializeParticles(): void {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.animationSpeed,
        vy: (Math.random() - 0.5) * this.config.animationSpeed,
        size: Math.random() * this.config.particleSize + 1,
        color: this.config.particleColor,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  private setupCanvas(): void {
    const resizeCanvas = () => {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * window.devicePixelRatio;
      this.canvas.height = rect.height * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  public updateMousePosition(x: number, y: number): void {
    this.mousePosition = { x, y };
  }

  public updateConfig(newConfig: Partial<ParticleSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // If reduced motion is enabled, stop the animation
    if (this.config.reducedMotion && this.isRunning) {
      this.stop();
    } else if (!this.config.reducedMotion && !this.isRunning) {
      this.start();
    }
  }

  private updateParticles(): void {
    if (this.config.reducedMotion) return;

    for (const particle of this.particles) {
      // Apply mouse interaction if enabled
      if (this.config.mouseInfluence) {
        const dx = this.mousePosition.x - particle.x;
        const dy = this.mousePosition.y - particle.y;
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
      if (particle.x <= 0 || particle.x >= this.canvas.width / window.devicePixelRatio) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(particle.x, this.canvas.width / window.devicePixelRatio));
      }
      if (particle.y <= 0 || particle.y >= this.canvas.height / window.devicePixelRatio) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(particle.y, this.canvas.height / window.devicePixelRatio));
      }

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;
    }
  }

  private drawParticles(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const particle of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw connections between nearby particles
    this.drawConnections();
  }

  private drawConnections(): void {
    const connectionDistance = 100;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (connectionDistance - distance) / connectionDistance * 0.2;
          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = this.config.particleColor;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  private animate = (): void => {
    if (!this.isRunning) return;

    this.updateParticles();
    this.drawParticles();
    this.animationId = requestAnimationFrame(this.animate);
  };

  public start(): void {
    if (this.config.reducedMotion) return;
    
    this.isRunning = true;
    this.animate();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public destroy(): void {
    this.stop();
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}