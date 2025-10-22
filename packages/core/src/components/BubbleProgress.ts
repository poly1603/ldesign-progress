import { BubbleProgressOptions, Bubble } from '../types';
import { ProgressBase } from '../base';
import { createElement, canvasContextCache } from '../utils';

/**
 * BubbleProgress - 气泡上升进度条
 */
export class BubbleProgress extends ProgressBase<BubbleProgressOptions> {
  private wrapper!: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private bubbles: Bubble[] = [];
  private animationId?: string;
  private textElement?: HTMLElement;

  protected getDefaultOptions(): Partial<BubbleProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 150,
      height: 300,
      bubbleColor: 'rgba(64, 158, 255, 0.6)',
      bubbleCount: 20,
      bubbleSpeed: 2,
      backgroundColor: '#e4e7ed',
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 150;
    const height = this.config.get('height') ?? 300;

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-bubble', this.container);
    this.wrapper.style.width = `${width}px`;
    this.wrapper.style.height = `${height}px`;
    this.wrapper.style.position = 'relative';
    this.wrapper.style.backgroundColor = this.config.get('backgroundColor') || '#e4e7ed';
    this.wrapper.style.borderRadius = '10px';
    this.wrapper.style.overflow = 'hidden';

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建 Canvas
    this.canvas = createElement('canvas', 'ld-progress-bubble__canvas', this.wrapper) as HTMLCanvasElement;
    this.canvas.width = typeof width === 'number' ? width : parseInt(String(width));
    this.canvas.height = typeof height === 'number' ? height : parseInt(String(height));

    this.ctx = canvasContextCache.get(this.canvas);

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = createElement('div', 'ld-progress-bubble__text', this.wrapper);
      this.textElement.style.position = 'absolute';
      this.textElement.style.top = '20px';
      this.textElement.style.left = '50%';
      this.textElement.style.transform = 'translateX(-50%)';
      this.textElement.style.fontSize = '24px';
      this.textElement.style.fontWeight = 'bold';
      this.textElement.style.zIndex = '10';
    }

    this.initBubbles();
    this.startAnimation();
    this.updateProgress(this.currentValue);
  }

  /**
   * 初始化气泡
   */
  private initBubbles(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const bubbleCount = this.config.get('bubbleCount') ?? 20;

    this.bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      this.createBubble();
    }
  }

  /**
   * 创建单个气泡
   */
  private createBubble(): Bubble {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const bubbleSpeed = this.config.get('bubbleSpeed') ?? 2;

    const bubble: Bubble = {
      x: Math.random() * width,
      y: height + Math.random() * 50,
      radius: Math.random() * 10 + 5,
      speed: Math.random() * bubbleSpeed + 0.5,
      wobble: Math.random() * 2,
      wobbleSpeed: Math.random() * 0.05,
      alpha: Math.random() * 0.4 + 0.4,
    };

    this.bubbles.push(bubble);
    return bubble;
  }

  /**
   * 开始动画
   */
  private startAnimation(): void {
    if (this.animationId) return;

    const { rafController } = require('../utils/RAFController');
    this.animationId = `bubble-${this.id}`;

    rafController.register(this.animationId, () => {
      this.updateBubbles();
      this.drawBubbles();
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
   * 更新气泡
   */
  private updateBubbles(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const percentage = this.config.getPercentage(this.currentValue);
    const limitY = height - (height * percentage) / 100;

    this.bubbles.forEach((bubble, index) => {
      // 更新位置
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(bubble.wobble) * 0.5;
      bubble.wobble += bubble.wobbleSpeed;

      // 重置冒出界限或超过进度线的气泡
      if (bubble.y + bubble.radius < 0 || bubble.y < limitY) {
        this.bubbles[index] = this.createBubble();
        this.bubbles[index].y = height + Math.random() * 20;
      }
    });
  }

  /**
   * 绘制气泡
   */
  private drawBubbles(): void {
    if (!this.ctx) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const bubbleColor = this.config.get('bubbleColor') || 'rgba(64, 158, 255, 0.6)';

    // 清除画布
    this.ctx.clearRect(0, 0, width, height);

    // 绘制所有气泡
    this.bubbles.forEach(bubble => {
      this.ctx.save();
      this.ctx.globalAlpha = bubble.alpha;

      // 气泡主体
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = bubbleColor;
      this.ctx.fill();

      // 高光效果
      const gradient = this.ctx.createRadialGradient(
        bubble.x - bubble.radius * 0.3,
        bubble.y - bubble.radius * 0.3,
        0,
        bubble.x,
        bubble.y,
        bubble.radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      this.ctx.restore();
    });
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



