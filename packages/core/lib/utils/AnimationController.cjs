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

var index = require('../types/index.cjs');
var RAFController = require('./RAFController.cjs');
var helpers = require('./helpers.cjs');

class AnimationController {
  constructor() {
    this.startTime = 0;
    this.startValue = 0;
    this.endValue = 0;
    this.duration = 0;
    this.easing = index.EasingFunctions.easeOutQuad;
    this.animation = null;
    this.isRunning = false;
    this.isPaused = false;
    this.pausedTime = 0;
    this.pausedDuration = 0;
    /**
     * 动画循环
     */
    this.animate = (timestamp) => {
      if (!this.isRunning || this.isPaused)
        return;
      const elapsed = timestamp - this.startTime - this.pausedDuration;
      const progress = Math.min(elapsed / this.duration, 1);
      const easedProgress = this.easing(progress);
      const currentValue = this.startValue + (this.endValue - this.startValue) * easedProgress;
      if (this.onUpdate) {
        this.onUpdate(currentValue);
      }
      if (progress >= 1) {
        this.isRunning = false;
        if (this.animation) {
          this.animation.destroy();
          this.animation = null;
        }
        if (this.onComplete) {
          this.onComplete();
        }
      }
    };
    this.id = helpers.generateId("animation");
  }
  /**
   * 启动动画
   */
  start(options) {
    this.stop();
    this.startValue = options.from;
    this.endValue = options.to;
    this.duration = options.duration;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;
    if (typeof options.easing === "string") {
      this.easing = index.EasingFunctions[options.easing] || index.EasingFunctions.linear;
    } else if (typeof options.easing === "function") {
      this.easing = options.easing;
    }
    this.startTime = performance.now();
    this.isRunning = true;
    this.isPaused = false;
    this.pausedDuration = 0;
    this.animation = new RAFController.AnimationWrapper(
      this.id,
      (timestamp) => this.animate(timestamp),
      0
      // 默认优先级
    );
  }
  /**
   * 暂停动画
   */
  pause() {
    if (this.isRunning && !this.isPaused) {
      this.isPaused = true;
      this.pausedTime = performance.now();
      if (this.animation) {
        this.animation.pause();
      }
    }
  }
  /**
   * 恢复动画
   */
  resume() {
    if (this.isRunning && this.isPaused) {
      const pauseDuration = performance.now() - this.pausedTime;
      this.pausedDuration += pauseDuration;
      this.isPaused = false;
      if (this.animation) {
        this.animation.resume();
      }
    }
  }
  /**
   * 停止动画
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
  }
  /**
   * 重置动画
   */
  reset() {
    this.stop();
    this.startTime = 0;
    this.pausedTime = 0;
    this.pausedDuration = 0;
  }
  /**
   * 检查是否正在运行
   */
  isAnimating() {
    return this.isRunning && !this.isPaused;
  }
  /**
   * 获取动画 ID
   */
  getId() {
    return this.id;
  }
}

exports.AnimationController = AnimationController;
//# sourceMappingURL=AnimationController.cjs.map
