/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { LinearProgress } from './LinearProgress.js';
import '../utils/RAFController.js';
import { createElement, toPx } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import '../utils/MemoryManager.js';

class SegmentProgress extends LinearProgress {
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      segments: [],
      gap: 4
    };
  }
  render() {
    this.container.innerHTML = "";
    this.wrapper = createElement("div", "ld-progress-segment", this.container);
    const direction = this.config.get("direction") ?? "horizontal";
    this.wrapper.classList.add(`ld-progress-segment--${direction}`);
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    const strokeWidth = this.config.get("strokeWidth") ?? 6;
    if (direction === "horizontal") {
      this.wrapper.style.height = toPx(strokeWidth);
      const width = this.config.get("width");
      if (width) {
        this.wrapper.style.width = toPx(width);
      }
    } else {
      this.wrapper.style.width = toPx(strokeWidth);
      const height = this.config.get("height");
      if (height) {
        this.wrapper.style.height = toPx(height);
      }
    }
    this.track = createElement("div", "ld-progress-segment__track", this.wrapper);
    const trackColor = this.config.get("trackColor");
    if (trackColor) {
      this.track.style.backgroundColor = trackColor;
    }
    this.renderSegments();
    if (this.config.get("showText")) {
      this.textElement = createElement("div", "ld-progress-segment__text", this.container);
    }
    this.updateProgress(this.currentValue);
  }
  renderSegments() {
    const segments = this.config.get("segments") ?? [];
    const direction = this.config.get("direction") ?? "horizontal";
    const gap = this.config.get("gap") ?? 4;
    const max = this.config.get("max") ?? 100;
    this.segmentBars = [];
    if (segments.length === 0) {
      this.bar = createElement("div", "ld-progress-segment__bar", this.track);
      const color = this.config.get("color");
      if (color) {
        const colorValue = Array.isArray(color) ? color[0] : color;
        this.bar.style.backgroundColor = colorValue;
      }
      return;
    }
    let accumulatedValue = 0;
    segments.forEach((segment, index) => {
      const segmentWrapper = createElement("div", "ld-progress-segment__wrapper", this.track);
      const segmentBar = createElement("div", "ld-progress-segment__bar", segmentWrapper);
      if (segment.color) {
        segmentBar.style.backgroundColor = segment.color;
      }
      const segmentPercentage = segment.value / max * 100;
      if (direction === "horizontal") {
        segmentWrapper.style.position = "absolute";
        segmentWrapper.style.left = `${accumulatedValue}%`;
        segmentWrapper.style.width = `${segmentPercentage}%`;
        if (index > 0) {
          segmentWrapper.style.paddingLeft = `${gap}px`;
        }
      } else {
        segmentWrapper.style.position = "absolute";
        segmentWrapper.style.bottom = `${accumulatedValue}%`;
        segmentWrapper.style.height = `${segmentPercentage}%`;
        if (index > 0) {
          segmentWrapper.style.paddingBottom = `${gap}px`;
        }
      }
      accumulatedValue += segmentPercentage;
      this.segmentBars.push(segmentBar);
      if (segment.label) {
        const label = createElement("span", "ld-progress-segment__label", segmentBar);
        label.textContent = segment.label;
      }
    });
    this.track.style.position = "relative";
  }
  updateProgress(value) {
    const segments = this.config.get("segments") ?? [];
    const direction = this.config.get("direction") ?? "horizontal";
    if (segments.length === 0) {
      super.updateProgress(value);
      return;
    }
    this.config.get("max") ?? 100;
    let remainingValue = value;
    this.segmentBars.forEach((segmentBar, index) => {
      const segment = segments[index];
      const segmentValue = Math.min(segment.value, remainingValue);
      const segmentPercentage = segmentValue / segment.value * 100;
      if (direction === "horizontal") {
        segmentBar.style.width = `${segmentPercentage}%`;
      } else {
        segmentBar.style.height = `${segmentPercentage}%`;
      }
      remainingValue -= segmentValue;
      if (segmentValue >= segment.value) {
        segmentBar.classList.add("ld-progress-segment__bar--completed");
      } else {
        segmentBar.classList.remove("ld-progress-segment__bar--completed");
      }
    });
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 设置分段
   */
  setSegments(segments) {
    this.config.set("segments", segments);
    this.render();
  }
  /**
   * 添加分段
   */
  addSegment(segment) {
    const segments = this.config.get("segments") ?? [];
    segments.push(segment);
    this.config.set("segments", segments);
    this.render();
  }
  /**
   * 设置间隙
   */
  setGap(gap) {
    this.config.set("gap", gap);
    this.render();
  }
}

export { SegmentProgress };
//# sourceMappingURL=SegmentProgress.js.map
