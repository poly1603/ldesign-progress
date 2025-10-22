import { LiquidProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createElement, canvasContextCache } from '../utils';

/**
 * LiquidProgress - 液体填充效果进度条
 */
export class LiquidProgress extends ProgressBase<LiquidProgressOptions> {
  private wrapper!: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId?: string;
  private waveOffset: number = 0;
  private textElement?: HTMLElement;

  protected getDefaultOptions(): Partial<LiquidProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 200,
      height: 200,
      shape: 'circle',
      waveHeight: 8,
      waveSpeed: 0.03,
      liquidColor: '#409eff',
      backgroundColor: '#e4e7ed',
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 200;
    const height = this.config.get('height') ?? 200;

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-liquid', this.container);
    this.wrapper.style.position = 'relative';
    this.wrapper.style.width = `${width}px`;
    this.wrapper.style.height = `${height}px`;
    this.wrapper.style.backgroundColor = this.config.get('backgroundColor') || '#e4e7ed';
    this.wrapper.style.overflow = 'hidden';

    // 设置形状
    const shape = this.config.get('shape') ?? 'circle';
    if (shape === 'circle') {
      this.wrapper.style.borderRadius = '50%';
    } else if (shape === 'rounded') {
      this.wrapper.style.borderRadius = '20px';
    }

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建 Canvas
    this.canvas = createElement('canvas', 'ld-progress-liquid__canvas', this.wrapper) as HTMLCanvasElement;
    this.canvas.width = typeof width === 'number' ? width : parseInt(String(width));
    this.canvas.height = typeof height === 'number' ? height : parseInt(String(height));
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';

    this.ctx = canvasContextCache.get(this.canvas);

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = createElement('div', 'ld-progress-liquid__text', this.wrapper);
      this.textElement.style.position = 'absolute';
      this.textElement.style.top = '50%';
      this.textElement.style.left = '50%';
      this.textElement.style.transform = 'translate(-50%, -50%)';
      this.textElement.style.fontSize = '24px';
      this.textElement.style.fontWeight = 'bold';
      this.textElement.style.zIndex = '10';
    }

    this.updateProgress(this.currentValue);
    this.startAnimation();
  }

  /**
   * 开始动画
   */
  private startAnimation(): void {
    if (this.animationId) return;

    const { rafController } = require('../utils/RAFController');
    this.animationId = `liquid-${this.id}`;

    rafController.register(this.animationId, () => {
      this.drawLiquid();
      const waveSpeed = this.config.get('waveSpeed') ?? 0.03;
      this.waveOffset += waveSpeed;
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
   * 绘制液体
   */
  private drawLiquid(): void {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const percentage = this.config.getPercentage(this.currentValue);
    const waveHeight = this.config.get('waveHeight') ?? 8;

    // 清除画布
    this.ctx.clearRect(0, 0, width, height);

    // 计算液面高度
    const waterLevel = height - (height * percentage) / 100;

    // 绘制液体波浪
    this.ctx.beginPath();
    this.ctx.moveTo(0, waterLevel);

    for (let x = 0; x <= width; x++) {
      const y = waterLevel +
        Math.sin((x / width) * Math.PI * 4 + this.waveOffset) * waveHeight +
        Math.sin((x / width) * Math.PI * 2 + this.waveOffset * 1.5) * (waveHeight * 0.5);
      this.ctx.lineTo(x, y);
    }

    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();

    // 填充液体颜色
    const liquidColor = this.config.get('liquidColor') || '#409eff';
    this.ctx.fillStyle = liquidColor;
    this.ctx.fill();

    // 添加高光效果
    const gradient = this.ctx.createLinearGradient(0, waterLevel, 0, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  protected updateProgress(value: number): void {
    // 更新文本
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



