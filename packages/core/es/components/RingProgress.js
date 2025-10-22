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

class RingProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.ringElements = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      baseRadius: 80,
      ringGap: 15,
      rings: []
    };
  }
  render() {
    this.container.innerHTML = "";
    const rings = this.config.get("rings") ?? [];
    if (rings.length === 0) {
      console.warn("RingProgress: No rings configured");
      return;
    }
    const baseRadius = this.config.get("baseRadius") ?? 80;
    const ringGap = this.config.get("ringGap") ?? 15;
    const maxStrokeWidth = Math.max(...rings.map((r) => r.strokeWidth || 8));
    const maxRadius = baseRadius + (rings.length - 1) * ringGap;
    const size = (maxRadius + maxStrokeWidth) * 2;
    this.svg = createSVGElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: "ld-progress-ring"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    this.container.style.position = "relative";
    this.container.style.display = "inline-block";
    this.ringElements = [];
    const center = size / 2;
    rings.forEach((ring, index) => {
      const radius = baseRadius + index * ringGap;
      const strokeWidth = ring.strokeWidth || 8;
      const circumference = 2 * Math.PI * radius;
      const track = createSVGElement("circle", {
        cx: center,
        cy: center,
        r: radius,
        fill: "none",
        stroke: "#e4e7ed",
        "stroke-width": strokeWidth,
        class: "ld-progress-ring__track"
      });
      const progress = createSVGElement("circle", {
        cx: center,
        cy: center,
        r: radius,
        fill: "none",
        stroke: ring.color || this.getDefaultColor(index),
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
        class: "ld-progress-ring__progress"
      });
      progress.style.strokeDasharray = `${circumference}`;
      progress.style.strokeDashoffset = `${circumference}`;
      progress.style.transform = "rotate(-90deg)";
      progress.style.transformOrigin = "center";
      progress.style.transition = "stroke-dashoffset 0.3s";
      this.svg.appendChild(track);
      this.svg.appendChild(progress);
      let textElement;
      if (ring.label) {
        const labelY = center + (index - rings.length / 2 + 0.5) * 20;
        textElement = createSVGElement("text", {
          x: center,
          y: labelY,
          "text-anchor": "middle",
          fill: "#606266",
          "font-size": "12",
          class: "ld-progress-ring__label"
        });
        textElement.textContent = ring.label;
        this.svg.appendChild(textElement);
      }
      this.ringElements.push({ track, progress, text: textElement });
    });
    if (this.config.get("showText")) {
      const centerText = document.createElement("div");
      centerText.className = "ld-progress-ring__text";
      centerText.style.position = "absolute";
      centerText.style.top = "50%";
      centerText.style.left = "50%";
      centerText.style.transform = "translate(-50%, -50%)";
      centerText.style.fontSize = "24px";
      centerText.style.fontWeight = "bold";
      centerText.style.color = "#303133";
      this.container.appendChild(centerText);
    }
    this.updateProgress(this.currentValue);
  }
  updateProgress(value) {
    const rings = this.config.get("rings") ?? [];
    rings.forEach((ring, index) => {
      if (!this.ringElements[index])
        return;
      const { progress } = this.ringElements[index];
      const radius = parseFloat(progress.getAttribute("r") || "0");
      const circumference = 2 * Math.PI * radius;
      const ringPercentage = this.config.getPercentage(ring.value);
      const offset = circumference - ringPercentage / 100 * circumference;
      progress.style.strokeDashoffset = `${offset}`;
    });
    const centerText = this.container.querySelector(".ld-progress-ring__text");
    if (centerText) {
      centerText.textContent = this.formatText(value);
    }
  }
  /**
   * 获取默认颜色
   */
  getDefaultColor(index) {
    const colors = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];
    return colors[index % colors.length];
  }
  /**
   * 更新某个环的值
   */
  updateRing(index, value) {
    const rings = this.config.get("rings") ?? [];
    if (index >= 0 && index < rings.length) {
      rings[index].value = value;
      this.updateProgress(this.currentValue);
    }
  }
  /**
   * 添加环
   */
  addRing(ring) {
    const rings = this.config.get("rings") ?? [];
    rings.push(ring);
    this.config.set("rings", rings);
    this.render();
  }
}

export { RingProgress };
//# sourceMappingURL=RingProgress.js.map
