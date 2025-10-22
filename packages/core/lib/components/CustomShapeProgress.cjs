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

class CustomShapeProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.pathString = "";
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      shapeWidth: 200,
      shapeHeight: 200,
      fillMode: "solid"
    };
  }
  render() {
    this.container.innerHTML = "";
    const shapePath = this.config.get("shapePath");
    if (!shapePath) {
      console.error("CustomShapeProgress: shapePath is required");
      return;
    }
    const width = this.config.get("shapeWidth") ?? 200;
    const height = this.config.get("shapeHeight") ?? 200;
    if (typeof shapePath === "function") {
      this.pathString = shapePath(width, height);
    } else {
      this.pathString = shapePath;
    }
    this.svg = helpers.createSVGElement("svg", {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      class: "ld-progress-custom-shape"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    const color = this.config.get("color");
    if (Array.isArray(color) && color.length > 1) {
      this.createGradient(color);
    }
    this.trackPath = helpers.createSVGElement("path", {
      d: this.pathString,
      fill: "none",
      stroke: this.config.get("trackColor") || "#e4e7ed",
      "stroke-width": this.config.get("strokeWidth") || 6,
      class: "ld-progress-custom-shape__track"
    });
    this.svg.appendChild(this.trackPath);
    this.progressPath = helpers.createSVGElement("path", {
      d: this.pathString,
      fill: "none",
      "stroke-width": this.config.get("strokeWidth") || 6,
      class: "ld-progress-custom-shape__progress"
    });
    if (this.gradientId) {
      this.progressPath.setAttribute("stroke", `url(#${this.gradientId})`);
    } else if (typeof color === "string") {
      this.progressPath.setAttribute("stroke", color);
    } else {
      this.progressPath.setAttribute("stroke", "#409eff");
    }
    const pathLength = this.progressPath.getTotalLength();
    this.progressPath.style.strokeDasharray = `${pathLength}`;
    this.progressPath.style.strokeDashoffset = `${pathLength}`;
    this.progressPath.style.transition = "stroke-dashoffset 0.3s";
    this.svg.appendChild(this.progressPath);
    if (this.config.get("showText")) {
      this.textElement = document.createElement("div");
      this.textElement.className = "ld-progress-custom-shape__text";
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.fontSize = "18px";
      this.textElement.style.fontWeight = "bold";
      this.container.style.position = "relative";
      this.container.style.display = "inline-block";
      this.container.appendChild(this.textElement);
    }
    this.updateProgress(this.currentValue);
  }
  createGradient(colors) {
    this.gradientId = `custom-gradient-${this.id}`;
    const defs = helpers.createSVGElement("defs");
    const gradient = helpers.createSVGElement("linearGradient", {
      id: this.gradientId,
      x1: "0%",
      y1: "0%",
      x2: "100%",
      y2: "100%"
    });
    colors.forEach((color, index) => {
      const offset = index / (colors.length - 1) * 100;
      const stop = helpers.createSVGElement("stop", {
        offset: `${offset}%`,
        "stop-color": color
      });
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    this.svg.insertBefore(defs, this.svg.firstChild);
  }
  updateProgress(value) {
    if (!this.progressPath)
      return;
    const percentage = this.config.getPercentage(value);
    const pathLength = this.progressPath.getTotalLength();
    const offset = pathLength - percentage / 100 * pathLength;
    this.progressPath.style.strokeDashoffset = `${offset}`;
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 设置自定义路径
   */
  setShapePath(path) {
    this.config.set("shapePath", path);
    this.render();
  }
}

exports.CustomShapeProgress = CustomShapeProgress;
//# sourceMappingURL=CustomShapeProgress.cjs.map
