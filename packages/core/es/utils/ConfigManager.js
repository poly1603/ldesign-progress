/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class ConfigManager {
  constructor(defaultConfig) {
    this.defaultConfig = defaultConfig;
    this.config = { ...defaultConfig };
  }
  /**
   * 获取配置
   */
  get(key) {
    return this.config[key];
  }
  /**
   * 设置配置
   */
  set(key, value) {
    this.config[key] = value;
  }
  /**
   * 批量设置配置
   */
  setMultiple(options) {
    Object.assign(this.config, options);
  }
  /**
   * 获取所有配置
   */
  getAll() {
    return { ...this.config };
  }
  /**
   * 重置为默认配置
   */
  reset() {
    this.config = { ...this.defaultConfig };
  }
  /**
   * 合并配置
   */
  merge(options) {
    return { ...this.config, ...options };
  }
  /**
   * 验证配置值
   */
  validate() {
    const value = this.config.value ?? 0;
    const min = this.config.min ?? 0;
    const max = this.config.max ?? 100;
    return value >= min && value <= max && min < max;
  }
  /**
   * 标准化值（确保在min-max范围内）
   */
  normalizeValue(value) {
    const min = this.config.min ?? 0;
    const max = this.config.max ?? 100;
    return Math.max(min, Math.min(max, value));
  }
  /**
   * 获取百分比值
   */
  getPercentage(value) {
    const val = value ?? this.config.value ?? 0;
    const min = this.config.min ?? 0;
    const max = this.config.max ?? 100;
    return (val - min) / (max - min) * 100;
  }
}

export { ConfigManager };
//# sourceMappingURL=ConfigManager.js.map
