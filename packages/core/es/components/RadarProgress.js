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
import { createElement } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import { canvasContextCache } from '../utils/MemoryManager.js';

class RadarProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.scanAngle = 0;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      size: 200,
      scanSpeed: 2,
      radarColor: "#00ff00",
      gridColor: "rgba(0, 255, 0, 0.2)",
      gridLines: 4,
      showGrid: true
    };
  }
  render() {
    this.container.innerHTML = "";
    const size = this.config.get("size") ?? 200;
    this.wrapper = createElement("div", "ld-progress-radar", this.container);
    this.wrapper.style.width = `${size}px`;
    this.wrapper.style.height = `${size}px`;
    this.wrapper.style.position = "relative";
    this.wrapper.style.backgroundColor = "#001a00";
    this.wrapper.style.borderRadius = "50%";
    this.wrapper.style.overflow = "hidden";
    this.wrapper.style.boxShadow = "inset 0 0 20px rgba(0, 255, 0, 0.3)";
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.canvas = createElement("canvas", "ld-progress-radar__canvas", this.wrapper);
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = canvasContextCache.get(this.canvas);
    if (this.config.get("showText")) {
      this.textElement = createElement("div", "ld-progress-radar__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.color = "#00ff00";
      this.textElement.style.fontSize = "24px";
      this.textElement.style.fontWeight = "bold";
      this.textElement.style.textShadow = "0 0 10px #00ff00";
      this.textElement.style.zIndex = "10";
    }
    this.startAnimation();
    this.updateProgress(this.currentValue);
  }
  /**
   * 开始动画
   */
  startAnimation() {
    if (this.animationId)
      return;
    const { rafController } = require("../utils/RAFController");
    this.animationId = `radar-${this.id}`;
    rafController.register(this.animationId, () => {
      this.drawRadar();
      const scanSpeed = this.config.get("scanSpeed") ?? 2;
      this.scanAngle += scanSpeed;
      if (this.scanAngle >= 360) {
        this.scanAngle = 0;
      }
    }, 0);
  }
  /**
   * 停止动画
   */
  stopAnimation() {
    if (this.animationId) {
      const { rafController } = require("../utils/RAFController");
      rafController.unregister(this.animationId);
      this.animationId = void 0;
    }
  }
  /**
   * 绘制雷达
   */
  drawRadar() {
    if (!this.ctx)
      return;
    const size = this.canvas.width;
    const center = size / 2;
    const percentage = this.config.getPercentage(this.currentValue);
    const maxAngle = 360 * percentage / 100;
    const radarColor = this.config.get("radarColor") || "#00ff00";
    const gridColor = this.config.get("gridColor") || "rgba(0, 255, 0, 0.2)";
    this.ctx.clearRect(0, 0, size, size);
    if (this.config.get("showGrid")) {
      const gridLines = this.config.get("gridLines") ?? 4;
      for (let i = 1; i <= gridLines; i++) {
        const radius = center * i / gridLines;
        this.ctx.beginPath();
        this.ctx.arc(center, center, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }
    if (this.scanAngle <= maxAngle) {
      this.ctx.save();
      this.ctx.translate(center, center);
      this.ctx.rotate(this.scanAngle * Math.PI / 180);
      const gradient = this.ctx.createLinearGradient(0, 0, center, 0);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.7, radarColor + "80");
      gradient.addColorStop(1, radarColor);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(center, 0);
      this.ctx.strokeStyle = radarColor;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, center, 0, Math.PI / 6);
      this.ctx.closePath();
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.restore();
    }
    this.ctx.beginPath();
    this.ctx.arc(
      center,
      center,
      center - 5,
      -Math.PI / 2,
      -Math.PI / 2 + maxAngle * Math.PI / 180
    );
    this.ctx.strokeStyle = radarColor;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }
  updateProgress(value) {
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 销毁
   */
  destroy() {
    this.stopAnimation();
    super.destroy();
  }
}

export { RadarProgress };
//# sourceMappingURL=RadarProgress.js.map
