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

var CircleProgress = require('./CircleProgress.cjs');
require('../utils/RAFController.cjs');
var helpers = require('../utils/helpers.cjs');
require('../utils/ThemeManager.cjs');
require('../utils/MemoryManager.cjs');

class SemiCircleProgress extends CircleProgress.CircleProgress {
  constructor() {
    super(...arguments);
    this.scaleElements = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      angleRange: 180,
      showScale: false,
      scaleCount: 10,
      startAngle: -180
    };
  }
  render() {
    super.render();
    const angleRange = this.config.get("angleRange") ?? 180;
    if (angleRange <= 180) {
      const strokeWidth = this.config.get("strokeWidth") ?? 6;
      const size = (this.radius + strokeWidth) * 2;
      const height = size / 2 + strokeWidth * 2;
      this.svg.setAttribute("viewBox", `0 ${size / 2 - strokeWidth} ${size} ${height}`);
      this.svg.setAttribute("height", `${height}`);
    }
    const angleRad = helpers.degToRad(angleRange);
    this.circumference = this.radius * angleRad;
    this.progressCircle.setAttribute("stroke-dasharray", `${this.circumference} ${2 * Math.PI * this.radius}`);
    if (this.config.get("showScale")) {
      this.renderScale();
    }
    this.updateProgress(this.currentValue);
  }
  renderScale() {
    const scaleCount = this.config.get("scaleCount") ?? 10;
    const angleRange = this.config.get("angleRange") ?? 180;
    const startAngle = this.config.get("startAngle") ?? -180;
    const strokeWidth = this.config.get("strokeWidth") ?? 6;
    const center = (this.radius + strokeWidth) * 2 / 2;
    this.scaleElements.forEach((el) => el.remove());
    this.scaleElements = [];
    for (let i = 0; i <= scaleCount; i++) {
      const angle = startAngle + angleRange / scaleCount * i;
      const angleRad = helpers.degToRad(angle);
      const innerRadius = this.radius - strokeWidth / 2 - 5;
      const outerRadius = this.radius - strokeWidth / 2 + 5;
      const x1 = center + innerRadius * Math.cos(angleRad);
      const y1 = center + innerRadius * Math.sin(angleRad);
      const x2 = center + outerRadius * Math.cos(angleRad);
      const y2 = center + outerRadius * Math.sin(angleRad);
      const line = helpers.createSVGElement("line", {
        x1,
        y1,
        x2,
        y2,
        stroke: "#909399",
        "stroke-width": 1,
        class: "ld-progress-semicircle__scale"
      });
      this.svg.appendChild(line);
      this.scaleElements.push(line);
    }
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const angleRange = this.config.get("angleRange") ?? 180;
    const progress = percentage / 100 * (angleRange / 360);
    const offset = this.circumference - progress * this.circumference * (360 / angleRange);
    this.progressCircle.setAttribute("stroke-dashoffset", `${offset}`);
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
      this.textElement.style.top = "80%";
    }
  }
  /**
   * 设置角度范围
   */
  setAngleRange(angleRange) {
    this.config.set("angleRange", angleRange);
    this.render();
  }
  /**
   * 设置是否显示刻度
   */
  setShowScale(showScale) {
    this.config.set("showScale", showScale);
    this.render();
  }
  /**
   * 设置刻度数量
   */
  setScaleCount(count) {
    this.config.set("scaleCount", count);
    this.render();
  }
}

exports.SemiCircleProgress = SemiCircleProgress;
//# sourceMappingURL=SemiCircleProgress.cjs.map
