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

var SemiCircleProgress = require('./SemiCircleProgress.cjs');
require('../utils/RAFController.cjs');
var helpers = require('../utils/helpers.cjs');
require('../utils/ThemeManager.cjs');
require('../utils/MemoryManager.cjs');

class DashboardProgress extends SemiCircleProgress.SemiCircleProgress {
  constructor() {
    super(...arguments);
    this.colorRangeElements = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      showPointer: true,
      colorRanges: void 0,
      warningZones: void 0,
      angleRange: 270,
      startAngle: -225,
      showScale: true,
      scaleCount: 10
    };
  }
  render() {
    super.render();
    const colorRanges = this.config.get("colorRanges");
    if (colorRanges && colorRanges.length > 0) {
      this.renderColorRanges(colorRanges);
    }
    const warningZones = this.config.get("warningZones");
    if (warningZones && warningZones.length > 0) {
      this.renderWarningZones(warningZones);
    }
    if (this.config.get("showPointer")) {
      this.renderPointer();
    }
    this.updateProgress(this.currentValue);
  }
  renderColorRanges(ranges) {
    const strokeWidth = this.config.get("strokeWidth") ?? 6;
    const center = (this.radius + strokeWidth) * 2 / 2;
    const angleRange = this.config.get("angleRange") ?? 270;
    const startAngle = this.config.get("startAngle") ?? -225;
    const max = this.config.get("max") ?? 100;
    this.colorRangeElements.forEach((el) => el.remove());
    this.colorRangeElements = [];
    ranges.forEach((range) => {
      const startPercent = helpers.clamp(range.min / max, 0, 1);
      const endPercent = helpers.clamp(range.max / max, 0, 1);
      const startDeg = startAngle + angleRange * startPercent;
      const endDeg = startAngle + angleRange * endPercent;
      const sweepAngle = endDeg - startDeg;
      const startRad = helpers.degToRad(startDeg);
      const endRad = helpers.degToRad(endDeg);
      const innerRadius = this.radius - strokeWidth;
      const outerRadius = this.radius;
      const path = helpers.createSVGElement("path", {
        fill: range.color,
        opacity: "0.3",
        class: "ld-progress-dashboard__range"
      });
      const x1 = center + innerRadius * Math.cos(startRad);
      const y1 = center + innerRadius * Math.sin(startRad);
      const x2 = center + outerRadius * Math.cos(startRad);
      const y2 = center + outerRadius * Math.sin(startRad);
      const x3 = center + outerRadius * Math.cos(endRad);
      const y3 = center + outerRadius * Math.sin(endRad);
      const x4 = center + innerRadius * Math.cos(endRad);
      const y4 = center + innerRadius * Math.sin(endRad);
      const largeArc = sweepAngle > 180 ? 1 : 0;
      const d = [
        `M ${x1} ${y1}`,
        `L ${x2} ${y2}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
        `L ${x4} ${y4}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
        "Z"
      ].join(" ");
      path.setAttribute("d", d);
      this.svg.insertBefore(path, this.trackCircle);
      this.colorRangeElements.push(path);
    });
  }
  renderWarningZones(zones) {
    zones.forEach((zone) => {
      this.colorRangeElements.push(...this.colorRangeElements);
    });
  }
  renderPointer() {
    const strokeWidth = this.config.get("strokeWidth") ?? 6;
    const center = (this.radius + strokeWidth) * 2 / 2;
    const pointerLength = this.radius - strokeWidth / 2;
    const pointerGroup = helpers.createSVGElement("g", {
      class: "ld-progress-dashboard__pointer"
    });
    this.pointer = helpers.createSVGElement("line", {
      x1: center,
      y1: center,
      x2: center,
      y2: center - pointerLength,
      stroke: "#f56c6c",
      "stroke-width": 2,
      "stroke-linecap": "round"
    });
    const centerDot = helpers.createSVGElement("circle", {
      cx: center,
      cy: center,
      r: 4,
      fill: "#f56c6c"
    });
    pointerGroup.appendChild(this.pointer);
    pointerGroup.appendChild(centerDot);
    this.svg.appendChild(pointerGroup);
    pointerGroup.style.transformOrigin = `${center}px ${center}px`;
  }
  updateProgress(value) {
    super.updateProgress(value);
    if (this.pointer) {
      const percentage = this.config.getPercentage(value);
      const angleRange = this.config.get("angleRange") ?? 270;
      const startAngle = this.config.get("startAngle") ?? -225;
      const angle = startAngle + angleRange * percentage / 100;
      const pointerGroup = this.pointer.parentElement;
      if (pointerGroup) {
        pointerGroup.style.transform = `rotate(${angle}deg)`;
      }
    }
    const colorRanges = this.config.get("colorRanges");
    if (colorRanges && colorRanges.length > 0) {
      const currentRange = colorRanges.find(
        (range) => value >= range.min && value <= range.max
      );
      if (currentRange && this.progressCircle) {
        this.progressCircle.setAttribute("stroke", currentRange.color);
      }
    }
  }
  /**
   * 设置是否显示指针
   */
  setShowPointer(show) {
    this.config.set("showPointer", show);
    this.render();
  }
  /**
   * 设置颜色范围
   */
  setColorRanges(ranges) {
    this.config.set("colorRanges", ranges);
    this.render();
  }
}

exports.DashboardProgress = DashboardProgress;
//# sourceMappingURL=DashboardProgress.cjs.map
