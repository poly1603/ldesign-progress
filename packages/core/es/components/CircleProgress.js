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

class CircleProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.radius = 50;
    this.circumference = 0;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      radius: 50,
      strokeWidth: 6,
      clockwise: true,
      startAngle: -90,
      lineCap: "round"
    };
  }
  render() {
    this.container.innerHTML = "";
    this.radius = this.config.get("radius") ?? 50;
    const strokeWidth = this.config.get("strokeWidth") ?? 6;
    const size = (this.radius + strokeWidth) * 2;
    this.svg = createSVGElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: "ld-progress-circle"
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
    const center = size / 2;
    this.trackCircle = createSVGElement("circle", {
      cx: center,
      cy: center,
      r: this.radius,
      fill: "none",
      stroke: this.config.get("trackColor") || "#e4e7ed",
      "stroke-width": strokeWidth,
      class: "ld-progress-circle__track"
    });
    this.svg.appendChild(this.trackCircle);
    this.progressCircle = createSVGElement("circle", {
      cx: center,
      cy: center,
      r: this.radius,
      fill: "none",
      "stroke-width": strokeWidth,
      "stroke-linecap": this.config.get("lineCap") ?? "round",
      class: "ld-progress-circle__progress"
    });
    if (this.gradientId) {
      this.progressCircle.setAttribute("stroke", `url(#${this.gradientId})`);
    } else if (typeof color === "string") {
      this.progressCircle.setAttribute("stroke", color);
    }
    this.circumference = 2 * Math.PI * this.radius;
    this.progressCircle.setAttribute("stroke-dasharray", `${this.circumference}`);
    const startAngle = this.config.get("startAngle") ?? -90;
    const clockwise = this.config.get("clockwise") ?? true;
    this.progressCircle.style.transform = `rotate(${startAngle}deg)`;
    this.progressCircle.style.transformOrigin = "center";
    if (!clockwise) {
      this.progressCircle.style.transform += " scaleX(-1)";
    }
    this.svg.appendChild(this.progressCircle);
    if (this.config.get("showText")) {
      this.textElement = document.createElement("div");
      this.textElement.className = "ld-progress-circle__text";
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
  createGradient(colors) {
    this.gradientId = `gradient-${this.id}`;
    const defs = createSVGElement("defs");
    const gradient = createSVGElement("linearGradient", {
      id: this.gradientId,
      x1: "0%",
      y1: "0%",
      x2: "100%",
      y2: "0%"
    });
    colors.forEach((color, index) => {
      const offset = index / (colors.length - 1) * 100;
      const stop = createSVGElement("stop", {
        offset: `${offset}%`,
        "stop-color": color
      });
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    this.svg.insertBefore(defs, this.svg.firstChild);
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const offset = this.circumference - percentage / 100 * this.circumference;
    this.progressCircle.setAttribute("stroke-dashoffset", `${offset}`);
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 设置半径
   */
  setRadius(radius) {
    this.config.set("radius", radius);
    this.render();
  }
  /**
   * 设置方向
   */
  setClockwise(clockwise) {
    this.config.set("clockwise", clockwise);
    this.render();
  }
  /**
   * 设置起始角度
   */
  setStartAngle(angle) {
    this.config.set("startAngle", angle);
    this.render();
  }
  /**
   * 设置线帽样式
   */
  setLineCap(lineCap) {
    this.config.set("lineCap", lineCap);
    if (this.progressCircle) {
      this.progressCircle.setAttribute("stroke-linecap", lineCap);
    }
  }
}

export { CircleProgress };
//# sourceMappingURL=CircleProgress.js.map
