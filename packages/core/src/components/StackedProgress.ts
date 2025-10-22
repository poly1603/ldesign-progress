import { StackedProgressOptions, StackLayer } from '../types';
import { ProgressBase } from '../base';
import { createElement, toPx } from '../utils';

/**
 * StackedProgress - 3D 堆叠进度条
 */
export class StackedProgress extends ProgressBase<StackedProgressOptions> {
  private wrapper!: HTMLElement;
  private layers: HTMLElement[] = [];

  protected getDefaultOptions(): Partial<StackedProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 30,
      layerCount: 3,
      layerOffset: 5,
      depth: 10,
      colors: ['#409eff', '#67c23a', '#e6a23c'],
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 300;
    const height = this.config.get('height') ?? 30;
    const layerCount = this.config.get('layerCount') ?? 3;
    const layerOffset = this.config.get('layerOffset') ?? 5;
    const depth = this.config.get('depth') ?? 10;
    const colors = this.config.get('colors') || ['#409eff', '#67c23a', '#e6a23c'];

    // 创建包装器
    this.wrapper = createElement('div', 'ld-progress-stacked', this.container);
    this.wrapper.style.position = 'relative';
    this.wrapper.style.width = toPx(width);
    this.wrapper.style.height = toPx((height + layerOffset * layerCount + depth));
    this.wrapper.style.perspective = '1000px';

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建堆叠层
    this.layers = [];
    for (let i = 0; i < layerCount; i++) {
      const layer = createElement('div', 'ld-progress-stacked__layer', this.wrapper);
      layer.style.position = 'absolute';
      layer.style.width = toPx(width);
      layer.style.height = toPx(height);
      layer.style.borderRadius = '10px';
      layer.style.overflow = 'hidden';
      layer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      layer.style.top = `${i * layerOffset}px`;
      layer.style.left = '0';
      layer.style.zIndex = String(layerCount - i);

      // 3D 效果
      layer.style.transform = `translateZ(${i * depth}px)`;
      layer.style.transformStyle = 'preserve-3d';

      // 背景
      const bg = createElement('div', 'ld-progress-stacked__bg', layer);
      bg.style.width = '100%';
      bg.style.height = '100%';
      bg.style.backgroundColor = '#e4e7ed';
      bg.style.opacity = String(0.3 + i * 0.1);

      // 进度条
      const bar = createElement('div', 'ld-progress-stacked__bar', layer);
      bar.style.position = 'absolute';
      bar.style.left = '0';
      bar.style.top = '0';
      bar.style.height = '100%';
      bar.style.transition = 'width 0.3s ease';
      bar.style.backgroundColor = colors[i % colors.length];
      bar.style.boxShadow = `inset 0 0 10px rgba(255, 255, 255, 0.3)`;

      this.layers.push(bar);
    }

    this.updateProgress(this.currentValue);
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    // 更新所有层的进度
    this.layers.forEach((layer, index) => {
      // 每层有轻微的延迟效果
      const delay = index * 0.05;
      layer.style.transitionDelay = `${delay}s`;
      layer.style.width = `${percentage}%`;
    });
  }
}



