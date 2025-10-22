/**
 * 进度快照与回放系统
 */

import { BaseProgressOptions } from '../types';

export interface SnapshotData {
  /** 快照 ID */
  id: string;
  /** 快照时间戳 */
  timestamp: number;
  /** 进度值 */
  value: number;
  /** 配置选项 */
  options: Partial<BaseProgressOptions>;
  /** 自定义元数据 */
  metadata?: Record<string, any>;
}

export interface PlaybackOptions {
  /** 播放速度（1 = 正常速度） */
  speed?: number;
  /** 是否循环播放 */
  loop?: boolean;
  /** 播放完成回调 */
  onComplete?: () => void;
  /** 每帧回调 */
  onFrame?: (snapshot: SnapshotData, index: number) => void;
}

/**
 * 进度快照管理器
 */
export class ProgressSnapshotManager {
  private snapshots: SnapshotData[] = [];
  private maxSnapshots: number;
  private isPlaying: boolean = false;
  private playbackTimer?: any;

  constructor(maxSnapshots: number = 100) {
    this.maxSnapshots = maxSnapshots;
  }

  /**
   * 创建快照
   */
  createSnapshot(
    value: number,
    options: Partial<BaseProgressOptions>,
    metadata?: Record<string, any>
  ): SnapshotData {
    const snapshot: SnapshotData = {
      id: this.generateId(),
      timestamp: Date.now(),
      value,
      options: { ...options },
      metadata: metadata ? { ...metadata } : undefined,
    };

    this.snapshots.push(snapshot);

    // 限制快照数量
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * 获取指定快照
   */
  getSnapshot(id: string): SnapshotData | undefined {
    return this.snapshots.find(s => s.id === id);
  }

  /**
   * 获取所有快照
   */
  getAllSnapshots(): SnapshotData[] {
    return [...this.snapshots];
  }

  /**
   * 删除快照
   */
  deleteSnapshot(id: string): boolean {
    const index = this.snapshots.findIndex(s => s.id === id);
    if (index >= 0) {
      this.snapshots.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 清空所有快照
   */
  clearSnapshots(): void {
    this.snapshots = [];
  }

  /**
   * 回放快照序列
   */
  playback(
    onApplySnapshot: (snapshot: SnapshotData) => void,
    options: PlaybackOptions = {}
  ): void {
    if (this.isPlaying) {
      this.stopPlayback();
    }

    if (this.snapshots.length === 0) {
      console.warn('No snapshots to playback');
      return;
    }

    const {
      speed = 1,
      loop = false,
      onComplete,
      onFrame,
    } = options;

    this.isPlaying = true;
    let currentIndex = 0;

    const playNext = () => {
      if (!this.isPlaying) return;

      const snapshot = this.snapshots[currentIndex];
      if (!snapshot) return;

      // 应用快照
      onApplySnapshot(snapshot);

      // 触发帧回调
      if (onFrame) {
        onFrame(snapshot, currentIndex);
      }

      currentIndex++;

      // 检查是否完成
      if (currentIndex >= this.snapshots.length) {
        if (loop) {
          currentIndex = 0;
        } else {
          this.stopPlayback();
          if (onComplete) {
            onComplete();
          }
          return;
        }
      }

      // 计算下一帧的延迟
      let delay = 100; // 默认延迟
      if (currentIndex < this.snapshots.length) {
        const nextSnapshot = this.snapshots[currentIndex];
        const timeDiff = nextSnapshot.timestamp - snapshot.timestamp;
        delay = Math.max(10, timeDiff / speed);
      }

      this.playbackTimer = setTimeout(playNext, delay);
    };

    playNext();
  }

  /**
   * 停止回放
   */
  stopPlayback(): void {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = undefined;
    }
  }

  /**
   * 检查是否正在播放
   */
  isPlaybackActive(): boolean {
    return this.isPlaying;
  }

  /**
   * 导出快照到 JSON
   */
  exportToJSON(): string {
    return JSON.stringify(this.snapshots, null, 2);
  }

  /**
   * 从 JSON 导入快照
   */
  importFromJSON(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        this.snapshots = data;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import snapshots:', error);
      return false;
    }
  }

  /**
   * 保存到 localStorage
   */
  saveToLocalStorage(key: string = 'progress-snapshots'): boolean {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, this.exportToJSON());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * 从 localStorage 加载
   */
  loadFromLocalStorage(key: string = 'progress-snapshots'): boolean {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(key);
        if (data) {
          return this.importFromJSON(data);
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return false;
    }
  }

  /**
   * 获取快照数量
   */
  getSnapshotCount(): number {
    return this.snapshots.length;
  }

  /**
   * 获取快照时间范围
   */
  getTimeRange(): { start: number; end: number } | null {
    if (this.snapshots.length === 0) return null;

    const timestamps = this.snapshots.map(s => s.timestamp);
    return {
      start: Math.min(...timestamps),
      end: Math.max(...timestamps),
    };
  }

  /**
   * 获取快照统计信息
   */
  getStatistics(): {
    count: number;
    timeRange: { start: number; end: number } | null;
    avgInterval: number;
    minValue: number;
    maxValue: number;
  } {
    const count = this.snapshots.length;
    const timeRange = this.getTimeRange();

    if (count === 0) {
      return {
        count: 0,
        timeRange: null,
        avgInterval: 0,
        minValue: 0,
        maxValue: 0,
      };
    }

    const values = this.snapshots.map(s => s.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    let avgInterval = 0;
    if (count > 1 && timeRange) {
      avgInterval = (timeRange.end - timeRange.start) / (count - 1);
    }

    return {
      count,
      timeRange,
      avgInterval,
      minValue,
      maxValue,
    };
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * 进度比较器 - 并排对比多个进度条
 */
export class ProgressComparator {
  private progressData: Map<string, number[]> = new Map();

  /**
   * 添加进度数据
   */
  addData(name: string, value: number): void {
    if (!this.progressData.has(name)) {
      this.progressData.set(name, []);
    }
    this.progressData.get(name)!.push(value);
  }

  /**
   * 获取进度数据
   */
  getData(name: string): number[] {
    return this.progressData.get(name) || [];
  }

  /**
   * 获取所有进度名称
   */
  getNames(): string[] {
    return Array.from(this.progressData.keys());
  }

  /**
   * 比较当前值
   */
  compareCurrent(): Map<string, number> {
    const result = new Map<string, number>();
    this.progressData.forEach((values, name) => {
      if (values.length > 0) {
        result.set(name, values[values.length - 1]);
      }
    });
    return result;
  }

  /**
   * 比较平均值
   */
  compareAverage(): Map<string, number> {
    const result = new Map<string, number>();
    this.progressData.forEach((values, name) => {
      if (values.length > 0) {
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        result.set(name, avg);
      }
    });
    return result;
  }

  /**
   * 比较最大值
   */
  compareMax(): Map<string, number> {
    const result = new Map<string, number>();
    this.progressData.forEach((values, name) => {
      if (values.length > 0) {
        result.set(name, Math.max(...values));
      }
    });
    return result;
  }

  /**
   * 比较最小值
   */
  compareMin(): Map<string, number> {
    const result = new Map<string, number>();
    this.progressData.forEach((values, name) => {
      if (values.length > 0) {
        result.set(name, Math.min(...values));
      }
    });
    return result;
  }

  /**
   * 获取领先者
   */
  getLeader(): string | null {
    let leader: string | null = null;
    let maxValue = -Infinity;

    this.progressData.forEach((values, name) => {
      if (values.length > 0) {
        const currentValue = values[values.length - 1];
        if (currentValue > maxValue) {
          maxValue = currentValue;
          leader = name;
        }
      }
    });

    return leader;
  }

  /**
   * 清空数据
   */
  clear(): void {
    this.progressData.clear();
  }

  /**
   * 清空特定进度的数据
   */
  clearData(name: string): void {
    this.progressData.delete(name);
  }
}




