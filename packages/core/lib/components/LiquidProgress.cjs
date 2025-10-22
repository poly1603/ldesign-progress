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
var MemoryManager = require('../utils/MemoryManager.cjs');

class LiquidProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.waveOffset = 0;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      width: 200,
      height: 200,
      shape: "circle",
      waveHeight: 8,
      waveSpeed: 0.03,
      liquidColor: "#409eff",
      backgroundColor: "#e4e7ed"
    };
  }
  render() {
    this.container.innerHTML = "";
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 200;
    this.wrapper = helpers.createElement("div", "ld-progress-liquid", this.container);
    this.wrapper.style.position = "relative";
    this.wrapper.style.width = `${width}px`;
    this.wrapper.style.height = `${height}px`;
    this.wrapper.style.backgroundColor = this.config.get("backgroundColor") || "#e4e7ed";
    this.wrapper.style.overflow = "hidden";
    const shape = this.config.get("shape") ?? "circle";
    if (shape === "circle") {
      this.wrapper.style.borderRadius = "50%";
    } else if (shape === "rounded") {
      this.wrapper.style.borderRadius = "20px";
    }
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.canvas = helpers.createElement("canvas", "ld-progress-liquid__canvas", this.wrapper);
    this.canvas.width = typeof width === "number" ? width : parseInt(String(width));
    this.canvas.height = typeof height === "number" ? height : parseInt(String(height));
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.ctx = MemoryManager.canvasContextCache.get(this.canvas);
    if (this.config.get("showText")) {
      this.textElement = helpers.createElement("div", "ld-progress-liquid__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.fontSize = "24px";
      this.textElement.style.fontWeight = "bold";
      this.textElement.style.zIndex = "10";
    }
    this.updateProgress(this.currentValue);
    this.startAnimation();
  }
  /**
   * 开始动画
   */
  startAnimation() {
    if (this.animationId)
      return;
    const { rafController } = require("../utils/RAFController");
    this.animationId = `liquid-${this.id}`;
    rafController.register(this.animationId, () => {
      this.drawLiquid();
      const waveSpeed = this.config.get("waveSpeed") ?? 0.03;
      this.waveOffset += waveSpeed;
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
   * 绘制液体
   */
  drawLiquid() {
    if (!this.ctx || !this.canvas)
      return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const percentage = this.config.getPercentage(this.currentValue);
    const waveHeight = this.config.get("waveHeight") ?? 8;
    this.ctx.clearRect(0, 0, width, height);
    const waterLevel = height - height * percentage / 100;
    this.ctx.beginPath();
    this.ctx.moveTo(0, waterLevel);
    for (let x = 0; x <= width; x++) {
      const y = waterLevel + Math.sin(x / width * Math.PI * 4 + this.waveOffset) * waveHeight + Math.sin(x / width * Math.PI * 2 + this.waveOffset * 1.5) * (waveHeight * 0.5);
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();
    const liquidColor = this.config.get("liquidColor") || "#409eff";
    this.ctx.fillStyle = liquidColor;
    this.ctx.fill();
    const gradient = this.ctx.createLinearGradient(0, waterLevel, 0, height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
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

exports.LiquidProgress = LiquidProgress;
//# sourceMappingURL=LiquidProgress.cjs.map
