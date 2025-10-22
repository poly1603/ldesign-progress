/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:32 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var ProgressBase = require('../base/ProgressBase.cjs');
require('../utils/RAFController.cjs');
var helpers = require('../utils/helpers.cjs');
require('../utils/ThemeManager.cjs');
require('../utils/MemoryManager.cjs');

class PathProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.pathLength = 0;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      pathData: "M 10 80 Q 95 10 180 80",
      // 默认贝塞尔曲线
      width: 200,
      height: 100,
      strokeWidth: 4,
      indicatorType: "circle",
      indicatorSize: 12,
      showPath: true,
      pathColor: "#e4e7ed"
    };
  }
  render() {
    this.container.innerHTML = "";
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 100;
    this.svg = helpers.createSVGElement("svg", {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      class: "ld-progress-path"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    const pathData = this.config.get("pathData") ?? "M 10 80 Q 95 10 180 80";
    const strokeWidth = this.config.get("strokeWidth") ?? 4;
    if (this.config.get("showPath")) {
      const backgroundPath = helpers.createSVGElement("path", {
        d: pathData,
        fill: "none",
        stroke: this.config.get("pathColor") || "#e4e7ed",
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
        class: "ld-progress-path__bg"
      });
      this.svg.appendChild(backgroundPath);
    }
    this.pathElement = helpers.createSVGElement("path", {
      d: pathData,
      fill: "none",
      "stroke-width": strokeWidth,
      "stroke-linecap": "round",
      class: "ld-progress-path__line"
    });
    const color = this.config.get("color");
    if (color) {
      const strokeColor = Array.isArray(color) ? color[0] : color;
      this.pathElement.setAttribute("stroke", strokeColor);
    }
    this.svg.appendChild(this.pathElement);
    this.pathLength = this.pathElement.getTotalLength();
    this.pathElement.style.strokeDasharray = String(this.pathLength);
    this.pathElement.style.strokeDashoffset = String(this.pathLength);
    this.createIndicator();
    if (this.config.get("showText")) {
      this.textElement = document.createElement("div");
      this.textElement.className = "ld-progress-path__text";
      this.textElement.style.position = "absolute";
      this.container.style.position = "relative";
      this.container.style.display = "inline-block";
      this.container.appendChild(this.textElement);
    }
    this.updateProgress(this.currentValue);
  }
  /**
   * 创建路径指示器
   */
  createIndicator() {
    const indicatorType = this.config.get("indicatorType") ?? "circle";
    const indicatorSize = this.config.get("indicatorSize") ?? 12;
    const color = this.config.get("color");
    const indicatorColor = Array.isArray(color) ? color[0] : color || "#409eff";
    switch (indicatorType) {
      case "circle":
        this.indicatorElement = helpers.createSVGElement("circle", {
          r: indicatorSize / 2,
          fill: indicatorColor,
          class: "ld-progress-path__indicator"
        });
        break;
      case "arrow":
        this.indicatorElement = helpers.createSVGElement("polygon", {
          points: `0,-${indicatorSize} ${indicatorSize * 0.8},0 0,${indicatorSize}`,
          fill: indicatorColor,
          class: "ld-progress-path__indicator"
        });
        break;
      case "square":
        this.indicatorElement = helpers.createSVGElement("rect", {
          width: indicatorSize,
          height: indicatorSize,
          fill: indicatorColor,
          class: "ld-progress-path__indicator"
        });
        break;
      case "none":
        return;
      default:
        this.indicatorElement = helpers.createSVGElement("circle", {
          r: indicatorSize / 2,
          fill: indicatorColor,
          class: "ld-progress-path__indicator"
        });
    }
    this.svg.appendChild(this.indicatorElement);
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const offset = this.pathLength - this.pathLength * percentage / 100;
    this.pathElement.style.strokeDashoffset = String(offset);
    if (this.indicatorElement) {
      const point = this.pathElement.getPointAtLength(
        this.pathLength * percentage / 100
      );
      if (this.indicatorElement instanceof SVGCircleElement) {
        this.indicatorElement.setAttribute("cx", String(point.x));
        this.indicatorElement.setAttribute("cy", String(point.y));
      } else if (this.indicatorElement instanceof SVGRectElement) {
        const size = this.config.get("indicatorSize") ?? 12;
        this.indicatorElement.setAttribute("x", String(point.x - size / 2));
        this.indicatorElement.setAttribute("y", String(point.y - size / 2));
      } else {
        this.indicatorElement.setAttribute(
          "transform",
          `translate(${point.x}, ${point.y})`
        );
      }
    }
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 设置路径数据
   */
  setPathData(pathData) {
    this.config.set("pathData", pathData);
    this.render();
  }
  /**
   * 设置指示器类型
   */
  setIndicatorType(type) {
    this.config.set("indicatorType", type);
    this.render();
  }
}

exports.PathProgress = PathProgress;
//# sourceMappingURL=PathProgress.cjs.map
