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
import { createElement, toPx, createSVGElement } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import '../utils/MemoryManager.js';

class BatteryProgress extends ProgressBase {
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      orientation: "horizontal",
      batteryWidth: 100,
      batteryHeight: 50,
      showBoltIcon: false,
      chargingColor: "#67c23a",
      lowBatteryThreshold: 20,
      lowBatteryColor: "#f56c6c"
    };
  }
  render() {
    this.container.innerHTML = "";
    this.wrapper = createElement("div", "ld-progress-battery", this.container);
    const orientation = this.config.get("orientation") ?? "horizontal";
    this.wrapper.classList.add(`ld-progress-battery--${orientation}`);
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    const width = this.config.get("batteryWidth") ?? 100;
    const height = this.config.get("batteryHeight") ?? 50;
    if (orientation === "horizontal") {
      this.wrapper.style.width = toPx(width);
      this.wrapper.style.height = toPx(height);
    } else {
      this.wrapper.style.width = toPx(height);
      this.wrapper.style.height = toPx(width);
    }
    this.wrapper.style.display = "inline-flex";
    this.wrapper.style.alignItems = "center";
    this.wrapper.style.position = "relative";
    this.battery = createElement("div", "ld-progress-battery__body", this.wrapper);
    this.battery.style.flex = "1";
    this.battery.style.height = "100%";
    this.battery.style.border = "3px solid #909399";
    this.battery.style.borderRadius = "4px";
    this.battery.style.position = "relative";
    this.battery.style.overflow = "hidden";
    this.battery.style.backgroundColor = "#f5f5f5";
    this.fill = createElement("div", "ld-progress-battery__fill", this.battery);
    this.fill.style.position = "absolute";
    this.fill.style.bottom = "0";
    this.fill.style.left = "0";
    this.fill.style.height = "100%";
    this.fill.style.transition = "width 0.3s, background-color 0.3s";
    this.head = createElement("div", "ld-progress-battery__head", this.wrapper);
    if (orientation === "horizontal") {
      this.head.style.width = "6px";
      this.head.style.height = "40%";
      this.head.style.backgroundColor = "#909399";
      this.head.style.borderRadius = "0 3px 3px 0";
    } else {
      this.head.style.width = "40%";
      this.head.style.height = "6px";
      this.head.style.backgroundColor = "#909399";
      this.head.style.borderRadius = "3px 3px 0 0";
      this.head.style.order = "-1";
    }
    if (this.config.get("showBoltIcon")) {
      this.renderBoltIcon();
    }
    if (this.config.get("showText")) {
      this.textElement = createElement("div", "ld-progress-battery__text", this.battery);
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.fontSize = "14px";
      this.textElement.style.fontWeight = "bold";
      this.textElement.style.color = "#303133";
      this.textElement.style.zIndex = "10";
    }
    this.updateProgress(this.currentValue);
  }
  renderBoltIcon() {
    const svg = createSVGElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      class: "ld-progress-battery__bolt"
    });
    const path = createSVGElement("path", {
      d: "M13 2L3 14h8l-1 8 10-12h-8l1-8z",
      fill: "#ffd43b",
      stroke: "#f59e0b",
      "stroke-width": "1"
    });
    svg.appendChild(path);
    svg.style.position = "absolute";
    svg.style.top = "50%";
    svg.style.left = "50%";
    svg.style.transform = "translate(-50%, -50%)";
    svg.style.zIndex = "10";
    this.battery.appendChild(svg);
    this.boltIcon = svg;
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const orientation = this.config.get("orientation") ?? "horizontal";
    const lowThreshold = this.config.get("lowBatteryThreshold") ?? 20;
    const lowColor = this.config.get("lowBatteryColor") ?? "#f56c6c";
    const chargingColor = this.config.get("chargingColor") ?? "#67c23a";
    if (orientation === "horizontal") {
      this.fill.style.width = `${percentage}%`;
      this.fill.style.height = "100%";
    } else {
      this.fill.style.width = "100%";
      this.fill.style.height = `${percentage}%`;
    }
    let fillColor;
    if (percentage <= lowThreshold) {
      fillColor = lowColor;
    } else if (this.config.get("showBoltIcon")) {
      fillColor = chargingColor;
    } else {
      const color = this.config.get("color");
      fillColor = Array.isArray(color) ? color[0] : color || "#67c23a";
    }
    this.fill.style.backgroundColor = fillColor;
    if (percentage <= lowThreshold && percentage > 0) {
      this.fill.style.animation = "battery-pulse 1.5s infinite";
    } else {
      this.fill.style.animation = "none";
    }
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 设置方向
   */
  setOrientation(orientation) {
    this.config.set("orientation", orientation);
    this.render();
  }
  /**
   * 设置充电状态
   */
  setCharging(charging) {
    this.config.set("showBoltIcon", charging);
    if (charging && !this.boltIcon) {
      this.renderBoltIcon();
    } else if (!charging && this.boltIcon) {
      this.boltIcon.remove();
      this.boltIcon = void 0;
    }
    this.updateProgress(this.currentValue);
  }
}

export { BatteryProgress };
//# sourceMappingURL=BatteryProgress.js.map
