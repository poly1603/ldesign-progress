/**
 * 进度同步器 - 多个进度条同步更新
 */

export type ProgressInstance = {
  setValue: (value: number, animated?: boolean) => void;
  getValue: () => number;
  [key: string]: any;
};

export interface SyncOptions {
  /** 同步模式 */
  mode?: 'master-slave' | 'average' | 'max' | 'min';
  /** 同步延迟（毫秒） */
  delay?: number;
  /** 是否启用动画 */
  animated?: boolean;
  /** 值转换函数 */
  transform?: (value: number, instanceId: string) => number;
}

/**
 * 进度同步器类
 */
export class ProgressSynchronizer {
  private instances: Map<string, ProgressInstance> = new Map();
  private options: SyncOptions;
  private isSyncing: boolean = false;
  private syncTimeout?: any;

  constructor(options: SyncOptions = {}) {
    this.options = {
      mode: 'master-slave',
      delay: 0,
      animated: true,
      ...options,
    };
  }

  /**
   * 添加进度条实例
   */
  add(id: string, instance: ProgressInstance): void {
    this.instances.set(id, instance);
  }

  /**
   * 移除进度条实例
   */
  remove(id: string): void {
    this.instances.delete(id);
  }

  /**
   * 同步所有实例到指定值
   */
  syncTo(value: number, excludeId?: string): void {
    if (this.isSyncing) return;

    this.isSyncing = true;

    const sync = () => {
      this.instances.forEach((instance, id) => {
        if (id === excludeId) return;

        // 应用转换函数
        const transformedValue = this.options.transform
          ? this.options.transform(value, id)
          : value;

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
  sync(sourceId?: string): void {
    if (this.instances.size === 0) return;

    const mode = this.options.mode || 'master-slave';

    switch (mode) {
      case 'master-slave':
        this.syncMasterSlave(sourceId);
        break;
      case 'average':
        this.syncAverage();
        break;
      case 'max':
        this.syncMax();
        break;
      case 'min':
        this.syncMin();
        break;
    }
  }

  /**
   * 主从模式同步
   */
  private syncMasterSlave(masterId?: string): void {
    if (!masterId) {
      // 使用第一个实例作为主实例
      masterId = Array.from(this.instances.keys())[0];
    }

    const master = this.instances.get(masterId);
    if (!master) return;

    const masterValue = master.getValue();
    this.syncTo(masterValue, masterId);
  }

  /**
   * 平均值模式同步
   */
  private syncAverage(): void {
    const values: number[] = [];
    this.instances.forEach(instance => {
      values.push(instance.getValue());
    });

    if (values.length === 0) return;

    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    this.syncTo(average);
  }

  /**
   * 最大值模式同步
   */
  private syncMax(): void {
    let maxValue = -Infinity;
    this.instances.forEach(instance => {
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
  private syncMin(): void {
    let minValue = Infinity;
    this.instances.forEach(instance => {
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
  setMode(mode: 'master-slave' | 'average' | 'max' | 'min'): void {
    this.options.mode = mode;
  }

  /**
   * 设置同步延迟
   */
  setDelay(delay: number): void {
    this.options.delay = delay;
  }

  /**
   * 设置值转换函数
   */
  setTransform(transform: (value: number, instanceId: string) => number): void {
    this.options.transform = transform;
  }

  /**
   * 启用/禁用动画
   */
  setAnimated(animated: boolean): void {
    this.options.animated = animated;
  }

  /**
   * 获取所有实例 ID
   */
  getInstanceIds(): string[] {
    return Array.from(this.instances.keys());
  }

  /**
   * 获取实例数量
   */
  getInstanceCount(): number {
    return this.instances.size;
  }

  /**
   * 清空所有实例
   */
  clear(): void {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.instances.clear();
  }

  /**
   * 检查是否包含实例
   */
  has(id: string): boolean {
    return this.instances.has(id);
  }

  /**
   * 获取所有实例的当前值
   */
  getAllValues(): Map<string, number> {
    const values = new Map<string, number>();
    this.instances.forEach((instance, id) => {
      values.set(id, instance.getValue());
    });
    return values;
  }
}

/**
 * 链式进度 - 一个完成后触发下一个
 */
export class ProgressChain {
  private chain: Array<{
    id: string;
    instance: ProgressInstance;
    targetValue: number;
  }> = [];
  private currentIndex: number = 0;
  private isRunning: boolean = false;
  private onComplete?: () => void;
  private onStepComplete?: (index: number, id: string) => void;

  /**
   * 添加到链中
   */
  add(id: string, instance: ProgressInstance, targetValue: number = 100): this {
    this.chain.push({ id, instance, targetValue });
    return this;
  }

  /**
   * 开始执行链
   */
  start(onComplete?: () => void, onStepComplete?: (index: number, id: string) => void): void {
    if (this.isRunning) return;
    if (this.chain.length === 0) return;

    this.isRunning = true;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.onStepComplete = onStepComplete;

    this.executeNext();
  }

  /**
   * 执行下一个
   */
  private executeNext(): void {
    if (this.currentIndex >= this.chain.length) {
      this.isRunning = false;
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }

    const { id, instance, targetValue } = this.chain[this.currentIndex];

    // 监听完成事件
    const originalOnComplete = (instance as any).config?.get('onComplete');

    const handleComplete = () => {
      if (this.onStepComplete) {
        this.onStepComplete(this.currentIndex, id);
      }

      // 恢复原来的回调
      if (originalOnComplete) {
        (instance as any).config?.set('onComplete', originalOnComplete);
      }

      this.currentIndex++;
      this.executeNext();
    };

    // 设置临时完成回调
    if ((instance as any).config) {
      (instance as any).config.set('onComplete', handleComplete);
    }

    // 启动进度
    instance.setValue(targetValue);
  }

  /**
   * 停止执行
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * 重置
   */
  reset(): void {
    this.stop();
    this.currentIndex = 0;
    this.chain.forEach(({ instance }) => {
      instance.setValue(0, false);
    });
  }

  /**
   * 清空链
   */
  clear(): void {
    this.stop();
    this.chain = [];
    this.currentIndex = 0;
  }

  /**
   * 获取当前进度
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 检查是否正在运行
   */
  isChainRunning(): boolean {
    return this.isRunning;
  }

  /**
   * 获取链长度
   */
  getLength(): number {
    return this.chain.length;
  }
}

/**
 * 进度组 - 管理一组相关的进度条
 */
export class ProgressGroup {
  private group: Map<string, ProgressInstance> = new Map();

  /**
   * 添加到组
   */
  add(id: string, instance: ProgressInstance): void {
    this.group.set(id, instance);
  }

  /**
   * 移除
   */
  remove(id: string): void {
    this.group.delete(id);
  }

  /**
   * 全部设置为相同值
   */
  setAll(value: number, animated: boolean = true): void {
    this.group.forEach(instance => {
      instance.setValue(value, animated);
    });
  }

  /**
   * 全部增加
   */
  incrementAll(delta: number): void {
    this.group.forEach(instance => {
      const currentValue = instance.getValue();
      instance.setValue(currentValue + delta);
    });
  }

  /**
   * 全部重置
   */
  resetAll(): void {
    this.group.forEach(instance => {
      if (typeof (instance as any).reset === 'function') {
        (instance as any).reset();
      } else {
        instance.setValue(0, false);
      }
    });
  }

  /**
   * 全部销毁
   */
  destroyAll(): void {
    this.group.forEach(instance => {
      if (typeof (instance as any).destroy === 'function') {
        (instance as any).destroy();
      }
    });
    this.group.clear();
  }

  /**
   * 获取平均值
   */
  getAverage(): number {
    if (this.group.size === 0) return 0;

    let sum = 0;
    this.group.forEach(instance => {
      sum += instance.getValue();
    });

    return sum / this.group.size;
  }

  /**
   * 获取总和
   */
  getSum(): number {
    let sum = 0;
    this.group.forEach(instance => {
      sum += instance.getValue();
    });
    return sum;
  }

  /**
   * 获取最大值
   */
  getMax(): number {
    let max = -Infinity;
    this.group.forEach(instance => {
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
  getMin(): number {
    let min = Infinity;
    this.group.forEach(instance => {
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
  getAllValues(): Map<string, number> {
    const values = new Map<string, number>();
    this.group.forEach((instance, id) => {
      values.set(id, instance.getValue());
    });
    return values;
  }

  /**
   * 获取数量
   */
  size(): number {
    return this.group.size;
  }

  /**
   * 清空
   */
  clear(): void {
    this.group.clear();
  }
}



