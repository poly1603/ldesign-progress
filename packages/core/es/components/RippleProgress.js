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

class RippleProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.ripples = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      size: 150,
      rippleCount: 3,
      rippleSpeed: 0.5,
      rippleColor: "#409eff",
      maxRadius: 100
    };
  }
  render() {
    this.container.innerHTML = "";
    const size = this.config.get("size") ?? 150;
    this.wrapper = createElement("div", "ld-progress-ripple", this.container);
    this.wrapper.style.width = `${size}px`;
    this.wrapper.style.height = `${size}px`;
    this.wrapper.style.position = "relative";
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.canvas = createElement("canvas", "ld-progress-ripple__canvas", this.wrapper);
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = canvasContextCache.get(this.canvas);
    if (this.config.get("showText")) {
      this.textElement = createElement("div", "ld-progress-ripple__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.fontSize = "20px";
      this.textElement.style.fontWeight = "bold";
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
    this.animationId = `ripple-${this.id}`;
    rafController.register(this.animationId, () => {
      this.updateRipples();
      this.drawRipples();
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
   * 更新涟漪
   */
  updateRipples() {
    const percentage = this.config.getPercentage(this.currentValue);
    const rippleCount = this.config.get("rippleCount") ?? 3;
    const maxRadius = this.config.get("maxRadius") ?? 100;
    const rippleSpeed = this.config.get("rippleSpeed") ?? 0.5;
    if (percentage > 0 && this.ripples.length < rippleCount * 2) {
      if (Math.random() < 0.05) {
        this.ripples.push({
          radius: 0,
          alpha: 1,
          maxRadius: maxRadius * percentage / 100
        });
      }
    }
    this.ripples = this.ripples.filter((ripple) => {
      ripple.radius += rippleSpeed;
      ripple.alpha -= 0.01;
      return ripple.alpha > 0 && ripple.radius <= ripple.maxRadius;
    });
  }
  /**
   * 绘制涟漪
   */
  drawRipples() {
    if (!this.ctx)
      return;
    const size = this.canvas.width;
    const center = size / 2;
    const rippleColor = this.config.get("rippleColor") || "#409eff";
    this.ctx.clearRect(0, 0, size, size);
    this.ripples.forEach((ripple) => {
      this.ctx.beginPath();
      this.ctx.arc(center, center, ripple.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = rippleColor;
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = ripple.alpha;
      this.ctx.stroke();
    });
    this.ctx.globalAlpha = 1;
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

export { RippleProgress };
//# sourceMappingURL=RippleProgress.js.map
