import { GradientFlowProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createElement, toPx } from '../utils';

/**
 * GradientFlowProgress - 渐变流动进度条
 */
export class GradientFlowProgress extends ProgressBase<GradientFlowProgressOptions> {
  private wrapper!: HTMLElement;
  private bar!: HTMLElement;
  private textElement?: HTMLElement;
  private animationId?: string;
  private gradientOffset: number = 0;

  protected getDefaultOptions(): Partial<GradientFlowProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 20,
      flowSpeed: 0.5,
      gradientColors: ['#ff0080', '#ff8c00', '#40e0d0', '#ff0080'],
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 300;
    const height = this.config.get('height') ?? 20;

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-gradient-flow', this.container);
    this.wrapper.style.width = toPx(width);
    this.wrapper.style.height = toPx(height);
    this.wrapper.style.position = 'relative';
    this.wrapper.style.backgroundColor = '#e4e7ed';
    this.wrapper.style.borderRadius = `${height}px`;
    this.wrapper.style.overflow = 'hidden';

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建进度条
    this.bar = createElement('div', 'ld-progress-gradient-flow__bar', this.wrapper);
    this.bar.style.position = 'absolute';
    this.bar.style.left = '0';
    this.bar.style.top = '0';
    this.bar.style.height = '100%';
    this.bar.style.borderRadius = 'inherit';
    this.bar.style.transition = 'width 0.3s ease';

    // 创建流动渐变
    const colors = this.config.get('gradientColors') || [
      '#ff0080',
      '#ff8c00',
      '#40e0d0',
      '#ff0080',
    ];

    this.bar.style.backgroundImage = `linear-gradient(90deg, ${colors.join(', ')})`;
    this.bar.style.backgroundSize = '200% 100%';

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = createElement('div', 'ld-progress-gradient-flow__text', this.wrapper);
      this.textElement.style.position = 'absolute';
      this.textElement.style.right = '15px';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translateY(-50%)';
      this.textElement.style.color = 'white';
      this.textElement.style.fontWeight = 'bold';
      this.textElement.style.fontSize = '12px';
      this.textElement.style.zIndex = '10';
      this.textElement.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
    }

    this.startAnimation();
    this.updateProgress(this.currentValue);
  }

  /**
   * 开始动画
   */
  private startAnimation(): void {
    if (this.animationId) return;

    const { rafController } = require('../utils/RAFController');
    this.animationId = `gradient-flow-${this.id}`;

    rafController.register(this.animationId, () => {
      const flowSpeed = this.config.get('flowSpeed') ?? 0.5;
      this.gradientOffset += flowSpeed;

      if (this.bar) {
        this.bar.style.backgroundPosition = `${this.gradientOffset}% 0`;
      }
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

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    if (this.bar) {
      this.bar.style.width = `${percentage}%`;
    }

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



