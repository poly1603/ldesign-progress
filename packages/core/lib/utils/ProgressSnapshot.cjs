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

class ProgressSnapshotManager {
  constructor(maxSnapshots = 100) {
    this.snapshots = [];
    this.isPlaying = false;
    this.maxSnapshots = maxSnapshots;
  }
  /**
   * 创建快照
   */
  createSnapshot(value, options, metadata) {
    const snapshot = {
      id: this.generateId(),
      timestamp: Date.now(),
      value,
      options: { ...options },
      metadata: metadata ? { ...metadata } : void 0
    };
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
    return snapshot;
  }
  /**
   * 获取指定快照
   */
  getSnapshot(id) {
    return this.snapshots.find((s) => s.id === id);
  }
  /**
   * 获取所有快照
   */
  getAllSnapshots() {
    return [...this.snapshots];
  }
  /**
   * 删除快照
   */
  deleteSnapshot(id) {
    const index = this.snapshots.findIndex((s) => s.id === id);
    if (index >= 0) {
      this.snapshots.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * 清空所有快照
   */
  clearSnapshots() {
    this.snapshots = [];
  }
  /**
   * 回放快照序列
   */
  playback(onApplySnapshot, options = {}) {
    if (this.isPlaying) {
      this.stopPlayback();
    }
    if (this.snapshots.length === 0) {
      console.warn("No snapshots to playback");
      return;
    }
    const {
      speed = 1,
      loop = false,
      onComplete,
      onFrame
    } = options;
    this.isPlaying = true;
    let currentIndex = 0;
    const playNext = () => {
      if (!this.isPlaying)
        return;
      const snapshot = this.snapshots[currentIndex];
      if (!snapshot)
        return;
      onApplySnapshot(snapshot);
      if (onFrame) {
        onFrame(snapshot, currentIndex);
      }
      currentIndex++;
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
      let delay = 100;
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
  stopPlayback() {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = void 0;
    }
  }
  /**
   * 检查是否正在播放
   */
  isPlaybackActive() {
    return this.isPlaying;
  }
  /**
   * 导出快照到 JSON
   */
  exportToJSON() {
    return JSON.stringify(this.snapshots, null, 2);
  }
  /**
   * 从 JSON 导入快照
   */
  importFromJSON(json) {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        this.snapshots = data;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to import snapshots:", error);
      return false;
    }
  }
  /**
   * 保存到 localStorage
   */
  saveToLocalStorage(key = "progress-snapshots") {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, this.exportToJSON());
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      return false;
    }
  }
  /**
   * 从 localStorage 加载
   */
  loadFromLocalStorage(key = "progress-snapshots") {
    try {
      if (typeof localStorage !== "undefined") {
        const data = localStorage.getItem(key);
        if (data) {
          return this.importFromJSON(data);
        }
      }
      return false;
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return false;
    }
  }
  /**
   * 获取快照数量
   */
  getSnapshotCount() {
    return this.snapshots.length;
  }
  /**
   * 获取快照时间范围
   */
  getTimeRange() {
    if (this.snapshots.length === 0)
      return null;
    const timestamps = this.snapshots.map((s) => s.timestamp);
    return {
      start: Math.min(...timestamps),
      end: Math.max(...timestamps)
    };
  }
  /**
   * 获取快照统计信息
   */
  getStatistics() {
    const count = this.snapshots.length;
    const timeRange = this.getTimeRange();
    if (count === 0) {
      return {
        count: 0,
        timeRange: null,
        avgInterval: 0,
        minValue: 0,
        maxValue: 0
      };
    }
    const values = this.snapshots.map((s) => s.value);
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
      maxValue
    };
  }
  /**
   * 生成唯一 ID
   */
  generateId() {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
class ProgressComparator {
  constructor() {
    this.progressData = /* @__PURE__ */ new Map();
  }
  /**
   * 添加进度数据
   */
  addData(name, value) {
    if (!this.progressData.has(name)) {
      this.progressData.set(name, []);
    }
    this.progressData.get(name).push(value);
  }
  /**
   * 获取进度数据
   */
  getData(name) {
    return this.progressData.get(name) || [];
  }
  /**
   * 获取所有进度名称
   */
  getNames() {
    return Array.from(this.progressData.keys());
  }
  /**
   * 比较当前值
   */
  compareCurrent() {
    const result = /* @__PURE__ */ new Map();
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
  compareAverage() {
    const result = /* @__PURE__ */ new Map();
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
  compareMax() {
    const result = /* @__PURE__ */ new Map();
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
  compareMin() {
    const result = /* @__PURE__ */ new Map();
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
  getLeader() {
    let leader = null;
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
  clear() {
    this.progressData.clear();
  }
  /**
   * 清空特定进度的数据
   */
  clearData(name) {
    this.progressData.delete(name);
  }
}

exports.ProgressComparator = ProgressComparator;
exports.ProgressSnapshotManager = ProgressSnapshotManager;
//# sourceMappingURL=ProgressSnapshot.cjs.map
