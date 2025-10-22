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

class NeonProgress extends ProgressBase.ProgressBase {
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 20,
      neonColor: "#00ffff",
      glowIntensity: 3,
      flickerEffect: true,
      tubeStyle: true
    };
  }
  render() {
    this.container.innerHTML = "";
    const width = this.config.get("width") ?? 300;
    const height = this.config.get("height") ?? 20;
    this.wrapper = helpers.createElement("div", "ld-progress-neon", this.container);
    this.wrapper.style.width = helpers.toPx(width);
    this.wrapper.style.height = helpers.toPx(height);
    this.wrapper.style.position = "relative";
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.track = helpers.createElement("div", "ld-progress-neon__track", this.wrapper);
    this.track.style.width = "100%";
    this.track.style.height = "100%";
    this.track.style.backgroundColor = "#1a1a1a";
    this.track.style.borderRadius = helpers.toPx(height);
    this.track.style.position = "relative";
    this.track.style.overflow = "hidden";
    if (this.config.get("tubeStyle")) {
      this.track.style.border = "2px solid #333";
      this.track.style.boxShadow = "inset 0 0 10px rgba(0, 0, 0, 0.5)";
    }
    this.bar = helpers.createElement("div", "ld-progress-neon__bar", this.track);
    this.bar.style.position = "absolute";
    this.bar.style.left = "0";
    this.bar.style.top = "0";
    this.bar.style.height = "100%";
    this.bar.style.borderRadius = "inherit";
    this.bar.style.transition = "width 0.3s ease";
    const neonColor = this.config.get("neonColor") || "#00ffff";
    const glowIntensity = this.config.get("glowIntensity") ?? 3;
    this.bar.style.backgroundColor = neonColor;
    this.bar.style.boxShadow = `
      0 0 ${glowIntensity * 2}px ${neonColor},
      0 0 ${glowIntensity * 4}px ${neonColor},
      inset 0 0 ${glowIntensity * 2}px ${neonColor}
    `;
    if (this.config.get("flickerEffect")) {
      this.bar.classList.add("ld-progress-neon__bar--flicker");
    }
    if (this.config.get("showText")) {
      this.textElement = helpers.createElement("div", "ld-progress-neon__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.right = "10px";
      this.textElement.style.top = "50%";
      this.textElement.style.transform = "translateY(-50%)";
      this.textElement.style.color = neonColor;
      this.textElement.style.textShadow = `0 0 5px ${neonColor}`;
      this.textElement.style.fontWeight = "bold";
      this.textElement.style.fontSize = "12px";
    }
    this.updateProgress(this.currentValue);
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
   * 设置霓虹灯颜色
   */
  setNeonColor(color) {
    this.config.set("neonColor", color);
    this.render();
  }
  /**
   * 设置发光强度
   */
  setGlowIntensity(intensity) {
    this.config.set("glowIntensity", intensity);
    this.render();
  }
}

exports.NeonProgress = NeonProgress;
//# sourceMappingURL=NeonProgress.cjs.map
