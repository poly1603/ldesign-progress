import { NeonProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createElement, toPx } from '../utils';

/**
 * NeonProgress - 霓虹灯效果进度条
 */
export class NeonProgress extends ProgressBase<NeonProgressOptions> {
  private wrapper!: HTMLElement;
  private track!: HTMLElement;
  private bar!: HTMLElement;
  private textElement?: HTMLElement;

  protected getDefaultOptions(): Partial<NeonProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 20,
      neonColor: '#00ffff',
      glowIntensity: 3,
      flickerEffect: true,
      tubeStyle: true,
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 300;
    const height = this.config.get('height') ?? 20;

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-neon', this.container);
    this.wrapper.style.width = toPx(width);
    this.wrapper.style.height = toPx(height);
    this.wrapper.style.position = 'relative';

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建轨道
    this.track = createElement('div', 'ld-progress-neon__track', this.wrapper);
    this.track.style.width = '100%';
    this.track.style.height = '100%';
    this.track.style.backgroundColor = '#1a1a1a';
    this.track.style.borderRadius = toPx(height);
    this.track.style.position = 'relative';
    this.track.style.overflow = 'hidden';

    if (this.config.get('tubeStyle')) {
      this.track.style.border = '2px solid #333';
      this.track.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.5)';
    }

    // 创建霓虹灯条
    this.bar = createElement('div', 'ld-progress-neon__bar', this.track);
    this.bar.style.position = 'absolute';
    this.bar.style.left = '0';
    this.bar.style.top = '0';
    this.bar.style.height = '100%';
    this.bar.style.borderRadius = 'inherit';
    this.bar.style.transition = 'width 0.3s ease';

    // 设置霓虹灯效果
    const neonColor = this.config.get('neonColor') || '#00ffff';
    const glowIntensity = this.config.get('glowIntensity') ?? 3;

    this.bar.style.backgroundColor = neonColor;
    this.bar.style.boxShadow = `
      0 0 ${glowIntensity * 2}px ${neonColor},
      0 0 ${glowIntensity * 4}px ${neonColor},
      inset 0 0 ${glowIntensity * 2}px ${neonColor}
    `;

    // 闪烁效果
    if (this.config.get('flickerEffect')) {
      this.bar.classList.add('ld-progress-neon__bar--flicker');
    }

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = createElement('div', 'ld-progress-neon__text', this.wrapper);
      this.textElement.style.position = 'absolute';
      this.textElement.style.right = '10px';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translateY(-50%)';
      this.textElement.style.color = neonColor;
      this.textElement.style.textShadow = `0 0 5px ${neonColor}`;
      this.textElement.style.fontWeight = 'bold';
      this.textElement.style.fontSize = '12px';
    }

    this.updateProgress(this.currentValue);
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    // 更新进度条宽度
    if (this.bar) {
      this.bar.style.width = `${percentage}%`;
    }

    // 更新文本
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }

  /**
   * 设置霓虹灯颜色
   */
  setNeonColor(color: string): void {
    this.config.set('neonColor', color);
    this.render();
  }

  /**
   * 设置发光强度
   */
  setGlowIntensity(intensity: number): void {
    this.config.set('glowIntensity', intensity);
    this.render();
  }
}



