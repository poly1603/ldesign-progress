/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class ObjectPool {
  constructor(factory, reset, maxSize = 50) {
    this.pool = [];
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
  }
  /**
   * 从池中获取对象
   */
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.factory();
  }
  /**
   * 归还对象到池中
   */
  release(obj) {
    if (this.pool.length < this.maxSize) {
      if (this.reset) {
        this.reset(obj);
      }
      this.pool.push(obj);
    }
  }
  /**
   * 清空池
   */
  clear() {
    this.pool = [];
  }
  /**
   * 获取池中对象数量
   */
  size() {
    return this.pool.length;
  }
}
class DOMElementPool {
  constructor() {
    this.pools = /* @__PURE__ */ new Map();
  }
  /**
   * 获取指定标签的元素
   */
  acquire(tag, className) {
    const key = `${tag}:${className || ""}`;
    if (!this.pools.has(key)) {
      this.pools.set(
        key,
        new ObjectPool(
          () => {
            const el = document.createElement(tag);
            if (className) {
              el.className = className;
            }
            return el;
          },
          (el) => {
            el.innerHTML = "";
            el.style.cssText = "";
            if (!className) {
              el.className = "";
            }
            Array.from(el.attributes).forEach((attr) => {
              if (attr.name !== "class" || !className) {
                el.removeAttribute(attr.name);
              }
            });
          }
        )
      );
    }
    return this.pools.get(key).acquire();
  }
  /**
   * 归还元素
   */
  release(element, tag, className) {
    const key = `${tag}:${className || ""}`;
    const pool = this.pools.get(key);
    if (pool) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      pool.release(element);
    }
  }
  /**
   * 清空所有池
   */
  clearAll() {
    this.pools.forEach((pool) => pool.clear());
    this.pools.clear();
  }
}
class SVGElementPool {
  constructor() {
    this.pools = /* @__PURE__ */ new Map();
  }
  /**
   * 获取指定标签的 SVG 元素
   */
  acquire(tag, attributes) {
    const key = tag;
    if (!this.pools.has(key)) {
      this.pools.set(
        key,
        new ObjectPool(
          () => document.createElementNS("http://www.w3.org/2000/svg", tag),
          (el) => {
            el.innerHTML = "";
            Array.from(el.attributes).forEach((attr) => {
              el.removeAttribute(attr.name);
            });
          }
        )
      );
    }
    const element = this.pools.get(key).acquire();
    if (attributes) {
      Object.entries(attributes).forEach(([key2, value]) => {
        element.setAttribute(key2, value);
      });
    }
    return element;
  }
  /**
   * 归还元素
   */
  release(element, tag) {
    const pool = this.pools.get(tag);
    if (pool) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      pool.release(element);
    }
  }
  /**
   * 清空所有池
   */
  clearAll() {
    this.pools.forEach((pool) => pool.clear());
    this.pools.clear();
  }
}
class ComputationCache {
  constructor() {
    this.cache = /* @__PURE__ */ new WeakMap();
  }
  /**
   * 获取缓存值
   */
  get(key, subKey) {
    const subCache = this.cache.get(key);
    return subCache?.get(subKey);
  }
  /**
   * 设置缓存值
   */
  set(key, subKey, value) {
    let subCache = this.cache.get(key);
    if (!subCache) {
      subCache = /* @__PURE__ */ new Map();
      this.cache.set(key, subCache);
    }
    subCache.set(subKey, value);
  }
  /**
   * 检查是否有缓存
   */
  has(key, subKey) {
    return this.cache.get(key)?.has(subKey) || false;
  }
  /**
   * 清除特定键的缓存
   */
  delete(key, subKey) {
    if (subKey) {
      this.cache.get(key)?.delete(subKey);
    } else {
      this.cache.delete(key);
    }
  }
}
class CanvasContextCache {
  constructor() {
    this.cache = /* @__PURE__ */ new WeakMap();
  }
  /**
   * 获取或创建上下文
   */
  get(canvas, contextAttributes) {
    let ctx = this.cache.get(canvas);
    if (!ctx) {
      ctx = canvas.getContext("2d", contextAttributes);
      this.cache.set(canvas, ctx);
    }
    return ctx;
  }
  /**
   * 清除缓存
   */
  clear(canvas) {
    this.cache.delete(canvas);
  }
}
class GradientCache {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
  }
  /**
   * 生成缓存键
   */
  generateKey(colors, direction) {
    return `${colors.join(",")}:${direction || "default"}`;
  }
  /**
   * 获取或创建渐变
   */
  get(colors, direction, creator) {
    const key = this.generateKey(colors, direction);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    if (creator) {
      const gradient = creator();
      this.cache.set(key, gradient);
      return gradient;
    }
    return void 0;
  }
  /**
   * 设置渐变
   */
  set(colors, gradient, direction) {
    const key = this.generateKey(colors, direction);
    this.cache.set(key, gradient);
  }
  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
  }
  /**
   * 获取缓存大小
   */
  size() {
    return this.cache.size;
  }
}
class MemoryMonitor {
  constructor() {
    this.instances = /* @__PURE__ */ new WeakSet();
    this.creationTimes = /* @__PURE__ */ new WeakMap();
    this.instanceCount = 0;
    this.peakCount = 0;
    this.enabled = false;
  }
  /**
   * 启用监控
   */
  enable() {
    this.enabled = true;
  }
  /**
   * 禁用监控
   */
  disable() {
    this.enabled = false;
  }
  /**
   * 注册实例
   */
  register(instance) {
    if (!this.enabled)
      return;
    this.instances.add(instance);
    this.creationTimes.set(instance, Date.now());
    this.instanceCount++;
    if (this.instanceCount > this.peakCount) {
      this.peakCount = this.instanceCount;
    }
  }
  /**
   * 注销实例
   */
  unregister(instance) {
    if (!this.enabled)
      return;
    if (this.instances.has(instance)) {
      this.instanceCount--;
    }
  }
  /**
   * 获取统计信息
   */
  getStats() {
    return {
      currentCount: this.instanceCount,
      peakCount: this.peakCount
    };
  }
  /**
   * 重置统计
   */
  reset() {
    this.instanceCount = 0;
    this.peakCount = 0;
  }
  /**
   * 获取实例存活时间
   */
  getLifetime(instance) {
    const creationTime = this.creationTimes.get(instance);
    if (creationTime) {
      return Date.now() - creationTime;
    }
    return null;
  }
}
const domElementPool = new DOMElementPool();
const svgElementPool = new SVGElementPool();
const canvasContextCache = new CanvasContextCache();
const gradientCache = new GradientCache();
const memoryMonitor = new MemoryMonitor();
if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
  memoryMonitor.enable();
}

export { CanvasContextCache, ComputationCache, DOMElementPool, GradientCache, MemoryMonitor, ObjectPool, SVGElementPool, canvasContextCache, domElementPool, gradientCache, memoryMonitor, svgElementPool };
//# sourceMappingURL=MemoryManager.js.map
