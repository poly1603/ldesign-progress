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

var EventEmitter = require('../utils/EventEmitter.cjs');
var ConfigManager = require('../utils/ConfigManager.cjs');
var AnimationController = require('../utils/AnimationController.cjs');
var ThemeManager = require('../utils/ThemeManager.cjs');
var helpers = require('../utils/helpers.cjs');
var MemoryManager = require('../utils/MemoryManager.cjs');
require('../utils/RAFController.cjs');
var PluginSystem = require('../utils/PluginSystem.cjs');

class ProgressBase extends EventEmitter.EventEmitter {
  constructor(container, options) {
    super();
    this.destroyed = false;
    this.pluginManager = new PluginSystem.PluginManager();
    this.valueMiddleware = new PluginSystem.MiddlewareManager();
    let processedOptions = this.pluginManager.callHook("beforeInit", options);
    if (processedOptions) {
      options = processedOptions;
    }
    if (typeof container === "string") {
      const element = document.querySelector(container);
      if (!element) {
        throw new Error(`Container element "${container}" not found`);
      }
      this.container = element;
    } else {
      this.container = container;
    }
    this.id = helpers.generateId();
    this.container.setAttribute("data-progress-id", this.id);
    this.config = new ConfigManager.ConfigManager(this.getDefaultOptions());
    if (options) {
      this.config.setMultiple(options);
    }
    this.animator = new AnimationController.AnimationController();
    this.currentValue = this.config.get("value") ?? 0;
    const theme = this.config.get("theme");
    if (theme) {
      ThemeManager.themeManager.applyTheme(this.container, theme);
    }
    this.setupEventListeners();
    MemoryManager.memoryMonitor.register(this);
    this.pluginManager.callHook("afterInit", this);
    this.render();
  }
  /**
   * 获取默认配置
   */
  getDefaultOptions() {
    return {
      value: 0,
      min: 0,
      max: 100,
      animated: true,
      duration: 300,
      easing: "easeOutQuad",
      showText: true,
      format: (value) => `${Math.round(value)}%`,
      theme: "default",
      className: ""
    };
  }
  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    const onChange = this.config.get("onChange");
    const onComplete = this.config.get("onComplete");
    const onStart = this.config.get("onStart");
    if (onChange) {
      this.on("change", onChange);
    }
    if (onComplete) {
      this.on("complete", onComplete);
    }
    if (onStart) {
      this.on("start", onStart);
    }
  }
  /**
   * 设置进度值（支持中间件和插件钩子）
   */
  setValue(value, animated = this.config.get("animated") ?? true) {
    if (this.destroyed)
      return;
    let normalizedValue = this.config.normalizeValue(value);
    const oldValue = this.currentValue;
    const hookResult = this.pluginManager.callHook("beforeValueChange", oldValue, normalizedValue);
    if (typeof hookResult === "number") {
      normalizedValue = hookResult;
    }
    normalizedValue = this.valueMiddleware.execute(normalizedValue);
    normalizedValue = this.config.normalizeValue(normalizedValue);
    if (oldValue === normalizedValue)
      return;
    if (oldValue === 0 || oldValue === this.config.get("min")) {
      this.emit("start");
    }
    if (animated && this.config.get("duration") > 0) {
      this.animateValue(oldValue, normalizedValue);
    } else {
      this.currentValue = normalizedValue;
      this.updateProgress(normalizedValue);
      this.emit("change", normalizedValue);
      this.pluginManager.callHook("afterValueChange", normalizedValue);
      if (normalizedValue >= (this.config.get("max") ?? 100)) {
        this.emit("complete");
      }
    }
  }
  /**
   * 动画更新值
   */
  animateValue(from, to) {
    this.animator.start({
      from,
      to,
      duration: this.config.get("duration") ?? 300,
      easing: this.config.get("easing"),
      onUpdate: (value) => {
        this.currentValue = value;
        this.updateProgress(value);
        this.emit("update", value);
      },
      onComplete: () => {
        this.emit("change", to);
        this.pluginManager.callHook("afterValueChange", to);
        if (to >= (this.config.get("max") ?? 100)) {
          this.emit("complete");
        }
      }
    });
  }
  /**
   * 获取当前值
   */
  getValue() {
    return this.currentValue;
  }
  /**
   * 获取百分比
   */
  getPercentage() {
    return this.config.getPercentage(this.currentValue);
  }
  /**
   * 增加值
   */
  increment(delta = 1) {
    this.setValue(this.currentValue + delta);
  }
  /**
   * 减少值
   */
  decrement(delta = 1) {
    this.setValue(this.currentValue - delta);
  }
  /**
   * 重置
   */
  reset() {
    this.setValue(this.config.get("min") ?? 0, false);
    this.animator.reset();
  }
  /**
   * 更新配置
   */
  updateOptions(options) {
    this.config.setMultiple(options);
    if (options.theme) {
      ThemeManager.themeManager.applyTheme(this.container, options.theme);
    }
    this.render();
    if (options.value !== void 0) {
      this.setValue(options.value, false);
    }
  }
  /**
   * 获取配置
   */
  getOptions() {
    return this.config.getAll();
  }
  /**
   * 格式化显示文本
   */
  formatText(value) {
    const formatter = this.config.get("format");
    if (formatter) {
      return formatter(this.config.getPercentage(value));
    }
    return `${Math.round(this.config.getPercentage(value))}%`;
  }
  /**
   * 销毁（完善内存清理）
   */
  destroy() {
    if (this.destroyed)
      return;
    this.pluginManager.callHook("beforeDestroy", this);
    this.animator.stop();
    this.removeAllListeners();
    this.container.innerHTML = "";
    this.container.removeAttribute("data-progress-id");
    this.valueMiddleware.clear();
    this.pluginManager.getInstalledPlugins().forEach((name) => {
      this.pluginManager.uninstall(name);
    });
    MemoryManager.memoryMonitor.unregister(this);
    this.destroyed = true;
    this.emit("destroy");
    this.pluginManager.callHook("afterDestroy");
  }
  /**
   * 检查是否已销毁
   */
  isDestroyed() {
    return this.destroyed;
  }
  /**
   * 使用插件
   */
  usePlugin(pluginName) {
    this.pluginManager.install(pluginName, this, this.getOptions());
    return this;
  }
  /**
   * 添加值更新中间件
   */
  addMiddleware(middleware) {
    this.valueMiddleware.use(middleware);
    return this;
  }
  /**
   * 获取插件管理器
   */
  getPluginManager() {
    return this.pluginManager;
  }
  /**
   * 获取中间件管理器
   */
  getMiddlewareManager() {
    return this.valueMiddleware;
  }
  /**
   * 暂停动画
   */
  pause() {
    this.animator.pause();
  }
  /**
   * 恢复动画
   */
  resume() {
    this.animator.resume();
  }
  /**
   * 检查是否正在动画
   */
  isAnimating() {
    return this.animator.isAnimating();
  }
}

exports.ProgressBase = ProgressBase;
//# sourceMappingURL=ProgressBase.cjs.map
