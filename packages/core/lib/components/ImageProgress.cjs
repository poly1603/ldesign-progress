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

class ImageProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.imageLoaded = false;
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      imageWidth: 200,
      imageHeight: 200,
      fillDirection: "horizontal",
      maskMode: false,
      objectFit: "cover"
    };
  }
  render() {
    this.container.innerHTML = "";
    this.wrapper = helpers.createElement("div", "ld-progress-image", this.container);
    this.wrapper.style.position = "relative";
    this.wrapper.style.display = "inline-block";
    const width = this.config.get("imageWidth") ?? 200;
    const height = this.config.get("imageHeight") ?? 200;
    this.wrapper.style.width = helpers.toPx(width);
    this.wrapper.style.height = helpers.toPx(height);
    this.wrapper.style.overflow = "hidden";
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.imageContainer = helpers.createElement("div", "ld-progress-image__container", this.wrapper);
    this.imageContainer.style.position = "relative";
    this.imageContainer.style.width = "100%";
    this.imageContainer.style.height = "100%";
    this.image = document.createElement("img");
    this.image.className = "ld-progress-image__img";
    this.image.style.width = "100%";
    this.image.style.height = "100%";
    this.image.style.objectFit = this.config.get("objectFit") || "cover";
    const imageSrc = this.config.get("imageSrc");
    if (!imageSrc) {
      console.error("ImageProgress: imageSrc is required");
      return;
    }
    this.image.src = imageSrc;
    this.image.onload = () => {
      this.imageLoaded = true;
      this.updateProgress(this.currentValue);
    };
    this.image.onerror = () => {
      console.error("ImageProgress: Failed to load image:", imageSrc);
    };
    this.imageContainer.appendChild(this.image);
    if (this.config.get("maskMode")) {
      this.maskElement = helpers.createElement("div", "ld-progress-image__mask", this.wrapper);
      this.maskElement.style.position = "absolute";
      this.maskElement.style.top = "0";
      this.maskElement.style.left = "0";
      this.maskElement.style.width = "100%";
      this.maskElement.style.height = "100%";
      this.maskElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      this.maskElement.style.transition = "all 0.3s";
    }
    if (this.config.get("showText")) {
      this.textElement = helpers.createElement("div", "ld-progress-image__text", this.wrapper);
      this.textElement.style.position = "absolute";
      this.textElement.style.top = "50%";
      this.textElement.style.left = "50%";
      this.textElement.style.transform = "translate(-50%, -50%)";
      this.textElement.style.color = "white";
      this.textElement.style.fontSize = "24px";
      this.textElement.style.fontWeight = "bold";
      this.textElement.style.textShadow = "0 2px 4px rgba(0,0,0,0.5)";
      this.textElement.style.zIndex = "10";
    }
    this.updateProgress(this.currentValue);
  }
  updateProgress(value) {
    if (!this.imageLoaded)
      return;
    const percentage = this.config.getPercentage(value);
    const direction = this.config.get("fillDirection") ?? "horizontal";
    if (this.config.get("maskMode") && this.maskElement) {
      const opacity = 1 - percentage / 100;
      this.maskElement.style.opacity = `${opacity}`;
    } else {
      const clipPath = this.getClipPath(percentage, direction);
      this.imageContainer.style.clipPath = clipPath;
    }
    if (this.textElement) {
      this.textElement.textContent = this.formatText(value);
    }
  }
  /**
   * 根据进度和方向生成 clip-path
   */
  getClipPath(percentage, direction) {
    switch (direction) {
      case "horizontal":
        return `inset(0 ${100 - percentage}% 0 0)`;
      case "vertical":
        return `inset(${100 - percentage}% 0 0 0)`;
      case "radial":
        const radius = percentage / 2;
        return `circle(${radius}% at 50% 50%)`;
      default:
        return `inset(0 ${100 - percentage}% 0 0)`;
    }
  }
  /**
   * 设置图片源
   */
  setImageSrc(src) {
    this.config.set("imageSrc", src);
    this.imageLoaded = false;
    if (this.image) {
      this.image.src = src;
    }
  }
  /**
   * 设置填充方向
   */
  setFillDirection(direction) {
    this.config.set("fillDirection", direction);
    this.updateProgress(this.currentValue);
  }
}

exports.ImageProgress = ImageProgress;
//# sourceMappingURL=ImageProgress.cjs.map
