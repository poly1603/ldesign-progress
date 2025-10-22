import { GradientRingProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createSVGElement } from '../utils';

/**
 * GradientRingProgress - 圆锥渐变环形进度条
 */
export class GradientRingProgress extends ProgressBase<GradientRingProgressOptions> {
  private svg!: SVGSVGElement;
  private trackCircle!: SVGCircleElement;
  private progressCircle!: SVGCircleElement;
  private textElement?: HTMLElement;
  private gradientId!: string;
  private radius: number = 60;
  private circumference: number = 0;

  protected getDefaultOptions(): Partial<GradientRingProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      radius: 60,
      strokeWidth: 12,
      gradientColors: ['#ff0080', '#ff8c00', '#40e0d0', '#ff0080'],
      trackColor: '#e4e7ed',
      lineCap: 'round',
      rotate: -90,
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    this.radius = this.config.get('radius') ?? 60;
    const strokeWidth = this.config.get('strokeWidth') ?? 12;
    const size = (this.radius + strokeWidth) * 2;

    // 创建 SVG
    this.svg = createSVGElement('svg', {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: 'ld-progress-gradient-ring',
    }) as SVGSVGElement;

    const className = this.config.get('className');
    if (className) {
      this.svg.classList.add(className);
    }

    this.container.appendChild(this.svg);

    // 创建圆锥渐变
    this.createConicGradient();

    const center = size / 2;

    // 创建轨道圆
    this.trackCircle = createSVGElement('circle', {
      cx: center,
      cy: center,
      r: this.radius,
      fill: 'none',
      stroke: this.config.get('trackColor') || '#e4e7ed',
      'stroke-width': strokeWidth,
      class: 'ld-progress-gradient-ring__track',
    }) as SVGCircleElement;
    this.svg.appendChild(this.trackCircle);

    // 创建进度圆
    this.progressCircle = createSVGElement('circle', {
      cx: center,
      cy: center,
      r: this.radius,
      fill: 'none',
      stroke: `url(#${this.gradientId})`,
      'stroke-width': strokeWidth,
      'stroke-linecap': this.config.get('lineCap') || 'round',
      class: 'ld-progress-gradient-ring__progress',
    }) as SVGCircleElement;

    // 计算周长
    this.circumference = 2 * Math.PI * this.radius;
    this.progressCircle.setAttribute('stroke-dasharray', String(this.circumference));

    // 设置旋转
    const rotate = this.config.get('rotate') ?? -90;
    this.progressCircle.style.transform = `rotate(${rotate}deg)`;
    this.progressCircle.style.transformOrigin = 'center';

    this.svg.appendChild(this.progressCircle);

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = document.createElement('div');
      this.textElement.className = 'ld-progress-gradient-ring__text';
      this.textElement.style.position = 'absolute';
      this.textElement.style.top = '50%';
      this.textElement.style.left = '50%';
      this.textElement.style.transform = 'translate(-50%, -50%)';

      this.container.style.position = 'relative';
      this.container.style.display = 'inline-block';

      this.container.appendChild(this.textElement);
    }

    this.updateProgress(this.currentValue);
  }

  /**
   * 创建圆锥渐变（模拟）
   */
  private createConicGradient(): void {
    this.gradientId = `gradient-ring-${this.id}`;

    const defs = createSVGElement('defs') as SVGDefsElement;

    // SVG 不直接支持圆锥渐变，使用线性渐变模拟
    const gradientColors = this.config.get('gradientColors') || [
      '#ff0080',
      '#ff8c00',
      '#40e0d0',
      '#ff0080',
    ];

    const gradient = createSVGElement('linearGradient', {
      id: this.gradientId,
      x1: '0%',
      y1: '0%',
      x2: '100%',
      y2: '100%',
    }) as SVGLinearGradientElement;

    gradientColors.forEach((color, index) => {
      const offset = (index / (gradientColors.length - 1)) * 100;
      const stop = createSVGElement('stop', {
        offset: `${offset}%`,
        'stop-color': color,
      });
      gradient.appendChild(stop);
    });

    defs.appendChild(gradient);
    this.svg.appendChild(defs);
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    // 更新进度圆
    const offset = this.circumference - (percentage / 100) * this.circumference;
    this.progressCircle.setAttribute('stroke-dashoffset', String(offset));

    // 更新文本
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }

  /**
   * 设置渐变颜色
   */
  setGradientColors(colors: string[]): void {
    this.config.set('gradientColors', colors);
    this.render();
  }
}



