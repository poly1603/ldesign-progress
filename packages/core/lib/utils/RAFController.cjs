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

class RAFController {
  constructor() {
    this.tasks = /* @__PURE__ */ new Map();
    this.rafId = null;
    this.isRunning = false;
    this.lastTimestamp = 0;
    this.frameCount = 0;
    this.fps = 60;
    this.lastFPSUpdate = 0;
    /**
     * RAF 循环主函数
     */
    this.tick = (timestamp) => {
      if (!this.isRunning)
        return;
      const deltaTime = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;
      this.frameCount++;
      const fpsElapsed = timestamp - this.lastFPSUpdate;
      if (fpsElapsed >= 1e3) {
        this.fps = Math.round(this.frameCount * 1e3 / fpsElapsed);
        this.frameCount = 0;
        this.lastFPSUpdate = timestamp;
      }
      const sortedTasks = Array.from(this.tasks.values()).filter((task) => !task.paused).sort((a, b) => b.priority - a.priority);
      for (const task of sortedTasks) {
        try {
          task.callback(timestamp, deltaTime);
        } catch (error) {
          console.error(`Error in animation task "${task.id}":`, error);
        }
      }
      this.rafId = requestAnimationFrame(this.tick);
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
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
  static getInstance() {
    if (!RAFController.instance) {
      RAFController.instance = new RAFController();
    }
    return RAFController.instance;
  }
  /**
   * 注册动画任务
   */
  register(id, callback, priority = 0) {
    this.tasks.set(id, {
      id,
      callback,
      priority,
      paused: false
    });
    if (!this.isRunning) {
      this.start();
    }
  }
  /**
   * 注销动画任务
   */
  unregister(id) {
    this.tasks.delete(id);
    if (this.tasks.size === 0) {
      this.stop();
    }
  }
  /**
   * 暂停特定任务
   */
  pause(id) {
    const task = this.tasks.get(id);
    if (task) {
      task.paused = true;
    }
  }
  /**
   * 恢复特定任务
   */
  resume(id) {
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
  pauseAll() {
    this.tasks.forEach((task) => {
      task.paused = true;
    });
  }
  /**
   * 恢复所有任务
   */
  resumeAll() {
    this.tasks.forEach((task) => {
      task.paused = false;
    });
    if (!this.isRunning && this.tasks.size > 0) {
      this.start();
    }
  }
  /**
   * 检查任务是否存在
   */
  has(id) {
    return this.tasks.has(id);
  }
  /**
   * 检查任务是否暂停
   */
  isPaused(id) {
    return this.tasks.get(id)?.paused || false;
  }
  /**
   * 获取当前 FPS
   */
  getFPS() {
    return this.fps;
  }
  /**
   * 获取活跃任务数
   */
  getActiveTaskCount() {
    return Array.from(this.tasks.values()).filter((task) => !task.paused).length;
  }
  /**
   * 获取总任务数
   */
  getTotalTaskCount() {
    return this.tasks.size;
  }
  /**
   * 启动 RAF 循环
   */
  start() {
    if (this.isRunning)
      return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.lastFPSUpdate = this.lastTimestamp;
    this.frameCount = 0;
    this.tick(this.lastTimestamp);
  }
  /**
   * 停止 RAF 循环
   */
  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }
  /**
   * 清除所有任务
   */
  clear() {
    this.tasks.clear();
    this.stop();
  }
}
const rafController = RAFController.getInstance();
class AnimationWrapper {
  constructor(id, callback, priority = 0) {
    this.id = id;
    this.priority = priority;
    rafController.register(id, callback, priority);
  }
  /**
   * 暂停动画
   */
  pause() {
    rafController.pause(this.id);
  }
  /**
   * 恢复动画
   */
  resume() {
    rafController.resume(this.id);
  }
  /**
   * 检查是否暂停
   */
  isPaused() {
    return rafController.isPaused(this.id);
  }
  /**
   * 销毁动画
   */
  destroy() {
    rafController.unregister(this.id);
  }
  /**
   * 切换暂停状态
   */
  toggle() {
    if (this.isPaused()) {
      this.resume();
    } else {
      this.pause();
    }
  }
}
class DOMBatcher {
  constructor() {
    this.readCallbacks = [];
    this.writeCallbacks = [];
    this.scheduled = false;
  }
  /**
   * 添加读操作（不会导致重排）
   */
  read(callback) {
    this.readCallbacks.push(callback);
    this.schedule();
  }
  /**
   * 添加写操作（可能导致重排）
   */
  write(callback) {
    this.writeCallbacks.push(callback);
    this.schedule();
  }
  /**
   * 调度批处理
   */
  schedule() {
    if (this.scheduled)
      return;
    this.scheduled = true;
    requestAnimationFrame(() => {
      this.flush();
    });
  }
  /**
   * 执行批处理
   */
  flush() {
    const reads = this.readCallbacks.slice();
    this.readCallbacks = [];
    for (const read of reads) {
      try {
        read();
      } catch (error) {
        console.error("Error in DOM read operation:", error);
      }
    }
    const writes = this.writeCallbacks.slice();
    this.writeCallbacks = [];
    for (const write of writes) {
      try {
        write();
      } catch (error) {
        console.error("Error in DOM write operation:", error);
      }
    }
    this.scheduled = false;
    if (this.readCallbacks.length > 0 || this.writeCallbacks.length > 0) {
      this.schedule();
    }
  }
  /**
   * 清空所有待处理操作
   */
  clear() {
    this.readCallbacks = [];
    this.writeCallbacks = [];
    this.scheduled = false;
  }
}
const domBatcher = new DOMBatcher();

exports.AnimationWrapper = AnimationWrapper;
exports.DOMBatcher = DOMBatcher;
exports.domBatcher = domBatcher;
exports.rafController = rafController;
//# sourceMappingURL=RAFController.cjs.map
