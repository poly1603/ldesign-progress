import { SkeletonProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createElement, toPx } from '../utils';

/**
 * SkeletonProgress - 骨架屏进度条
 */
export class SkeletonProgress extends ProgressBase<SkeletonProgressOptions> {
  private wrapper!: HTMLElement;
  private track!: HTMLElement;
  private shimmer!: HTMLElement;
  private textElement?: HTMLElement;

  protected getDefaultOptions(): Partial<SkeletonProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 20,
      shimmerSpeed: 1.5,
      baseColor: '#e4e7ed',
      shimmerColor: '#f5f7fa',
      showShimmer: true,
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 300;
    const height = this.config.get('height') ?? 20;

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-skeleton', this.container);
    this.wrapper.style.width = toPx(width);
    this.wrapper.style.height = toPx(height);
    this.wrapper.style.position = 'relative';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.borderRadius = '4px';

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建轨道
    this.track = createElement('div', 'ld-progress-skeleton__track', this.wrapper);
    this.track.style.width = '100%';
    this.track.style.height = '100%';
    this.track.style.backgroundColor = this.config.get('baseColor') || '#e4e7ed';
    this.track.style.position = 'relative';

    // 创建闪光效果
    if (this.config.get('showShimmer')) {
      this.shimmer = createElement('div', 'ld-progress-skeleton__shimmer', this.track);
      this.shimmer.style.position = 'absolute';
      this.shimmer.style.top = '0';
      this.shimmer.style.left = '-100%';
      this.shimmer.style.width = '100%';
      this.shimmer.style.height = '100%';

      const shimmerColor = this.config.get('shimmerColor') || '#f5f7fa';
      this.shimmer.style.background = `linear-gradient(
        90deg,
        transparent,
        ${shimmerColor},
        transparent
      )`;

      const shimmerSpeed = this.config.get('shimmerSpeed') ?? 1.5;
      this.shimmer.style.animation = `skeleton-shimmer ${shimmerSpeed}s infinite`;
    }

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = createElement('div', 'ld-progress-skeleton__text', this.wrapper);
      this.textElement.style.position = 'absolute';
      this.textElement.style.right = '10px';
      this.textElement.style.top = '50%';
      this.textElement.style.transform = 'translateY(-50%)';
      this.textElement.style.fontSize = '12px';
      this.textElement.style.color = '#606266';
    }

    this.updateProgress(this.currentValue);
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    // 根据进度调整透明度
    if (this.track) {
      const alpha = 1 - percentage / 100;
      this.track.style.opacity = String(Math.max(0.3, alpha));
    }

    // 更新文本
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);

      // 完成时隐藏
      if (percentage >= 100) {
        this.textElement.textContent = '加载完成';
        this.wrapper.style.opacity = '0';
        setTimeout(() => {
          if (this.wrapper) {
            this.wrapper.style.display = 'none';
          }
        }, 300);
      }
    }
  }
}



