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

class GradientRingProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.radius = 60;
    this.circumference = 0;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      radius: 60,
      strokeWidth: 12,
      gradientColors: ["#ff0080", "#ff8c00", "#40e0d0", "#ff0080"],
      trackColor: "#e4e7ed",
      lineCap: "round",
      rotate: -90
    };
  }
  render() {
    this.container.innerHTML = "";
    this.radius = this.config.get("radius") ?? 60;
    const strokeWidth = this.config.get("strokeWidth") ?? 12;
    const size = (this.radius + strokeWidth) * 2;
    this.svg = helpers.createSVGElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: "ld-progress-gradient-ring"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    this.createConicGradient();
    const center = size / 2;
    this.trackCircle = helpers.createSVGElement("circle", {
      cx: center,
      cy: center,
      r: this.radius,
      fill: "none",
      stroke: this.config.get("trackColor") || "#e4e7ed",
      "stroke-width": strokeWidth,
      class: "ld-progress-gradient-ring__track"
    });
    this.svg.appendChild(this.trackCircle);
    this.progressCircle = helpers.createSVGElement("circle", {
      cx: center,
      cy: center,
      r: this.radius,
      fill: "none",
      stroke: `url(#${this.gradientId})`,
      "stroke-width": strokeWidth,
      "stroke-linecap": this.config.get("lineCap") || "round",
      class: "ld-progress-gradient-ring__progress"
    });
    this.circumference = 2 * Math.PI * this.radius;
    this.progressCircle.setAttribute("stroke-dasharray", String(this.circumference));
    const rotate = this.config.get("rotate") ?? -90;
    this.progressCircle.style.transform = `rotate(${rotate}deg)`;
    this.progressCircle.style.transformOrigin = "center";
    this.svg.appendChild(this.progressCircle);
    if (this.config.get("showText")) {
      this.textElement = document.createElement("div");
      this.textElement.className = "ld-progress-gradient-ring__text";
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.container.style.position = "relative";
      this.container.style.display = "inline-block";
      this.container.appendChild(this.textElement);
    }
    this.updateProgress(this.currentValue);
  }
  /**
   * 创建圆锥渐变（模拟）
   */
  createConicGradient() {
    this.gradientId = `gradient-ring-${this.id}`;
    const defs = helpers.createSVGElement("defs");
    const gradientColors = this.config.get("gradientColors") || [
      "#ff0080",
      "#ff8c00",
      "#40e0d0",
      "#ff0080"
    ];
    const gradient = helpers.createSVGElement("linearGradient", {
      id: this.gradientId,
      x1: "0%",
      y1: "0%",
      x2: "100%",
      y2: "100%"
    });
    gradientColors.forEach((color, index) => {
      const offset = index / (gradientColors.length - 1) * 100;
      const stop = helpers.createSVGElement("stop", {
        offset: `${offset}%`,
        "stop-color": color
      });
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    this.svg.appendChild(defs);
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const offset = this.circumference - percentage / 100 * this.circumference;
    this.progressCircle.setAttribute("stroke-dashoffset", String(offset));
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 设置渐变颜色
   */
  setGradientColors(colors) {
    this.config.set("gradientColors", colors);
    this.render();
  }
}

exports.GradientRingProgress = GradientRingProgress;
//# sourceMappingURL=GradientRingProgress.cjs.map
