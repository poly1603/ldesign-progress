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
require('../utils/MemoryManager.cjs');

class HeartProgress extends ProgressBase.ProgressBase {
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      heartSize: 100,
      fillMode: "bottom-up",
      beatAnimation: false,
      beatSpeed: 1e3
    };
  }
  render() {
    this.container.innerHTML = "";
    const size = this.config.get("heartSize") ?? 100;
    this.svg = helpers.createSVGElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      class: "ld-progress-heart"
    });
    const className = this.config.get("className");
    if (className) {
      this.svg.classList.add(className);
    }
    this.container.appendChild(this.svg);
    const heartPath = "M50,92 C25,75 8,55 8,40 C8,28 16,20 27,20 C35,20 42,24 50,32 C58,24 65,20 73,20 C84,20 92,28 92,40 C92,55 75,75 50,92 Z";
    const color = this.config.get("color");
    if (Array.isArray(color) && color.length > 1) {
      this.createGradient(color);
    }
    this.trackPath = helpers.createSVGElement("path", {
      d: heartPath,
      fill: this.config.get("trackColor") || "#ffe6e6",
      stroke: "#ffb3b3",
      "stroke-width": "1",
      class: "ld-progress-heart__track"
    });
    this.svg.appendChild(this.trackPath);
    const fillMode = this.config.get("fillMode") ?? "bottom-up";
    if (fillMode === "bottom-up") {
      const clipPath = helpers.createSVGElement("clipPath", {
        id: `heart-clip-${this.id}`
      });
      const clipRect = helpers.createSVGElement("rect", {
        x: "0",
        y: "100",
        width: "100",
        height: "0",
        class: "ld-progress-heart__clip-rect"
      });
      clipPath.appendChild(clipRect);
      const defs = helpers.createSVGElement("defs");
      defs.appendChild(clipPath);
      this.svg.insertBefore(defs, this.trackPath);
      this.progressPath = helpers.createSVGElement("path", {
        d: heartPath,
        fill: this.getHeartColor(),
        "clip-path": `url(#heart-clip-${this.id})`,
        class: "ld-progress-heart__progress"
      });
    } else if (fillMode === "center-out") {
      this.progressPath = helpers.createSVGElement("path", {
        d: heartPath,
        fill: this.getHeartColor(),
        transform: "translate(50, 50) scale(0) translate(-50, -50)",
        class: "ld-progress-heart__progress"
      });
      this.progressPath.style.transformOrigin = "center";
      this.progressPath.style.transition = "transform 0.3s";
    } else {
      this.progressPath = helpers.createSVGElement("path", {
        d: heartPath,
        fill: this.getHeartColor(),
        opacity: "0",
        class: "ld-progress-heart__progress"
      });
    }
    this.svg.appendChild(this.progressPath);
    if (this.config.get("showText")) {
      this.textElement = document.createElement("div");
      this.textElement.className = "ld-progress-heart__text";
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.fontSize = "14px";
      this.textElement.style.fontWeight = "bold";
      this.textElement.style.color = "#fff";
      this.textElement.style.textShadow = "0 1px 2px rgba(0,0,0,0.3)";
      this.container.style.position = "relative";
      this.container.style.display = "inline-block";
      this.container.appendChild(this.textElement);
    }
    if (this.config.get("beatAnimation")) {
      this.startBeatAnimation();
    }
    this.updateProgress(this.currentValue);
  }
  createGradient(colors) {
    this.gradientId = `heart-gradient-${this.id}`;
    const defs = this.svg.querySelector("defs") || helpers.createSVGElement("defs");
    const gradient = helpers.createSVGElement("linearGradient", {
      id: this.gradientId,
      x1: "0%",
      y1: "100%",
      x2: "0%",
      y2: "0%"
    });
    colors.forEach((color, index) => {
      const offset = index / (colors.length - 1) * 100;
      const stop = helpers.createSVGElement("stop", {
        offset: `${offset}%`,
        "stop-color": color
      });
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    if (!this.svg.querySelector("defs")) {
      this.svg.insertBefore(defs, this.svg.firstChild);
    }
  }
  getHeartColor() {
    const color = this.config.get("color");
    if (this.gradientId) {
      return `url(#${this.gradientId})`;
    } else if (Array.isArray(color)) {
      return color[0];
    } else if (typeof color === "string") {
      return color;
    }
    return "#ff4757";
  }
  updateProgress(value) {
    if (!this.progressPath)
      return;
    const percentage = this.config.getPercentage(value);
    const fillMode = this.config.get("fillMode") ?? "bottom-up";
    if (fillMode === "bottom-up") {
      const clipRect = this.svg.querySelector(".ld-progress-heart__clip-rect");
      if (clipRect) {
        clipRect.setAttribute("y", `${100 - percentage}`);
        clipRect.setAttribute("height", `${percentage}`);
      }
    } else if (fillMode === "center-out") {
      const scale = percentage / 100;
      this.progressPath.setAttribute(
        "transform",
        `translate(50, 50) scale(${scale}) translate(-50, -50)`
      );
    } else {
      const opacity = percentage / 100;
      this.progressPath.setAttribute("opacity", `${opacity}`);
    }
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 启动心跳动画
   */
  startBeatAnimation() {
    this.stopBeatAnimation();
    this.config.get("beatSpeed") ?? 1e3;
    let scale = 1;
    let growing = true;
    const beat = () => {
      if (growing) {
        scale += 0.02;
        if (scale >= 1.1) {
          growing = false;
        }
      } else {
        scale -= 0.02;
        if (scale <= 1) {
          growing = true;
        }
      }
      this.svg.style.transform = `scale(${scale})`;
      this.svg.style.transformOrigin = "center";
      this.animationId = requestAnimationFrame(beat);
    };
    beat();
  }
  /**
   * 停止心跳动画
   */
  stopBeatAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = void 0;
      this.svg.style.transform = "scale(1)";
    }
  }
  /**
   * 设置心跳动画
   */
  setBeatAnimation(enabled) {
    this.config.set("beatAnimation", enabled);
    if (enabled) {
      this.startBeatAnimation();
    } else {
      this.stopBeatAnimation();
    }
  }
  /**
   * 设置填充模式
   */
  setFillMode(mode) {
    this.config.set("fillMode", mode);
    this.render();
  }
  /**
   * 销毁
   */
  destroy() {
    this.stopBeatAnimation();
    super.destroy();
  }
}

exports.HeartProgress = HeartProgress;
//# sourceMappingURL=HeartProgress.cjs.map
