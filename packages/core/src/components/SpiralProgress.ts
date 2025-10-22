import { SpiralProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createSVGElement } from '../utils';

/**
 * SpiralProgress - 螺旋进度条
 */
export class SpiralProgress extends ProgressBase<SpiralProgressOptions> {
  private svg!: SVGSVGElement;
  private spiralPath!: SVGPathElement;
  private textElement?: HTMLElement;
  private pathLength: number = 0;

  protected getDefaultOptions(): Partial<SpiralProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      size: 200,
      turns: 3,
      innerRadius: 20,
      strokeWidth: 6,
      clockwise: true,
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const size = this.config.get('size') ?? 200;

    // 创建 SVG
    this.svg = createSVGElement('svg', {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: 'ld-progress-spiral',
    }) as SVGSVGElement;

    const className = this.config.get('className');
    if (className) {
      this.svg.classList.add(className);
    }

    this.container.appendChild(this.svg);

    // 创建螺旋路径
    const center = size / 2;
    const turns = this.config.get('turns') ?? 3;
    const innerRadius = this.config.get('innerRadius') ?? 20;
    const outerRadius = size / 2 - 10;
    const clockwise = this.config.get('clockwise') ?? true;

    const pathData = this.generateSpiralPath(
      center,
      center,
      innerRadius,
      outerRadius,
      turns,
      clockwise
    );

    // 背景螺旋
    const bgPath = createSVGElement('path', {
      d: pathData,
      fill: 'none',
      stroke: '#e4e7ed',
      'stroke-width': this.config.get('strokeWidth') || 6,
      'stroke-linecap': 'round',
      class: 'ld-progress-spiral__bg',
    });
    this.svg.appendChild(bgPath);

    // 进度螺旋
    this.spiralPath = createSVGElement('path', {
      d: pathData,
      fill: 'none',
      'stroke-width': this.config.get('strokeWidth') || 6,
      'stroke-linecap': 'round',
      class: 'ld-progress-spiral__progress',
    }) as SVGPathElement;

    const color = this.config.get('color');
    const strokeColor = Array.isArray(color) ? color[0] : color || '#409eff';
    this.spiralPath.setAttribute('stroke', strokeColor);

    // 计算路径长度
    this.pathLength = this.spiralPath.getTotalLength();
    this.spiralPath.style.strokeDasharray = String(this.pathLength);
    this.spiralPath.style.strokeDashoffset = String(this.pathLength);

    this.svg.appendChild(this.spiralPath);

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = document.createElement('div');
      this.textElement.className = 'ld-progress-spiral__text';
      this.textElement.style.position = 'absolute';
      this.textElement.style.top = '50%';
      this.textElement.style.left = '50%';
      this.textElement.style.transform = 'translate(-50%, -50%)';
      this.textElement.style.fontSize = '20px';
      this.textElement.style.fontWeight = 'bold';

      this.container.style.position = 'relative';
      this.container.style.display = 'inline-block';
      this.container.appendChild(this.textElement);
    }

    this.updateProgress(this.currentValue);
  }

  /**
   * 生成螺旋路径
   */
  private generateSpiralPath(
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    turns: number,
    clockwise: boolean
  ): string {
    const points = turns * 100;
    const radiusStep = (outerRadius - innerRadius) / points;
    const angleStep = (turns * 2 * Math.PI) / points;
    const direction = clockwise ? 1 : -1;

    let path = '';

    for (let i = 0; i <= points; i++) {
      const radius = innerRadius + i * radiusStep;
      const angle = i * angleStep * direction;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      if (i === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path;
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    // 更新螺旋进度
    const offset = this.pathLength - (this.pathLength * percentage) / 100;
    this.spiralPath.style.strokeDashoffset = String(offset);

    // 更新文本
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
}



