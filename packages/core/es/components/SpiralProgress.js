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
import { createSVGElement } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import '../utils/MemoryManager.js';

class SpiralProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.pathLength = 0;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      size: 200,
      turns: 3,
      innerRadius: 20,
      strokeWidth: 6,
      clockwise: true
    };
  }
  render() {
    this.container.innerHTML = "";
    const size = this.config.get("size") ?? 200;
    this.svg = createSVGElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: "ld-progress-spiral"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    const center = size / 2;
    const turns = this.config.get("turns") ?? 3;
    const innerRadius = this.config.get("innerRadius") ?? 20;
    const outerRadius = size / 2 - 10;
    const clockwise = this.config.get("clockwise") ?? true;
    const pathData = this.generateSpiralPath(
      center,
      center,
      innerRadius,
      outerRadius,
      turns,
      clockwise
    );
    const bgPath = createSVGElement("path", {
      d: pathData,
      fill: "none",
      stroke: "#e4e7ed",
      "stroke-width": this.config.get("strokeWidth") || 6,
      "stroke-linecap": "round",
      class: "ld-progress-spiral__bg"
    });
    this.svg.appendChild(bgPath);
    this.spiralPath = createSVGElement("path", {
      d: pathData,
      fill: "none",
      "stroke-width": this.config.get("strokeWidth") || 6,
      "stroke-linecap": "round",
      class: "ld-progress-spiral__progress"
    });
    const color = this.config.get("color");
    const strokeColor = Array.isArray(color) ? color[0] : color || "#409eff";
    this.spiralPath.setAttribute("stroke", strokeColor);
    this.pathLength = this.spiralPath.getTotalLength();
    this.spiralPath.style.strokeDasharray = String(this.pathLength);
    this.spiralPath.style.strokeDashoffset = String(this.pathLength);
    this.svg.appendChild(this.spiralPath);
    if (this.config.get("showText")) {
      this.textElement = document.createElement("div");
      this.textElement.className = "ld-progress-spiral__text";
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.fontSize = "20px";
      this.textElement.style.fontWeight = "bold";
      this.container.style.position = "relative";
      this.container.style.display = "inline-block";
      this.container.appendChild(this.textElement);
    }
    this.updateProgress(this.currentValue);
  }
  /**
   * 生成螺旋路径
   */
  generateSpiralPath(cx, cy, innerRadius, outerRadius, turns, clockwise) {
    const points = turns * 100;
    const radiusStep = (outerRadius - innerRadius) / points;
    const angleStep = turns * 2 * Math.PI / points;
    const direction = clockwise ? 1 : -1;
    let path = "";
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
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const offset = this.pathLength - this.pathLength * percentage / 100;
    this.spiralPath.style.strokeDashoffset = String(offset);
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
}

export { SpiralProgress };
//# sourceMappingURL=SpiralProgress.js.map
