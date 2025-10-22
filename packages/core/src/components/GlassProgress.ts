import { GlassProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createElement, toPx } from '../utils';

/**
 * GlassProgress - 毛玻璃效果进度条
 */
export class GlassProgress extends ProgressBase<GlassProgressOptions> {
  private wrapper!: HTMLElement;
  private track!: HTMLElement;
  private bar!: HTMLElement;
  private textElement?: HTMLElement;

  protected getDefaultOptions(): Partial<GlassProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 30,
      blurAmount: 10,
      opacity: 0.7,
      glassColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 300;
    const height = this.config.get('height') ?? 30;

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-glass', this.container);
    this.wrapper.style.width = toPx(width);
    this.wrapper.style.height = toPx(height);
    this.wrapper.style.position = 'relative';
    this.wrapper.style.borderRadius = '15px';
    this.wrapper.style.overflow = 'hidden';

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建轨道
    this.track = createElement('div', 'ld-progress-glass__track', this.wrapper);
    this.track.style.width = '100%';
    this.track.style.height = '100%';
    this.track.style.backgroundColor = this.config.get('glassColor') || 'rgba(255, 255, 255, 0.2)';
    this.track.style.backdropFilter = `blur(${this.config.get('blurAmount') ?? 10}px)`;
    this.track.style.WebkitBackdropFilter = `blur(${this.config.get('blurAmount') ?? 10}px)`;
    this.track.style.border = `1px solid ${this.config.get('borderColor') || 'rgba(255, 255, 255, 0.3)'}`;
    this.track.style.borderRadius = 'inherit';
    this.track.style.position = 'relative';

    // 创建进度条
    this.bar = createElement('div', 'ld-progress-glass__bar', this.track);
    this.bar.style.position = 'absolute';
    this.bar.style.left = '0';
    this.bar.style.top = '0';
    this.bar.style.height = '100%';
    this.bar.style.borderRadius = 'inherit';
    this.bar.style.transition = 'width 0.3s ease';

    const color = this.config.get('color');
    const barColor = Array.isArray(color) ? color[0] : color || 'rgba(64, 158, 255, 0.5)';
    this.bar.style.background = `linear-gradient(90deg, ${barColor}, rgba(255, 255, 255, 0.3))`;
    this.bar.style.backdropFilter = `blur(${(this.config.get('blurAmount') ?? 10) / 2}px)`;
    this.bar.style.WebkitBackdropFilter = `blur(${(this.config.get('blurAmount') ?? 10) / 2}px)`;
    this.bar.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.5)';

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = createElement('div', 'ld-progress-glass__text', this.wrapper);
      this.textElement.style.position = 'absolute';
      this.textElement.style.right = '15px';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translateY(-50%)';
      this.textElement.style.fontSize = '14px';
      this.textElement.style.fontWeight = 'bold';
      this.textElement.style.color = 'white';
      this.textElement.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
      this.textElement.style.zIndex = '10';
    }

    this.updateProgress(this.currentValue);
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
}



