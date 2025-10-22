/**
 * 内存管理器 - 对象池和缓存管理
 */

/**
 * 对象池类 - 复用对象减少 GC 压力
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset?: (obj: T) => void;
  private maxSize: number;

  constructor(factory: () => T, reset?: (obj: T) => void, maxSize: number = 50) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
  }

  /**
   * 从池中获取对象
   */
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  /**
   * 归还对象到池中
   */
  release(obj: T): void {
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
  clear(): void {
    this.pool = [];
  }

  /**
   * 获取池中对象数量
   */
  size(): number {
    return this.pool.length;
  }
}

/**
 * DOM 元素池
 */
export class DOMElementPool {
  private pools: Map<string, ObjectPool<HTMLElement>> = new Map();

  /**
   * 获取指定标签的元素
   */
  acquire(tag: string, className?: string): HTMLElement {
    const key = `${tag}:${className || ''}`;

    if (!this.pools.has(key)) {
      this.pools.set(
        key,
        new ObjectPool<HTMLElement>(
          () => {
            const el = document.createElement(tag);
            if (className) {
              el.className = className;
            }
            return el;
          },
          (el) => {
            // 重置元素状态
            el.innerHTML = '';
            el.style.cssText = '';
            if (!className) {
              el.className = '';
            }
            // 移除所有属性
            Array.from(el.attributes).forEach(attr => {
              if (attr.name !== 'class' || !className) {
                el.removeAttribute(attr.name);
              }
            });
          }
        )
      );
    }

    return this.pools.get(key)!.acquire();
  }

  /**
   * 归还元素
   */
  release(element: HTMLElement, tag: string, className?: string): void {
    const key = `${tag}:${className || ''}`;
    const pool = this.pools.get(key);
    if (pool) {
      // 从 DOM 中移除
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      pool.release(element);
    }
  }

  /**
   * 清空所有池
   */
  clearAll(): void {
    this.pools.forEach(pool => pool.clear());
    this.pools.clear();
  }
}

/**
 * SVG 元素池
 */
export class SVGElementPool {
  private pools: Map<string, ObjectPool<SVGElement>> = new Map();

  /**
   * 获取指定标签的 SVG 元素
   */
  acquire(tag: string, attributes?: Record<string, string>): SVGElement {
    const key = tag;

    if (!this.pools.has(key)) {
      this.pools.set(
        key,
        new ObjectPool<SVGElement>(
          () => document.createElementNS('http://www.w3.org/2000/svg', tag),
          (el) => {
            // 重置元素状态
            el.innerHTML = '';
            // 移除所有属性
            Array.from(el.attributes).forEach(attr => {
              el.removeAttribute(attr.name);
            });
          }
        )
      );
    }

    const element = this.pools.get(key)!.acquire();

    // 设置属性
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    return element;
  }

  /**
   * 归还元素
   */
  release(element: SVGElement, tag: string): void {
    const pool = this.pools.get(tag);
    if (pool) {
      // 从 DOM 中移除
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      pool.release(element);
    }
  }

  /**
   * 清空所有池
   */
  clearAll(): void {
    this.pools.forEach(pool => pool.clear());
    this.pools.clear();
  }
}

/**
 * 计算结果缓存 - 使用 WeakMap 自动 GC
 */
export class ComputationCache<K extends object, V> {
  private cache: WeakMap<K, Map<string, V>> = new WeakMap();

  /**
   * 获取缓存值
   */
  get(key: K, subKey: string): V | undefined {
    const subCache = this.cache.get(key);
    return subCache?.get(subKey);
  }

  /**
   * 设置缓存值
   */
  set(key: K, subKey: string, value: V): void {
    let subCache = this.cache.get(key);
    if (!subCache) {
      subCache = new Map();
      this.cache.set(key, subCache);
    }
    subCache.set(subKey, value);
  }

  /**
   * 检查是否有缓存
   */
  has(key: K, subKey: string): boolean {
    return this.cache.get(key)?.has(subKey) || false;
  }

  /**
   * 清除特定键的缓存
   */
  delete(key: K, subKey?: string): void {
    if (subKey) {
      this.cache.get(key)?.delete(subKey);
    } else {
      this.cache.delete(key);
    }
  }
}

/**
 * Canvas 上下文缓存
 */
export class CanvasContextCache {
  private cache: WeakMap<HTMLCanvasElement, CanvasRenderingContext2D> = new WeakMap();

  /**
   * 获取或创建上下文
   */
  get(canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D {
    let ctx = this.cache.get(canvas);
    if (!ctx) {
      ctx = canvas.getContext('2d', contextAttributes)!;
      this.cache.set(canvas, ctx);
    }
    return ctx;
  }

  /**
   * 清除缓存
   */
  clear(canvas: HTMLCanvasElement): void {
    this.cache.delete(canvas);
  }
}

/**
 * 渐变对象缓存
 */
export class GradientCache {
  private cache: Map<string, CanvasGradient | string> = new Map();

  /**
   * 生成缓存键
   */
  private generateKey(colors: string[], direction?: string): string {
    return `${colors.join(',')}:${direction || 'default'}`;
  }

  /**
   * 获取或创建渐变
   */
  get(
    colors: string[],
    direction?: string,
    creator?: () => CanvasGradient | string
  ): CanvasGradient | string | undefined {
    const key = this.generateKey(colors, direction);

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    if (creator) {
      const gradient = creator();
      this.cache.set(key, gradient);
      return gradient;
    }

    return undefined;
  }

  /**
   * 设置渐变
   */
  set(colors: string[], gradient: CanvasGradient | string, direction?: string): void {
    const key = this.generateKey(colors, direction);
    this.cache.set(key, gradient);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * 内存监控器（开发模式）
 */
export class MemoryMonitor {
  private instances: WeakSet<any> = new WeakSet();
  private creationTimes: WeakMap<any, number> = new WeakMap();
  private instanceCount: number = 0;
  private peakCount: number = 0;
  private enabled: boolean = false;

  /**
   * 启用监控
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * 禁用监控
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * 注册实例
   */
  register(instance: any): void {
    if (!this.enabled) return;

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
  unregister(instance: any): void {
    if (!this.enabled) return;

    if (this.instances.has(instance)) {
      this.instanceCount--;
    }
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    currentCount: number;
    peakCount: number;
  } {
    return {
      currentCount: this.instanceCount,
      peakCount: this.peakCount,
    };
  }

  /**
   * 重置统计
   */
  reset(): void {
    this.instanceCount = 0;
    this.peakCount = 0;
  }

  /**
   * 获取实例存活时间
   */
  getLifetime(instance: any): number | null {
    const creationTime = this.creationTimes.get(instance);
    if (creationTime) {
      return Date.now() - creationTime;
    }
    return null;
  }
}

// 导出单例实例
export const domElementPool = new DOMElementPool();
export const svgElementPool = new SVGElementPool();
export const canvasContextCache = new CanvasContextCache();
export const gradientCache = new GradientCache();
export const memoryMonitor = new MemoryMonitor();

// 开发模式下启用内存监控
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  memoryMonitor.enable();
}




