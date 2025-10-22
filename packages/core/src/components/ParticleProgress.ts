import { ParticleProgressOptions, Particle } from '../types';
import { ProgressBase } from '../base';
import { createElement, canvasContextCache } from '../utils';

/**
 * ParticleProgress - 粒子流动进度条
 */
export class ParticleProgress extends ProgressBase<ParticleProgressOptions> {
  private wrapper!: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId?: string;
  private textElement?: HTMLElement;

  protected getDefaultOptions(): Partial<ParticleProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 20,
      particleCount: 50,
      particleSize: 3,
      particleSpeed: 2,
      particleColor: '#409eff',
      trailLength: 5,
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 300;
    const height = this.config.get('height') ?? 20;

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-particle', this.container);
    this.wrapper.style.position = 'relative';
    this.wrapper.style.width = `${width}px`;
    this.wrapper.style.height = `${height}px`;
    this.wrapper.style.backgroundColor = '#f5f5f5';
    this.wrapper.style.borderRadius = '10px';
    this.wrapper.style.overflow = 'hidden';

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建 Canvas
    this.canvas = createElement('canvas', 'ld-progress-particle__canvas', this.wrapper) as HTMLCanvasElement;
    this.canvas.width = typeof width === 'number' ? width : parseInt(String(width));
    this.canvas.height = typeof height === 'number' ? height : parseInt(String(height));
    this.canvas.style.position = 'absolute';

    this.ctx = canvasContextCache.get(this.canvas);

    // 初始化粒子
    this.initParticles();

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = createElement('div', 'ld-progress-particle__text', this.wrapper);
      this.textElement.style.position = 'absolute';
      this.textElement.style.right = '10px';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translateY(-50%)';
      this.textElement.style.fontSize = '12px';
      this.textElement.style.zIndex = '10';
    }

    this.startAnimation();
    this.updateProgress(this.currentValue);
  }

  /**
   * 初始化粒子
   */
  private initParticles(): void {
    const particleCount = this.config.get('particleCount') ?? 50;
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: height / 2 + (Math.random() - 0.5) * height * 0.5,
        vx: (Math.random() * 0.5 + 0.5) * (this.config.get('particleSpeed') ?? 2),
        vy: (Math.random() - 0.5) * 0.5,
        size: (Math.random() * 0.5 + 0.5) * (this.config.get('particleSize') ?? 3),
        alpha: Math.random() * 0.5 + 0.5,
        trail: [],
      });
    }
  }

  /**
   * 开始动画
   */
  private startAnimation(): void {
    if (this.animationId) return;

    const { rafController } = require('../utils/RAFController');
    this.animationId = `particle-${this.id}`;

    rafController.register(this.animationId, () => {
      this.updateParticles();
      this.drawParticles();
    }, 0);
  }

  /**
   * 停止动画
   */
  private stopAnimation(): void {
    if (this.animationId) {
      const { rafController } = require('../utils/RAFController');
      rafController.unregister(this.animationId);
      this.animationId = undefined;
    }
  }

  /**
   * 更新粒子位置
   */
  private updateParticles(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const percentage = this.config.getPercentage(this.currentValue);
    const maxX = (width * percentage) / 100;
    const trailLength = this.config.get('trailLength') ?? 5;

    this.particles.forEach(particle => {
      // 保存轨迹
      if (particle.trail) {
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > trailLength) {
          particle.trail.shift();
        }
      }

      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 边界检查
      if (particle.x > maxX || particle.x > width) {
        particle.x = 0;
        particle.y = height / 2 + (Math.random() - 0.5) * height * 0.5;
      }

      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
      }
    });
  }

  /**
   * 绘制粒子
   */
  private drawParticles(): void {
    if (!this.ctx) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const particleColor = this.config.get('particleColor') || '#409eff';

    // 清除画布（带淡出效果）
    this.ctx.fillStyle = 'rgba(245, 245, 245, 0.3)';
    this.ctx.fillRect(0, 0, width, height);

    // 绘制粒子
    this.particles.forEach(particle => {
      // 绘制轨迹
      if (particle.trail && particle.trail.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        particle.trail.forEach(point => {
          this.ctx.lineTo(point.x, point.y);
        });
        this.ctx.strokeStyle = particleColor;
        this.ctx.globalAlpha = particle.alpha * 0.3;
        this.ctx.lineWidth = particle.size * 0.5;
        this.ctx.stroke();
      }

      // 绘制粒子
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particleColor;
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
  }

  protected updateProgress(value: number): void {
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.stopAnimation();
    super.destroy();
  }
}



