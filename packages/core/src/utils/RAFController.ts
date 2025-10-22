/**
 * requestAnimationFrame 池化控制器
 * 多个动画共享同一个 RAF 循环，提升性能
 */

type AnimationCallback = (timestamp: number, deltaTime: number) => void;

interface AnimationTask {
  id: string;
  callback: AnimationCallback;
  priority: number;
  paused: boolean;
}

/**
 * RAF 控制器 - 单例模式
 */
class RAFController {
  private static instance: RAFController;
  private tasks: Map<string, AnimationTask> = new Map();
  private rafId: number | null = null;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;
  private frameCount: number = 0;
  private fps: number = 60;
  private lastFPSUpdate: number = 0;

  private constructor() {
    // 页面可见性变化时自动暂停/恢复
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseAll();
        } else {
          this.resumeAll();
        }
      });
    }
  }

  /**
   * 获取单例实例
   */
  static getInstance(): RAFController {
    if (!RAFController.instance) {
      RAFController.instance = new RAFController();
    }
    return RAFController.instance;
  }

  /**
   * 注册动画任务
   */
  register(id: string, callback: AnimationCallback, priority: number = 0): void {
    this.tasks.set(id, {
      id,
      callback,
      priority,
      paused: false,
    });

    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * 注销动画任务
   */
  unregister(id: string): void {
    this.tasks.delete(id);

    // 如果没有任务了，停止 RAF
    if (this.tasks.size === 0) {
      this.stop();
    }
  }

  /**
   * 暂停特定任务
   */
  pause(id: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.paused = true;
    }
  }

  /**
   * 恢复特定任务
   */
  resume(id: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.paused = false;
    }

    if (!this.isRunning && this.tasks.size > 0) {
      this.start();
    }
  }

  /**
   * 暂停所有任务
   */
  pauseAll(): void {
    this.tasks.forEach(task => {
      task.paused = true;
    });
  }

  /**
   * 恢复所有任务
   */
  resumeAll(): void {
    this.tasks.forEach(task => {
      task.paused = false;
    });

    if (!this.isRunning && this.tasks.size > 0) {
      this.start();
    }
  }

  /**
   * 检查任务是否存在
   */
  has(id: string): boolean {
    return this.tasks.has(id);
  }

  /**
   * 检查任务是否暂停
   */
  isPaused(id: string): boolean {
    return this.tasks.get(id)?.paused || false;
  }

  /**
   * 获取当前 FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * 获取活跃任务数
   */
  getActiveTaskCount(): number {
    return Array.from(this.tasks.values()).filter(task => !task.paused).length;
  }

  /**
   * 获取总任务数
   */
  getTotalTaskCount(): number {
    return this.tasks.size;
  }

  /**
   * 启动 RAF 循环
   */
  private start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.lastFPSUpdate = this.lastTimestamp;
    this.frameCount = 0;
    this.tick(this.lastTimestamp);
  }

  /**
   * 停止 RAF 循环
   */
  private stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  /**
   * RAF 循环主函数
   */
  private tick = (timestamp: number): void => {
    if (!this.isRunning) return;

    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // 计算 FPS
    this.frameCount++;
    const fpsElapsed = timestamp - this.lastFPSUpdate;
    if (fpsElapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / fpsElapsed);
      this.frameCount = 0;
      this.lastFPSUpdate = timestamp;
    }

    // 按优先级排序任务
    const sortedTasks = Array.from(this.tasks.values())
      .filter(task => !task.paused)
      .sort((a, b) => b.priority - a.priority);

    // 执行所有活跃任务
    for (const task of sortedTasks) {
      try {
        task.callback(timestamp, deltaTime);
      } catch (error) {
        console.error(`Error in animation task "${task.id}":`, error);
      }
    }

    // 继续下一帧
    this.rafId = requestAnimationFrame(this.tick);
  };

  /**
   * 清除所有任务
   */
  clear(): void {
    this.tasks.clear();
    this.stop();
  }
}

// 导出单例实例
export const rafController = RAFController.getInstance();

/**
 * 便捷的动画包装器
 */
export class AnimationWrapper {
  private id: string;
  private priority: number;

  constructor(id: string, callback: AnimationCallback, priority: number = 0) {
    this.id = id;
    this.priority = priority;
    rafController.register(id, callback, priority);
  }

  /**
   * 暂停动画
   */
  pause(): void {
    rafController.pause(this.id);
  }

  /**
   * 恢复动画
   */
  resume(): void {
    rafController.resume(this.id);
  }

  /**
   * 检查是否暂停
   */
  isPaused(): boolean {
    return rafController.isPaused(this.id);
  }

  /**
   * 销毁动画
   */
  destroy(): void {
    rafController.unregister(this.id);
  }

  /**
   * 切换暂停状态
   */
  toggle(): void {
    if (this.isPaused()) {
      this.resume();
    } else {
      this.pause();
    }
  }
}

/**
 * 批量 DOM 操作优化器
 */
export class DOMBatcher {
  private readCallbacks: Array<() => void> = [];
  private writeCallbacks: Array<() => void> = [];
  private scheduled: boolean = false;

  /**
   * 添加读操作（不会导致重排）
   */
  read(callback: () => void): void {
    this.readCallbacks.push(callback);
    this.schedule();
  }

  /**
   * 添加写操作（可能导致重排）
   */
  write(callback: () => void): void {
    this.writeCallbacks.push(callback);
    this.schedule();
  }

  /**
   * 调度批处理
   */
  private schedule(): void {
    if (this.scheduled) return;

    this.scheduled = true;
    requestAnimationFrame(() => {
      this.flush();
    });
  }

  /**
   * 执行批处理
   */
  private flush(): void {
    // 先执行所有读操作
    const reads = this.readCallbacks.slice();
    this.readCallbacks = [];

    for (const read of reads) {
      try {
        read();
      } catch (error) {
        console.error('Error in DOM read operation:', error);
      }
    }

    // 再执行所有写操作
    const writes = this.writeCallbacks.slice();
    this.writeCallbacks = [];

    for (const write of writes) {
      try {
        write();
      } catch (error) {
        console.error('Error in DOM write operation:', error);
      }
    }

    this.scheduled = false;

    // 如果还有待处理的操作，继续调度
    if (this.readCallbacks.length > 0 || this.writeCallbacks.length > 0) {
      this.schedule();
    }
  }

  /**
   * 清空所有待处理操作
   */
  clear(): void {
    this.readCallbacks = [];
    this.writeCallbacks = [];
    this.scheduled = false;
  }
}

// 导出单例实例
export const domBatcher = new DOMBatcher();




