/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class ProgressSynchronizer {
  constructor(options = {}) {
    this.instances = /* @__PURE__ */ new Map();
    this.isSyncing = false;
    this.options = {
      mode: "master-slave",
      delay: 0,
      animated: true,
      ...options
    };
  }
  /**
   * 添加进度条实例
   */
  add(id, instance) {
    this.instances.set(id, instance);
  }
  /**
   * 移除进度条实例
   */
  remove(id) {
    this.instances.delete(id);
  }
  /**
   * 同步所有实例到指定值
   */
  syncTo(value, excludeId) {
    if (this.isSyncing)
      return;
    this.isSyncing = true;
    const sync = () => {
      this.instances.forEach((instance, id) => {
        if (id === excludeId)
          return;
        const transformedValue = this.options.transform ? this.options.transform(value, id) : value;
        instance.setValue(transformedValue, this.options.animated);
      });
      this.isSyncing = false;
    };
    if (this.options.delay && this.options.delay > 0) {
      if (this.syncTimeout) {
        clearTimeout(this.syncTimeout);
      }
      this.syncTimeout = setTimeout(sync, this.options.delay);
    } else {
      sync();
    }
  }
  /**
   * 根据模式同步
   */
  sync(sourceId) {
    if (this.instances.size === 0)
      return;
    const mode = this.options.mode || "master-slave";
    switch (mode) {
      case "master-slave":
        this.syncMasterSlave(sourceId);
        break;
      case "average":
        this.syncAverage();
        break;
      case "max":
        this.syncMax();
        break;
      case "min":
        this.syncMin();
        break;
    }
  }
  /**
   * 主从模式同步
   */
  syncMasterSlave(masterId) {
    if (!masterId) {
      masterId = Array.from(this.instances.keys())[0];
    }
    const master = this.instances.get(masterId);
    if (!master)
      return;
    const masterValue = master.getValue();
    this.syncTo(masterValue, masterId);
  }
  /**
   * 平均值模式同步
   */
  syncAverage() {
    const values = [];
    this.instances.forEach((instance) => {
      values.push(instance.getValue());
    });
    if (values.length === 0)
      return;
    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    this.syncTo(average);
  }
  /**
   * 最大值模式同步
   */
  syncMax() {
    let maxValue = -Infinity;
    this.instances.forEach((instance) => {
      const value = instance.getValue();
      if (value > maxValue) {
        maxValue = value;
      }
    });
    if (isFinite(maxValue)) {
      this.syncTo(maxValue);
    }
  }
  /**
   * 最小值模式同步
   */
  syncMin() {
    let minValue = Infinity;
    this.instances.forEach((instance) => {
      const value = instance.getValue();
      if (value < minValue) {
        minValue = value;
      }
    });
    if (isFinite(minValue)) {
      this.syncTo(minValue);
    }
  }
  /**
   * 设置同步模式
   */
  setMode(mode) {
    this.options.mode = mode;
  }
  /**
   * 设置同步延迟
   */
  setDelay(delay) {
    this.options.delay = delay;
  }
  /**
   * 设置值转换函数
   */
  setTransform(transform) {
    this.options.transform = transform;
  }
  /**
   * 启用/禁用动画
   */
  setAnimated(animated) {
    this.options.animated = animated;
  }
  /**
   * 获取所有实例 ID
   */
  getInstanceIds() {
    return Array.from(this.instances.keys());
  }
  /**
   * 获取实例数量
   */
  getInstanceCount() {
    return this.instances.size;
  }
  /**
   * 清空所有实例
   */
  clear() {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.instances.clear();
  }
  /**
   * 检查是否包含实例
   */
  has(id) {
    return this.instances.has(id);
  }
  /**
   * 获取所有实例的当前值
   */
  getAllValues() {
    const values = /* @__PURE__ */ new Map();
    this.instances.forEach((instance, id) => {
      values.set(id, instance.getValue());
    });
    return values;
  }
}
class ProgressChain {
  constructor() {
    this.chain = [];
    this.currentIndex = 0;
    this.isRunning = false;
  }
  /**
   * 添加到链中
   */
  add(id, instance, targetValue = 100) {
    this.chain.push({ id, instance, targetValue });
    return this;
  }
  /**
   * 开始执行链
   */
  start(onComplete, onStepComplete) {
    if (this.isRunning)
      return;
    if (this.chain.length === 0)
      return;
    this.isRunning = true;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.onStepComplete = onStepComplete;
    this.executeNext();
  }
  /**
   * 执行下一个
   */
  executeNext() {
    if (this.currentIndex >= this.chain.length) {
      this.isRunning = false;
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }
    const { id, instance, targetValue } = this.chain[this.currentIndex];
    const originalOnComplete = instance.config?.get("onComplete");
    const handleComplete = () => {
      if (this.onStepComplete) {
        this.onStepComplete(this.currentIndex, id);
      }
      if (originalOnComplete) {
        instance.config?.set("onComplete", originalOnComplete);
      }
      this.currentIndex++;
      this.executeNext();
    };
    if (instance.config) {
      instance.config.set("onComplete", handleComplete);
    }
    instance.setValue(targetValue);
  }
  /**
   * 停止执行
   */
  stop() {
    this.isRunning = false;
  }
  /**
   * 重置
   */
  reset() {
    this.stop();
    this.currentIndex = 0;
    this.chain.forEach(({ instance }) => {
      instance.setValue(0, false);
    });
  }
  /**
   * 清空链
   */
  clear() {
    this.stop();
    this.chain = [];
    this.currentIndex = 0;
  }
  /**
   * 获取当前进度
   */
  getCurrentIndex() {
    return this.currentIndex;
  }
  /**
   * 检查是否正在运行
   */
  isChainRunning() {
    return this.isRunning;
  }
  /**
   * 获取链长度
   */
  getLength() {
    return this.chain.length;
  }
}
class ProgressGroup {
  constructor() {
    this.group = /* @__PURE__ */ new Map();
  }
  /**
   * 添加到组
   */
  add(id, instance) {
    this.group.set(id, instance);
  }
  /**
   * 移除
   */
  remove(id) {
    this.group.delete(id);
  }
  /**
   * 全部设置为相同值
   */
  setAll(value, animated = true) {
    this.group.forEach((instance) => {
      instance.setValue(value, animated);
    });
  }
  /**
   * 全部增加
   */
  incrementAll(delta) {
    this.group.forEach((instance) => {
      const currentValue = instance.getValue();
      instance.setValue(currentValue + delta);
    });
  }
  /**
   * 全部重置
   */
  resetAll() {
    this.group.forEach((instance) => {
      if (typeof instance.reset === "function") {
        instance.reset();
      } else {
        instance.setValue(0, false);
      }
    });
  }
  /**
   * 全部销毁
   */
  destroyAll() {
    this.group.forEach((instance) => {
      if (typeof instance.destroy === "function") {
        instance.destroy();
      }
    });
    this.group.clear();
  }
  /**
   * 获取平均值
   */
  getAverage() {
    if (this.group.size === 0)
      return 0;
    let sum = 0;
    this.group.forEach((instance) => {
      sum += instance.getValue();
    });
    return sum / this.group.size;
  }
  /**
   * 获取总和
   */
  getSum() {
    let sum = 0;
    this.group.forEach((instance) => {
      sum += instance.getValue();
    });
    return sum;
  }
  /**
   * 获取最大值
   */
  getMax() {
    let max = -Infinity;
    this.group.forEach((instance) => {
      const value = instance.getValue();
      if (value > max) {
        max = value;
      }
    });
    return isFinite(max) ? max : 0;
  }
  /**
   * 获取最小值
   */
  getMin() {
    let min = Infinity;
    this.group.forEach((instance) => {
      const value = instance.getValue();
      if (value < min) {
        min = value;
      }
    });
    return isFinite(min) ? min : 0;
  }
  /**
   * 获取所有值
   */
  getAllValues() {
    const values = /* @__PURE__ */ new Map();
    this.group.forEach((instance, id) => {
      values.set(id, instance.getValue());
    });
    return values;
  }
  /**
   * 获取数量
   */
  size() {
    return this.group.size;
  }
  /**
   * 清空
   */
  clear() {
    this.group.clear();
  }
}

export { ProgressChain, ProgressGroup, ProgressSynchronizer };
//# sourceMappingURL=ProgressSynchronizer.js.map
