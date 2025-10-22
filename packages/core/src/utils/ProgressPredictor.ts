/**
 * 进度预测器 - 基于历史数据预测完成时间
 */

export interface PredictionData {
  timestamp: number;
  value: number;
}

export interface PredictionResult {
  /** 预计完成时间（毫秒时间戳） */
  estimatedCompletionTime: number;
  /** 预计剩余时间（毫秒） */
  estimatedRemainingTime: number;
  /** 当前速度（单位/毫秒） */
  currentSpeed: number;
  /** 平均速度（单位/毫秒） */
  averageSpeed: number;
  /** 预测置信度（0-1） */
  confidence: number;
}

/**
 * 进度预测器类
 */
export class ProgressPredictor {
  private history: PredictionData[] = [];
  private maxHistorySize: number;
  private minDataPoints: number;

  constructor(maxHistorySize: number = 50, minDataPoints: number = 3) {
    this.maxHistorySize = maxHistorySize;
    this.minDataPoints = minDataPoints;
  }

  /**
   * 记录进度数据点
   */
  record(value: number, timestamp: number = Date.now()): void {
    this.history.push({ timestamp, value });

    // 限制历史数据大小
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * 预测完成时间
   */
  predict(targetValue: number = 100): PredictionResult | null {
    if (this.history.length < this.minDataPoints) {
      return null; // 数据点不足
    }

    const currentData = this.history[this.history.length - 1];

    // 如果已经达到或超过目标值
    if (currentData.value >= targetValue) {
      return {
        estimatedCompletionTime: currentData.timestamp,
        estimatedRemainingTime: 0,
        currentSpeed: 0,
        averageSpeed: 0,
        confidence: 1,
      };
    }

    // 计算当前速度（最近两个数据点）
    const currentSpeed = this.calculateCurrentSpeed();

    // 计算平均速度
    const averageSpeed = this.calculateAverageSpeed();

    // 使用加权平均（更重视近期速度）
    const weightedSpeed = currentSpeed * 0.7 + averageSpeed * 0.3;

    // 预测剩余时间
    const remainingValue = targetValue - currentData.value;
    const estimatedRemainingTime = weightedSpeed > 0
      ? remainingValue / weightedSpeed
      : Infinity;

    // 预测完成时间
    const estimatedCompletionTime = currentData.timestamp + estimatedRemainingTime;

    // 计算置信度（基于速度稳定性）
    const confidence = this.calculateConfidence();

    return {
      estimatedCompletionTime,
      estimatedRemainingTime,
      currentSpeed,
      averageSpeed: averageSpeed,
      confidence,
    };
  }

  /**
   * 计算当前速度（最近几个数据点）
   */
  private calculateCurrentSpeed(): number {
    const recentPoints = Math.min(5, this.history.length);
    const recent = this.history.slice(-recentPoints);

    if (recent.length < 2) return 0;

    const first = recent[0];
    const last = recent[recent.length - 1];
    const timeDiff = last.timestamp - first.timestamp;
    const valueDiff = last.value - first.value;

    return timeDiff > 0 ? valueDiff / timeDiff : 0;
  }

  /**
   * 计算平均速度（所有数据点）
   */
  private calculateAverageSpeed(): number {
    if (this.history.length < 2) return 0;

    const first = this.history[0];
    const last = this.history[this.history.length - 1];
    const timeDiff = last.timestamp - first.timestamp;
    const valueDiff = last.value - first.value;

    return timeDiff > 0 ? valueDiff / timeDiff : 0;
  }

  /**
   * 计算预测置信度（基于速度稳定性）
   */
  private calculateConfidence(): number {
    if (this.history.length < this.minDataPoints) return 0;

    // 计算速度变化率
    const speeds: number[] = [];
    for (let i = 1; i < this.history.length; i++) {
      const timeDiff = this.history[i].timestamp - this.history[i - 1].timestamp;
      const valueDiff = this.history[i].value - this.history[i - 1].value;
      if (timeDiff > 0) {
        speeds.push(valueDiff / timeDiff);
      }
    }

    if (speeds.length < 2) return 0.5;

    // 计算速度的标准差
    const mean = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / speeds.length;
    const stdDev = Math.sqrt(variance);

    // 标准差越小，置信度越高
    const coefficient = mean !== 0 ? stdDev / Math.abs(mean) : 1;
    const confidence = Math.max(0, Math.min(1, 1 - coefficient));

    return confidence;
  }

  /**
   * 获取趋势（递增/递减/稳定）
   */
  getTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.history.length < 2) return 'stable';

    const speed = this.calculateAverageSpeed();

    if (speed > 0.001) return 'increasing';
    if (speed < -0.001) return 'decreasing';
    return 'stable';
  }

  /**
   * 格式化剩余时间
   */
  static formatRemainingTime(milliseconds: number): string {
    if (!isFinite(milliseconds)) return '∞';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天 ${hours % 24}小时`;
    if (hours > 0) return `${hours}小时 ${minutes % 60}分钟`;
    if (minutes > 0) return `${minutes}分钟 ${seconds % 60}秒`;
    return `${seconds}秒`;
  }

  /**
   * 格式化完成时间
   */
  static formatCompletionTime(timestamp: number): string {
    if (!isFinite(timestamp)) return '未知';

    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  }

  /**
   * 清空历史数据
   */
  clear(): void {
    this.history = [];
  }

  /**
   * 获取历史数据
   */
  getHistory(): PredictionData[] {
    return [...this.history];
  }

  /**
   * 获取数据点数量
   */
  getDataPointCount(): number {
    return this.history.length;
  }
}




