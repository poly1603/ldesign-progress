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

class EventEmitter {
  constructor() {
    this.events = /* @__PURE__ */ new Map();
  }
  /**
   * 监听事件
   */
  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, /* @__PURE__ */ new Set());
    }
    this.events.get(event).add(handler);
    return this;
  }
  /**
   * 监听一次事件
   */
  once(event, handler) {
    const onceHandler = (...args) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }
  /**
   * 取消监听
   */
  off(event, handler) {
    if (!handler) {
      this.events.delete(event);
      return this;
    }
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    }
    return this;
  }
  /**
   * 触发事件
   */
  emit(event, ...args) {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
    return this;
  }
  /**
   * 清除所有事件监听
   */
  removeAllListeners() {
    this.events.clear();
  }
  /**
   * 获取事件监听器数量
   */
  listenerCount(event) {
    return this.events.get(event)?.size || 0;
  }
}

exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.cjs.map
