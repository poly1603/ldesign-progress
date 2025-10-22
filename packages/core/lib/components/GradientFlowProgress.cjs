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

class GradientFlowProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.gradientOffset = 0;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 20,
      flowSpeed: 0.5,
      gradientColors: ["#ff0080", "#ff8c00", "#40e0d0", "#ff0080"]
    };
  }
  render() {
    this.container.innerHTML = "";
    const width = this.config.get("width") ?? 300;
    const height = this.config.get("height") ?? 20;
    this.wrapper = helpers.createElement("div", "ld-progress-gradient-flow", this.container);
    this.wrapper.style.width = helpers.toPx(width);
    this.wrapper.style.height = helpers.toPx(height);
    this.wrapper.style.position = "relative";
    this.wrapper.style.backgroundColor = "#e4e7ed";
    this.wrapper.style.borderRadius = `${height}px`;
    this.wrapper.style.overflow = "hidden";
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.bar = helpers.createElement("div", "ld-progress-gradient-flow__bar", this.wrapper);
    this.bar.style.position = "absolute";
    this.bar.style.left = "0";
    this.bar.style.top = "0";
    this.bar.style.height = "100%";
    this.bar.style.borderRadius = "inherit";
    this.bar.style.transition = "width 0.3s ease";
    const colors = this.config.get("gradientColors") || [
      "#ff0080",
      "#ff8c00",
      "#40e0d0",
      "#ff0080"
    ];
    this.bar.style.backgroundImage = `linear-gradient(90deg, ${colors.join(", ")})`;
    this.bar.style.backgroundSize = "200% 100%";
    if (this.config.get("showText")) {
      this.textElement = helpers.createElement("div", "ld-progress-gradient-flow__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.right = "15px";
      this.textElement.style.top = "50%";
      this.textElement.style.transform = "translateY(-50%)";
      this.textElement.style.color = "white";
      this.textElement.style.fontWeight = "bold";
      this.textElement.style.fontSize = "12px";
      this.textElement.style.zIndex = "10";
      this.textElement.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.3)";
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
    this.animationId = `gradient-flow-${this.id}`;
    rafController.register(this.animationId, () => {
      const flowSpeed = this.config.get("flowSpeed") ?? 0.5;
      this.gradientOffset += flowSpeed;
      if (this.bar) {
        this.bar.style.backgroundPosition = `${this.gradientOffset}% 0`;
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
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    if (this.bar) {
      this.bar.style.width = `${percentage}%`;
    }
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

exports.GradientFlowProgress = GradientFlowProgress;
//# sourceMappingURL=GradientFlowProgress.cjs.map
