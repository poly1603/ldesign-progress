import { SparklineProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createSVGElement, createBezierPath } from '../utils';

/**
 * SparklineProgress - 迷你图进度条
 */
export class SparklineProgress extends ProgressBase<SparklineProgressOptions> {
  private svg!: SVGSVGElement;
  private dataPath!: SVGPathElement;
  private fillPath!: SVGPathElement;
  private progressLine!: SVGLineElement;
  private dataPoints: number[] = [];

  protected getDefaultOptions(): Partial<SparklineProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      width: 200,
      height: 60,
      data: [],
      lineColor: '#409eff',
      fillColor: 'rgba(64, 158, 255, 0.1)',
      strokeWidth: 2,
      smooth: true,
      showDots: false,
      dotSize: 4,
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const width = this.config.get('width') ?? 200;
    const height = this.config.get('height') ?? 60;

    // 创建 SVG
    this.svg = createSVGElement('svg', {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      class: 'ld-progress-sparkline',
    }) as SVGSVGElement;

    const className = this.config.get('className');
    if (className) {
      this.svg.classList.add(className);
    }

    this.container.appendChild(this.svg);

    // 获取数据
    this.dataPoints = this.config.get('data') || this.generateDefaultData();

    // 创建填充区域
    this.createFillArea();

    // 创建线条
    this.createLine();

    // 创建数据点
    if (this.config.get('showDots')) {
      this.createDots();
    }

    // 创建进度指示线
    this.createProgressLine();

    this.updateProgress(this.currentValue);
  }

  /**
   * 生成默认数据
   */
  private generateDefaultData(): number[] {
    const points = 20;
    const data: number[] = [];
    for (let i = 0; i < points; i++) {
      data.push(30 + Math.random() * 40);
    }
    return data;
  }

  /**
   * 创建填充区域
   */
  private createFillArea(): void {
    const width = this.config.get('width') ?? 200;
    const height = this.config.get('height') ?? 60;
    const points = this.dataPointsToCoordinates();

    let pathData = `M 0 ${height}`;
    points.forEach((p, i) => {
      if (i === 0) {
        pathData += ` L ${p.x} ${p.y}`;
      } else {
        pathData += ` L ${p.x} ${p.y}`;
      }
    });
    pathData += ` L ${width} ${height} Z`;

    this.fillPath = createSVGElement('path', {
      d: pathData,
      fill: this.config.get('fillColor') || 'rgba(64, 158, 255, 0.1)',
      class: 'ld-progress-sparkline__fill',
    }) as SVGPathElement;

    this.svg.appendChild(this.fillPath);
  }

  /**
   * 创建线条
   */
  private createLine(): void {
    const points = this.dataPointsToCoordinates();
    const smooth = this.config.get('smooth');

    let pathData: string;
    if (smooth) {
      pathData = createBezierPath(points, 0.3);
    } else {
      pathData = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i].x} ${points[i].y}`;
      }
    }

    this.dataPath = createSVGElement('path', {
      d: pathData,
      fill: 'none',
      stroke: this.config.get('lineColor') || '#409eff',
      'stroke-width': this.config.get('strokeWidth') || 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'ld-progress-sparkline__line',
    }) as SVGPathElement;

    this.svg.appendChild(this.dataPath);
  }

  /**
   * 创建数据点
   */
  private createDots(): void {
    const points = this.dataPointsToCoordinates();
    const dotSize = this.config.get('dotSize') ?? 4;
    const lineColor = this.config.get('lineColor') || '#409eff';

    points.forEach(point => {
      const dot = createSVGElement('circle', {
        cx: point.x,
        cy: point.y,
        r: dotSize,
        fill: lineColor,
        class: 'ld-progress-sparkline__dot',
      });
      this.svg.appendChild(dot);
    });
  }

  /**
   * 创建进度指示线
   */
  private createProgressLine(): void {
    const height = this.config.get('height') ?? 60;

    this.progressLine = createSVGElement('line', {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: height,
      stroke: '#f56c6c',
      'stroke-width': 2,
      'stroke-dasharray': '4,4',
      class: 'ld-progress-sparkline__progress-line',
    }) as SVGLineElement;

    this.svg.appendChild(this.progressLine);
  }

  /**
   * 将数据点转换为坐标
   */
  private dataPointsToCoordinates(): Array<{ x: number; y: number }> {
    const width = this.config.get('width') ?? 200;
    const height = this.config.get('height') ?? 60;
    const padding = 5;

    const maxValue = Math.max(...this.dataPoints);
    const minValue = Math.min(...this.dataPoints);
    const range = maxValue - minValue || 1;

    return this.dataPoints.map((value, index) => {
      const x = padding + (index / (this.dataPoints.length - 1)) * (width - 2 * padding);
      const y = padding + ((maxValue - value) / range) * (height - 2 * padding);
      return { x, y };
    });
  }

  protected updateProgress(value: number): void {
    const width = this.config.get('width') ?? 200;
    const percentage = this.config.getPercentage(value);
    const x = (width * percentage) / 100;

    // 更新进度线位置
    if (this.progressLine) {
      this.progressLine.setAttribute('x1', String(x));
      this.progressLine.setAttribute('x2', String(x));
    }
  }

  /**
   * 设置数据
   */
  setData(data: number[]): void {
    this.config.set('data', data);
    this.render();
  }

  /**
   * 添加数据点
   */
  addDataPoint(value: number): void {
    const data = this.config.get('data') || [];
    data.push(value);
    this.setData(data);
  }
}



