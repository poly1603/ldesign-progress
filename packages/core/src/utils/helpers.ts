/**
 * 工具函数集合
 */

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 将数值转换为像素字符串
 */
export function toPx(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 创建元素
 */
export function createElement(
  tag: string,
  className?: string,
  parent?: HTMLElement
): HTMLElement {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}

/**
 * 创建SVG元素
 */
export function createSVGElement(
  tag: string,
  attributes?: Record<string, string | number>
): SVGElement {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
  }
  return element;
}

/**
 * 设置多个属性
 */
export function setAttributes(
  element: HTMLElement | SVGElement,
  attributes: Record<string, string | number>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * 角度转弧度
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 弧度转角度
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * 限制数值在范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 检查是否为有效颜色
 */
export function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

/**
 * 生成唯一ID
 */
let idCounter = 0;
export function generateId(prefix: string = 'progress'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * 检查是否为对象
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 解析渐变色
 */
export function parseGradient(
  colors: string | string[],
  direction: string = 'to right'
): string {
  if (typeof colors === 'string') {
    return colors;
  }
  if (Array.isArray(colors) && colors.length > 0) {
    if (colors.length === 1) {
      return colors[0];
    }
    return `linear-gradient(${direction}, ${colors.join(', ')})`;
  }
  return '';
}

/**
 * 创建 DocumentFragment（批量 DOM 操作优化）
 */
export function createFragment(children: HTMLElement[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  children.forEach(child => fragment.appendChild(child));
  return fragment;
}

/**
 * 批量设置样式
 */
export function setStyles(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
): void {
  Object.assign(element.style, styles);
}

/**
 * 获取元素的计算样式值
 */
export function getComputedStyleValue(
  element: HTMLElement,
  property: string
): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 防抖函数（增强版，支持立即执行和取消）
 */
export function debounceEnhanced<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  const { leading = false, trailing = true, maxWait } = options;

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  function invokeFunc(time: number) {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    return func.apply(thisArg, args);
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    const timeUntilMaxWait = maxWait === undefined ? Infinity : maxWait - timeSinceLastInvoke;

    timeout = setTimeout(timerExpired, Math.min(timeWaiting, timeUntilMaxWait));
  }

  function trailingEdge(time: number) {
    timeout = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    lastThis = null;
    return undefined;
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : undefined;
  }

  function cancel() {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = 0;
    lastThis = null;
    timeout = null;
  }

  function flush() {
    return timeout === null ? undefined : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait);
    }
    return undefined;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
}

/**
 * 节流函数（增强版，支持立即执行）
 */
export function throttleEnhanced<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  const { leading = true, trailing = true } = options;

  return debounceEnhanced(func, limit, {
    leading,
    trailing,
    maxWait: limit,
  });
}

/**
 * 颜色转换：十六进制转 RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

/**
 * 颜色转换：RGB 转十六进制
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 颜色混合
 */
export function blendColors(color1: string, color2: string, ratio: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  return rgbToHex(r, g, b);
}

/**
 * 获取对比色（用于文本显示）
 */
export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';

  // 计算亮度
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

/**
 * 贝塞尔曲线路径生成
 */
export function createBezierPath(
  points: { x: number; y: number }[],
  tension: number = 0.5
): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/**
 * 计算两点之间的距离
 */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * 规范化角度到 0-360 范围
 */
export function normalizeAngle(angle: number): number {
  angle = angle % 360;
  return angle < 0 ? angle + 360 : angle;
}

/**
 * 检测是否支持 OffscreenCanvas
 */
export function supportsOffscreenCanvas(): boolean {
  return typeof OffscreenCanvas !== 'undefined';
}

/**
 * 检测是否为移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 检测是否支持触摸
 */
export function supportsTouch(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * 安全执行函数（捕获错误）
 */
export function safeExecute<T>(
  fn: () => T,
  fallback?: T,
  errorHandler?: (error: Error) => void
): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error as Error);
    } else {
      console.error('Error in safeExecute:', error);
    }
    return fallback;
  }
}


