import { PathProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createSVGElement, setAttributes } from '../utils';

/**
 * PathProgress - 沿 SVG 路径运动的进度条
 */
export class PathProgress extends ProgressBase<PathProgressOptions> {
  private svg!: SVGSVGElement;
  private pathElement!: SVGPathElement;
  private indicatorElement!: SVGElement;
  private pathLength: number = 0;
  private textElement?: HTMLElement;

  protected getDefaultOptions(): Partial<PathProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      pathData: 'M 10 80 Q 95 10 180 80', // 默认贝塞尔曲线
      width: 200,
      height: 100,
      strokeWidth: 4,
      indicatorType: 'circle',
      indicatorSize: 12,
      showPath: true,
      pathColor: '#e4e7ed',
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 200;
    const height = this.config.get('height') ?? 100;

    // 创建 SVG
    this.svg = createSVGElement('svg', {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      class: 'ld-progress-path',
    }) as SVGSVGElement;

    const className = this.config.get('className');
    if (className) {
      this.svg.classList.add(className);
    }

    this.container.appendChild(this.svg);

    // 创建路径
    const pathData = this.config.get('pathData') ?? 'M 10 80 Q 95 10 180 80';
    const strokeWidth = this.config.get('strokeWidth') ?? 4;

    // 背景路径
    if (this.config.get('showPath')) {
      const backgroundPath = createSVGElement('path', {
        d: pathData,
        fill: 'none',
        stroke: this.config.get('pathColor') || '#e4e7ed',
        'stroke-width': strokeWidth,
        'stroke-linecap': 'round',
        class: 'ld-progress-path__bg',
      });
      this.svg.appendChild(backgroundPath);
    }

    // 进度路径
    this.pathElement = createSVGElement('path', {
      d: pathData,
      fill: 'none',
      'stroke-width': strokeWidth,
      'stroke-linecap': 'round',
      class: 'ld-progress-path__line',
    }) as SVGPathElement;

    // 设置颜色
    const color = this.config.get('color');
    if (color) {
      const strokeColor = Array.isArray(color) ? color[0] : color;
      this.pathElement.setAttribute('stroke', strokeColor);
    }

    this.svg.appendChild(this.pathElement);

    // 计算路径长度
    this.pathLength = this.pathElement.getTotalLength();
    this.pathElement.style.strokeDasharray = String(this.pathLength);
    this.pathElement.style.strokeDashoffset = String(this.pathLength);

    // 创建指示器
    this.createIndicator();

    // 创建文本
    if (this.config.get('showText')) {
      this.textElement = document.createElement('div');
      this.textElement.className = 'ld-progress-path__text';
      this.textElement.style.position = 'absolute';
      this.container.style.position = 'relative';
      this.container.style.display = 'inline-block';
      this.container.appendChild(this.textElement);
    }

    this.updateProgress(this.currentValue);
  }

  /**
   * 创建路径指示器
   */
  private createIndicator(): void {
    const indicatorType = this.config.get('indicatorType') ?? 'circle';
    const indicatorSize = this.config.get('indicatorSize') ?? 12;
    const color = this.config.get('color');
    const indicatorColor = Array.isArray(color) ? color[0] : color || '#409eff';

    switch (indicatorType) {
      case 'circle':
        this.indicatorElement = createSVGElement('circle', {
          r: indicatorSize / 2,
          fill: indicatorColor,
          class: 'ld-progress-path__indicator',
        }) as SVGCircleElement;
        break;

      case 'arrow':
        this.indicatorElement = createSVGElement('polygon', {
          points: `0,-${indicatorSize} ${indicatorSize * 0.8},0 0,${indicatorSize}`,
          fill: indicatorColor,
          class: 'ld-progress-path__indicator',
        }) as SVGPolygonElement;
        break;

      case 'square':
        this.indicatorElement = createSVGElement('rect', {
          width: indicatorSize,
          height: indicatorSize,
          fill: indicatorColor,
          class: 'ld-progress-path__indicator',
        }) as SVGRectElement;
        break;

      case 'none':
        return;

      default:
        this.indicatorElement = createSVGElement('circle', {
          r: indicatorSize / 2,
          fill: indicatorColor,
          class: 'ld-progress-path__indicator',
        }) as SVGCircleElement;
    }

    this.svg.appendChild(this.indicatorElement);
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    // 更新路径
    const offset = this.pathLength - (this.pathLength * percentage) / 100;
    this.pathElement.style.strokeDashoffset = String(offset);

    // 更新指示器位置
    if (this.indicatorElement) {
      const point = this.pathElement.getPointAtLength(
        (this.pathLength * percentage) / 100
      );

      if (this.indicatorElement instanceof SVGCircleElement) {
        this.indicatorElement.setAttribute('cx', String(point.x));
        this.indicatorElement.setAttribute('cy', String(point.y));
      } else if (this.indicatorElement instanceof SVGRectElement) {
        const size = this.config.get('indicatorSize') ?? 12;
        this.indicatorElement.setAttribute('x', String(point.x - size / 2));
        this.indicatorElement.setAttribute('y', String(point.y - size / 2));
      } else {
        // 箭头或其他，使用 transform
        this.indicatorElement.setAttribute(
          'transform',
          `translate(${point.x}, ${point.y})`
        );
      }
    }

    // 更新文本
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }

  /**
   * 设置路径数据
   */
  setPathData(pathData: string): void {
    this.config.set('pathData', pathData);
    this.render();
  }

  /**
   * 设置指示器类型
   */
  setIndicatorType(type: 'circle' | 'arrow' | 'square' | 'none'): void {
    this.config.set('indicatorType', type);
    this.render();
  }
}



