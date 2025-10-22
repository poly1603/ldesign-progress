/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ProgressBase } from '../base/ProgressBase.js';
import '../utils/RAFController.js';
import { createSVGElement, createBezierPath } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import '../utils/MemoryManager.js';

class SparklineProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.dataPoints = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      width: 200,
      height: 60,
      data: [],
      lineColor: "#409eff",
      fillColor: "rgba(64, 158, 255, 0.1)",
      strokeWidth: 2,
      smooth: true,
      showDots: false,
      dotSize: 4
    };
  }
  render() {
    this.container.innerHTML = "";
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 60;
    this.svg = createSVGElement("svg", {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      class: "ld-progress-sparkline"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    this.dataPoints = this.config.get("data") || this.generateDefaultData();
    this.createFillArea();
    this.createLine();
    if (this.config.get("showDots")) {
      this.createDots();
    }
    this.createProgressLine();
    this.updateProgress(this.currentValue);
  }
  /**
   * 生成默认数据
   */
  generateDefaultData() {
    const points = 20;
    const data = [];
    for (let i = 0; i < points; i++) {
      data.push(30 + Math.random() * 40);
    }
    return data;
  }
  /**
   * 创建填充区域
   */
  createFillArea() {
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 60;
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
    this.fillPath = createSVGElement("path", {
      d: pathData,
      fill: this.config.get("fillColor") || "rgba(64, 158, 255, 0.1)",
      class: "ld-progress-sparkline__fill"
    });
    this.svg.appendChild(this.fillPath);
  }
  /**
   * 创建线条
   */
  createLine() {
    const points = this.dataPointsToCoordinates();
    const smooth = this.config.get("smooth");
    let pathData;
    if (smooth) {
      pathData = createBezierPath(points, 0.3);
    } else {
      pathData = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i].x} ${points[i].y}`;
      }
    }
    this.dataPath = createSVGElement("path", {
      d: pathData,
      fill: "none",
      stroke: this.config.get("lineColor") || "#409eff",
      "stroke-width": this.config.get("strokeWidth") || 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: "ld-progress-sparkline__line"
    });
    this.svg.appendChild(this.dataPath);
  }
  /**
   * 创建数据点
   */
  createDots() {
    const points = this.dataPointsToCoordinates();
    const dotSize = this.config.get("dotSize") ?? 4;
    const lineColor = this.config.get("lineColor") || "#409eff";
    points.forEach((point) => {
      const dot = createSVGElement("circle", {
        cx: point.x,
        cy: point.y,
        r: dotSize,
        fill: lineColor,
        class: "ld-progress-sparkline__dot"
      });
      this.svg.appendChild(dot);
    });
  }
  /**
   * 创建进度指示线
   */
  createProgressLine() {
    const height = this.config.get("height") ?? 60;
    this.progressLine = createSVGElement("line", {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: height,
      stroke: "#f56c6c",
      "stroke-width": 2,
      "stroke-dasharray": "4,4",
      class: "ld-progress-sparkline__progress-line"
    });
    this.svg.appendChild(this.progressLine);
  }
  /**
   * 将数据点转换为坐标
   */
  dataPointsToCoordinates() {
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 60;
    const padding = 5;
    const maxValue = Math.max(...this.dataPoints);
    const minValue = Math.min(...this.dataPoints);
    const range = maxValue - minValue || 1;
    return this.dataPoints.map((value, index) => {
      const x = padding + index / (this.dataPoints.length - 1) * (width - 2 * padding);
      const y = padding + (maxValue - value) / range * (height - 2 * padding);
      return { x, y };
    });
  }
  updateProgress(value) {
    const width = this.config.get("width") ?? 200;
    const percentage = this.config.getPercentage(value);
    const x = width * percentage / 100;
    if (this.progressLine) {
      this.progressLine.setAttribute("x1", String(x));
      this.progressLine.setAttribute("x2", String(x));
    }
  }
  /**
   * 设置数据
   */
  setData(data) {
    this.config.set("data", data);
    this.render();
  }
  /**
   * 添加数据点
   */
  addDataPoint(value) {
    const data = this.config.get("data") || [];
    data.push(value);
    this.setData(data);
  }
}

export { SparklineProgress };
//# sourceMappingURL=SparklineProgress.js.map
