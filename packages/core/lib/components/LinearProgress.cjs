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

class LinearProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.segmentBars = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      direction: "horizontal",
      strokeWidth: 6,
      buffer: void 0,
      segments: void 0,
      striped: false,
      active: false,
      indeterminate: false
    };
  }
  render() {
    this.container.innerHTML = "";
    this.wrapper = helpers.createElement("div", "ld-progress-linear", this.container);
    const direction = this.config.get("direction") ?? "horizontal";
    this.wrapper.classList.add(`ld-progress-linear--${direction}`);
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    const strokeWidth = this.config.get("strokeWidth") ?? 6;
    if (direction === "horizontal") {
      this.wrapper.style.height = helpers.toPx(strokeWidth);
      const width = this.config.get("width");
      if (width) {
        this.wrapper.style.width = helpers.toPx(width);
      }
    } else {
      this.wrapper.style.width = helpers.toPx(strokeWidth);
      const height = this.config.get("height");
      if (height) {
        this.wrapper.style.height = helpers.toPx(height);
      }
    }
    this.track = helpers.createElement("div", "ld-progress-linear__track", this.wrapper);
    const trackColor = this.config.get("trackColor");
    if (trackColor) {
      this.track.style.backgroundColor = trackColor;
    }
    const buffer = this.config.get("buffer");
    if (buffer !== void 0) {
      this.bufferBar = helpers.createElement("div", "ld-progress-linear__buffer", this.track);
      this.updateBuffer(buffer);
    }
    const segments = this.config.get("segments");
    if (segments && segments.length > 0) {
      this.renderSegments();
    } else {
      this.bar = helpers.createElement("div", "ld-progress-linear__bar", this.track);
      const color = this.config.get("color");
      if (color) {
        this.bar.style.background = helpers.parseGradient(color, direction === "horizontal" ? "to right" : "to top");
      }
      if (this.config.get("striped")) {
        this.bar.classList.add("ld-progress-linear__bar--striped");
      }
      if (this.config.get("active")) {
        this.bar.classList.add("ld-progress-linear__bar--active");
      }
      if (this.config.get("indeterminate")) {
        this.bar.classList.add("ld-progress-linear__bar--indeterminate");
      }
    }
    if (this.config.get("showText")) {
      const textInside = this.config.get("textInside");
      this.textElement = helpers.createElement(
        "div",
        "ld-progress-linear__text",
        textInside ? this.bar || this.wrapper : this.container
      );
      if (textInside) {
        this.textElement.classList.add("ld-progress-linear__text--inside");
      }
    }
    this.updateProgress(this.currentValue);
  }
  renderSegments() {
    const segments = this.config.get("segments");
    const direction = this.config.get("direction") ?? "horizontal";
    const gap = this.config.get("gap") ?? 0;
    this.segmentBars = [];
    let accumulatedValue = 0;
    segments.forEach((segment, index) => {
      const segmentBar = helpers.createElement("div", "ld-progress-linear__segment", this.track);
      if (segment.color) {
        segmentBar.style.backgroundColor = segment.color;
      }
      const percentage = segment.value / (this.config.get("max") ?? 100) * 100;
      if (direction === "horizontal") {
        segmentBar.style.left = `${accumulatedValue}%`;
        segmentBar.style.width = `calc(${percentage}% - ${gap}px)`;
      } else {
        segmentBar.style.bottom = `${accumulatedValue}%`;
        segmentBar.style.height = `calc(${percentage}% - ${gap}px)`;
      }
      accumulatedValue += percentage;
      this.segmentBars.push(segmentBar);
      if (segment.label) {
        const label = helpers.createElement("span", "ld-progress-linear__segment-label", segmentBar);
        label.textContent = segment.label;
      }
    });
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const direction = this.config.get("direction") ?? "horizontal";
    if (this.bar && !this.config.get("indeterminate")) {
      if (direction === "horizontal") {
        this.bar.style.width = `${percentage}%`;
      } else {
        this.bar.style.height = `${percentage}%`;
      }
    }
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 更新缓冲进度
   */
  updateBuffer(buffer) {
    if (!this.bufferBar)
      return;
    const percentage = this.config.getPercentage(buffer);
    const direction = this.config.get("direction") ?? "horizontal";
    if (direction === "horizontal") {
      this.bufferBar.style.width = `${percentage}%`;
    } else {
      this.bufferBar.style.height = `${percentage}%`;
    }
  }
  /**
   * 设置缓冲值
   */
  setBuffer(buffer) {
    this.config.set("buffer", buffer);
    this.updateBuffer(buffer);
  }
  /**
   * 设置方向
   */
  setDirection(direction) {
    this.config.set("direction", direction);
    this.render();
  }
  /**
   * 设置条纹
   */
  setStriped(striped) {
    this.config.set("striped", striped);
    if (this.bar) {
      this.bar.classList.toggle("ld-progress-linear__bar--striped", striped);
    }
  }
  /**
   * 设置激活动画
   */
  setActive(active) {
    this.config.set("active", active);
    if (this.bar) {
      this.bar.classList.toggle("ld-progress-linear__bar--active", active);
    }
  }
  /**
   * 设置不确定状态
   */
  setIndeterminate(indeterminate) {
    this.config.set("indeterminate", indeterminate);
    if (this.bar) {
      this.bar.classList.toggle("ld-progress-linear__bar--indeterminate", indeterminate);
    }
  }
}

exports.LinearProgress = LinearProgress;
//# sourceMappingURL=LinearProgress.cjs.map
