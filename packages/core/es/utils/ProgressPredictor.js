/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class ProgressPredictor {
  constructor(maxHistorySize = 50, minDataPoints = 3) {
    this.history = [];
    this.maxHistorySize = maxHistorySize;
    this.minDataPoints = minDataPoints;
  }
  /**
   * 记录进度数据点
   */
  record(value, timestamp = Date.now()) {
    this.history.push({ timestamp, value });
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }
  /**
   * 预测完成时间
   */
  predict(targetValue = 100) {
    if (this.history.length < this.minDataPoints) {
      return null;
    }
    const currentData = this.history[this.history.length - 1];
    if (currentData.value >= targetValue) {
      return {
        estimatedCompletionTime: currentData.timestamp,
        estimatedRemainingTime: 0,
        currentSpeed: 0,
        averageSpeed: 0,
        confidence: 1
      };
    }
    const currentSpeed = this.calculateCurrentSpeed();
    const averageSpeed = this.calculateAverageSpeed();
    const weightedSpeed = currentSpeed * 0.7 + averageSpeed * 0.3;
    const remainingValue = targetValue - currentData.value;
    const estimatedRemainingTime = weightedSpeed > 0 ? remainingValue / weightedSpeed : Infinity;
    const estimatedCompletionTime = currentData.timestamp + estimatedRemainingTime;
    const confidence = this.calculateConfidence();
    return {
      estimatedCompletionTime,
      estimatedRemainingTime,
      currentSpeed,
      averageSpeed,
      confidence
    };
  }
  /**
   * 计算当前速度（最近几个数据点）
   */
  calculateCurrentSpeed() {
    const recentPoints = Math.min(5, this.history.length);
    const recent = this.history.slice(-recentPoints);
    if (recent.length < 2)
      return 0;
    const first = recent[0];
    const last = recent[recent.length - 1];
    const timeDiff = last.timestamp - first.timestamp;
    const valueDiff = last.value - first.value;
    return timeDiff > 0 ? valueDiff / timeDiff : 0;
  }
  /**
   * 计算平均速度（所有数据点）
   */
  calculateAverageSpeed() {
    if (this.history.length < 2)
      return 0;
    const first = this.history[0];
    const last = this.history[this.history.length - 1];
    const timeDiff = last.timestamp - first.timestamp;
    const valueDiff = last.value - first.value;
    return timeDiff > 0 ? valueDiff / timeDiff : 0;
  }
  /**
   * 计算预测置信度（基于速度稳定性）
   */
  calculateConfidence() {
    if (this.history.length < this.minDataPoints)
      return 0;
    const speeds = [];
    for (let i = 1; i < this.history.length; i++) {
      const timeDiff = this.history[i].timestamp - this.history[i - 1].timestamp;
      const valueDiff = this.history[i].value - this.history[i - 1].value;
      if (timeDiff > 0) {
        speeds.push(valueDiff / timeDiff);
      }
    }
    if (speeds.length < 2)
      return 0.5;
    const mean = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / speeds.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = mean !== 0 ? stdDev / Math.abs(mean) : 1;
    const confidence = Math.max(0, Math.min(1, 1 - coefficient));
    return confidence;
  }
  /**
   * 获取趋势（递增/递减/稳定）
   */
  getTrend() {
    if (this.history.length < 2)
      return "stable";
    const speed = this.calculateAverageSpeed();
    if (speed > 1e-3)
      return "increasing";
    if (speed < -1e-3)
      return "decreasing";
    return "stable";
  }
  /**
   * 格式化剩余时间
   */
  static formatRemainingTime(milliseconds) {
    if (!isFinite(milliseconds))
      return "\u221E";
    const seconds = Math.floor(milliseconds / 1e3);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
      return `${days}\u5929 ${hours % 24}\u5C0F\u65F6`;
    if (hours > 0)
      return `${hours}\u5C0F\u65F6 ${minutes % 60}\u5206\u949F`;
    if (minutes > 0)
      return `${minutes}\u5206\u949F ${seconds % 60}\u79D2`;
    return `${seconds}\u79D2`;
  }
  /**
   * 格式化完成时间
   */
  static formatCompletionTime(timestamp) {
    if (!isFinite(timestamp))
      return "\u672A\u77E5";
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN");
  }
  /**
   * 清空历史数据
   */
  clear() {
    this.history = [];
  }
  /**
   * 获取历史数据
   */
  getHistory() {
    return [...this.history];
  }
  /**
   * 获取数据点数量
   */
  getDataPointCount() {
    return this.history.length;
  }
}

export { ProgressPredictor };
//# sourceMappingURL=ProgressPredictor.js.map
