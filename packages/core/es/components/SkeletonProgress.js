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
import { createElement, toPx } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import '../utils/MemoryManager.js';

class SkeletonProgress extends ProgressBase {
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      width: 300,
      height: 20,
      shimmerSpeed: 1.5,
      baseColor: "#e4e7ed",
      shimmerColor: "#f5f7fa",
      showShimmer: true
    };
  }
  render() {
    this.container.innerHTML = "";
    const width = this.config.get("width") ?? 300;
    const height = this.config.get("height") ?? 20;
    this.wrapper = createElement("div", "ld-progress-skeleton", this.container);
    this.wrapper.style.width = toPx(width);
    this.wrapper.style.height = toPx(height);
    this.wrapper.style.position = "relative";
    this.wrapper.style.overflow = "hidden";
    this.wrapper.style.borderRadius = "4px";
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.track = createElement("div", "ld-progress-skeleton__track", this.wrapper);
    this.track.style.width = "100%";
    this.track.style.height = "100%";
    this.track.style.backgroundColor = this.config.get("baseColor") || "#e4e7ed";
    this.track.style.position = "relative";
    if (this.config.get("showShimmer")) {
      this.shimmer = createElement("div", "ld-progress-skeleton__shimmer", this.track);
      this.shimmer.style.position = "absolute";
      this.shimmer.style.top = "0";
      this.shimmer.style.left = "-100%";
      this.shimmer.style.width = "100%";
      this.shimmer.style.height = "100%";
      const shimmerColor = this.config.get("shimmerColor") || "#f5f7fa";
      this.shimmer.style.background = `linear-gradient(
        90deg,
        transparent,
        ${shimmerColor},
        transparent
      )`;
      const shimmerSpeed = this.config.get("shimmerSpeed") ?? 1.5;
      this.shimmer.style.animation = `skeleton-shimmer ${shimmerSpeed}s infinite`;
    }
    if (this.config.get("showText")) {
      this.textElement = createElement("div", "ld-progress-skeleton__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.right = "10px";
      this.textElement.style.top = "50%";
      this.textElement.style.transform = "translateY(-50%)";
      this.textElement.style.fontSize = "12px";
      this.textElement.style.color = "#606266";
    }
    this.updateProgress(this.currentValue);
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    if (this.track) {
      const alpha = 1 - percentage / 100;
      this.track.style.opacity = String(Math.max(0.3, alpha));
    }
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
      if (percentage >= 100) {
        this.textElement.textContent = "\u52A0\u8F7D\u5B8C\u6210";
        this.wrapper.style.opacity = "0";
        setTimeout(() => {
          if (this.wrapper) {
            this.wrapper.style.display = "none";
          }
        }, 300);
      }
    }
  }
}

export { SkeletonProgress };
//# sourceMappingURL=SkeletonProgress.js.map
