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
import { createElement, toPx, supportsOffscreenCanvas, createSVGElement } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import { canvasContextCache } from '../utils/MemoryManager.js';

class WaveProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.waveOffset = 0;
    this.useOffscreen = false;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      width: 200,
      height: 200,
      waveHeight: 10,
      waveCount: 2,
      waveSpeed: 0.05,
      renderMode: "canvas"
    };
  }
  render() {
    this.container.innerHTML = "";
    this.wrapper = createElement("div", "ld-progress-wave", this.container);
    this.wrapper.style.position = "relative";
    this.wrapper.style.display = "inline-block";
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 200;
    this.wrapper.style.width = toPx(width);
    this.wrapper.style.height = toPx(height);
    this.wrapper.style.borderRadius = "50%";
    this.wrapper.style.overflow = "hidden";
    this.wrapper.style.backgroundColor = this.config.get("trackColor") || "#e4e7ed";
    const renderMode = this.config.get("renderMode") ?? "canvas";
    if (renderMode === "canvas") {
      this.renderCanvas();
    } else {
      this.renderSVG();
    }
    if (this.config.get("showText")) {
      this.textElement = createElement("div", "ld-progress-wave__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.zIndex = "10";
      this.textElement.style.fontWeight = "bold";
    }
    this.updateProgress(this.currentValue);
    if (this.config.get("animated")) {
      this.startWaveAnimation();
    }
  }
  renderCanvas() {
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 200;
    const widthNum = typeof width === "number" ? width : parseInt(width);
    const heightNum = typeof height === "number" ? height : parseInt(height);
    this.canvas = createElement("canvas", "ld-progress-wave__canvas", this.wrapper);
    this.canvas.width = widthNum;
    this.canvas.height = heightNum;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.useOffscreen = supportsOffscreenCanvas();
    if (this.useOffscreen) {
      this.offscreenCanvas = new OffscreenCanvas(widthNum, heightNum);
      this.ctx = this.offscreenCanvas.getContext("2d");
    } else {
      this.ctx = canvasContextCache.get(this.canvas, { alpha: true });
    }
  }
  renderSVG() {
    const width = this.config.get("width") ?? 200;
    const height = this.config.get("height") ?? 200;
    this.svg = createSVGElement("svg", {
      width: typeof width === "number" ? width : parseInt(width),
      height: typeof height === "number" ? height : parseInt(height),
      class: "ld-progress-wave__svg"
    });
    this.svg.style.position = "absolute";
    this.svg.style.top = "0";
    this.svg.style.left = "0";
    this.wrapper.appendChild(this.svg);
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
    if (!this.config.get("animated")) {
      this.drawWave(percentage);
    }
  }
  /**
   * 开始波浪动画 - 使用 RAF 池化系统
   */
  startWaveAnimation() {
    this.stopWaveAnimation();
    const { rafController } = require("../utils/RAFController");
    this.animationId = `wave-${this.id}`;
    rafController.register(
      this.animationId,
      () => {
        const percentage = this.config.getPercentage(this.currentValue);
        this.drawWave(percentage);
        const waveSpeed = this.config.get("waveSpeed") ?? 0.05;
        this.waveOffset += waveSpeed;
      },
      0
      // 默认优先级
    );
  }
  /**
   * 停止波浪动画
   */
  stopWaveAnimation() {
    if (this.animationId) {
      const { rafController } = require("../utils/RAFController");
      rafController.unregister(this.animationId);
      this.animationId = void 0;
    }
  }
  /**
   * 绘制波浪
   */
  drawWave(percentage) {
    const renderMode = this.config.get("renderMode") ?? "canvas";
    if (renderMode === "canvas" && this.ctx && this.canvas) {
      this.drawCanvasWave(percentage);
    } else if (renderMode === "svg" && this.svg) {
      this.drawSVGWave(percentage);
    }
  }
  /**
   * Canvas 绘制波浪（优化版，支持 OffscreenCanvas）
   */
  drawCanvasWave(percentage) {
    if (!this.ctx)
      return;
    const width = this.canvas?.width ?? (this.offscreenCanvas?.width ?? 200);
    const height = this.canvas?.height ?? (this.offscreenCanvas?.height ?? 200);
    const waveHeight = this.config.get("waveHeight") ?? 10;
    const waveCount = this.config.get("waveCount") ?? 2;
    this.ctx.clearRect(0, 0, width, height);
    const waterLevel = height - height * percentage / 100;
    this.ctx.beginPath();
    this.ctx.moveTo(0, waterLevel);
    for (let x = 0; x <= width; x++) {
      const y = waterLevel + Math.sin(x / width * Math.PI * waveCount + this.waveOffset) * waveHeight;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();
    const color = this.config.get("color");
    const fillColor = Array.isArray(color) ? color[0] : color || "#409eff";
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    if (this.useOffscreen && this.canvas && this.offscreenCanvas) {
      const ctx2d = this.canvas.getContext("2d");
      if (ctx2d) {
        ctx2d.clearRect(0, 0, width, height);
        ctx2d.drawImage(this.offscreenCanvas, 0, 0);
      }
    }
  }
  /**
   * SVG 绘制波浪
   */
  drawSVGWave(percentage) {
    if (!this.svg)
      return;
    const width = typeof this.config.get("width") === "number" ? this.config.get("width") : parseInt(this.config.get("width"));
    const height = typeof this.config.get("height") === "number" ? this.config.get("height") : parseInt(this.config.get("height"));
    const waveHeight = this.config.get("waveHeight") ?? 10;
    const waveCount = this.config.get("waveCount") ?? 2;
    this.svg.innerHTML = "";
    const waterLevel = height - height * percentage / 100;
    let pathData = `M 0 ${waterLevel}`;
    for (let x = 0; x <= width; x++) {
      const y = waterLevel + Math.sin(x / width * Math.PI * waveCount + this.waveOffset) * waveHeight;
      pathData += ` L ${x} ${y}`;
    }
    pathData += ` L ${width} ${height} L 0 ${height} Z`;
    const path = createSVGElement("path", {
      d: pathData,
      class: "ld-progress-wave__path"
    });
    const color = this.config.get("color");
    const fillColor = Array.isArray(color) ? color[0] : color || "#409eff";
    path.setAttribute("fill", fillColor);
    this.svg.appendChild(path);
  }
  /**
   * 设置波浪高度
   */
  setWaveHeight(height) {
    this.config.set("waveHeight", height);
  }
  /**
   * 设置波浪数量
   */
  setWaveCount(count) {
    this.config.set("waveCount", count);
  }
  /**
   * 设置波浪速度
   */
  setWaveSpeed(speed) {
    this.config.set("waveSpeed", speed);
  }
  /**
   * 销毁
   */
  destroy() {
    this.stopWaveAnimation();
    super.destroy();
  }
}

export { WaveProgress };
//# sourceMappingURL=WaveProgress.js.map
