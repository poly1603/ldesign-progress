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
import { createSVGElement, degToRad } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import '../utils/MemoryManager.js';

class PolygonProgress extends ProgressBase {
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      sides: 6,
      radius: 60,
      rotation: 0,
      fillMode: "edge"
    };
  }
  render() {
    this.container.innerHTML = "";
    const sides = this.config.get("sides") ?? 6;
    const radius = this.config.get("radius") ?? 60;
    const rotation = this.config.get("rotation") ?? 0;
    const strokeWidth = this.config.get("strokeWidth") ?? 6;
    const size = (radius + strokeWidth) * 2;
    this.svg = createSVGElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: "ld-progress-polygon"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    const points = this.generatePolygonPoints(sides, radius, rotation, size / 2);
    const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");
    this.trackPolygon = createSVGElement("polygon", {
      points: pointsString,
      fill: "none",
      stroke: this.config.get("trackColor") || "#e4e7ed",
      "stroke-width": strokeWidth,
      class: "ld-progress-polygon__track"
    });
    this.svg.appendChild(this.trackPolygon);
    this.progressPolygon = createSVGElement("polygon", {
      points: pointsString,
      fill: "none",
      "stroke-width": strokeWidth,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: "ld-progress-polygon__progress"
    });
    const color = this.config.get("color");
    if (Array.isArray(color)) {
      this.progressPolygon.setAttribute("stroke", color[0]);
    } else if (typeof color === "string") {
      this.progressPolygon.setAttribute("stroke", color);
    } else {
      this.progressPolygon.setAttribute("stroke", "#409eff");
    }
    const perimeter = this.calculatePerimeter(points);
    this.progressPolygon.style.strokeDasharray = `${perimeter}`;
    this.progressPolygon.style.strokeDashoffset = `${perimeter}`;
    this.progressPolygon.style.transition = "stroke-dashoffset 0.3s";
    this.svg.appendChild(this.progressPolygon);
    if (this.config.get("showText")) {
      this.textElement = document.createElement("div");
      this.textElement.className = "ld-progress-polygon__text";
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
  /**
   * 生成多边形的点
   */
  generatePolygonPoints(sides, radius, rotation, center) {
    const points = [];
    const angleStep = 2 * Math.PI / sides;
    const rotationRad = degToRad(rotation);
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep + rotationRad - Math.PI / 2;
      points.push({
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      });
    }
    return points;
  }
  /**
   * 计算多边形周长
   */
  calculatePerimeter(points) {
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    return perimeter;
  }
  updateProgress(value) {
    if (!this.progressPolygon)
      return;
    const percentage = this.config.getPercentage(value);
    const perimeter = parseFloat(this.progressPolygon.style.strokeDasharray);
    const offset = perimeter - percentage / 100 * perimeter;
    this.progressPolygon.style.strokeDashoffset = `${offset}`;
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 设置边数
   */
  setSides(sides) {
    if (sides < 3) {
      console.warn("PolygonProgress: sides must be at least 3");
      return;
    }
    this.config.set("sides", sides);
    this.render();
  }
  /**
   * 设置旋转角度
   */
  setRotation(rotation) {
    this.config.set("rotation", rotation);
    this.render();
  }
}

export { PolygonProgress };
//# sourceMappingURL=PolygonProgress.js.map
