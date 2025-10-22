/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
function debounce(func, wait) {
  let timeout = null;
  return function(...args) {
    const context = this;
    if (timeout)
      clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
function throttle(func, limit) {
  let inThrottle = false;
  return function(...args) {
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
function toPx(value) {
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
}
function formatPercentage(value, decimals = 0) {
  return `${value.toFixed(decimals)}%`;
}
function createElement(tag, className, parent) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}
function createSVGElement(tag, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
  }
  return element;
}
function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
}
function lerp(start, end, t) {
  return start + (end - start) * t;
}
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}
function radToDeg(radians) {
  return radians * 180 / Math.PI;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function isValidColor(color) {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
}
let idCounter = 0;
function generateId(prefix = "progress") {
  return `${prefix}-${++idCounter}`;
}
function deepMerge(target, ...sources) {
  if (!sources.length)
    return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key])
          Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function parseGradient(colors, direction = "to right") {
  if (typeof colors === "string") {
    return colors;
  }
  if (Array.isArray(colors) && colors.length > 0) {
    if (colors.length === 1) {
      return colors[0];
    }
    return `linear-gradient(${direction}, ${colors.join(", ")})`;
  }
  return "";
}
function createFragment(children) {
  const fragment = document.createDocumentFragment();
  children.forEach((child) => fragment.appendChild(child));
  return fragment;
}
function setStyles(element, styles) {
  Object.assign(element.style, styles);
}
function getComputedStyleValue(element, property) {
  return window.getComputedStyle(element).getPropertyValue(property);
}
function debounceEnhanced(func, wait, options = {}) {
  const { leading = false, trailing = true, maxWait } = options;
  let timeout = null;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let lastArgs = null;
  let lastThis = null;
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    return func.apply(thisArg, args);
  }
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxWait !== void 0 && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    const timeUntilMaxWait = maxWait === void 0 ? Infinity : maxWait - timeSinceLastInvoke;
    timeout = setTimeout(timerExpired, Math.min(timeWaiting, timeUntilMaxWait));
  }
  function trailingEdge(time) {
    timeout = null;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    lastThis = null;
    return void 0;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : void 0;
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
    return timeout === null ? void 0 : trailingEdge(Date.now());
  }
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== void 0) {
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait);
    }
    return void 0;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function throttleEnhanced(func, limit, options = {}) {
  const { leading = true, trailing = true } = options;
  return debounceEnhanced(func, limit, {
    leading,
    trailing,
    maxWait: limit
  });
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}
function blendColors(color1, color2, ratio) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2)
    return color1;
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  return rgbToHex(r, g, b);
}
function getContrastColor(hexColor) {
  const rgb = hexToRgb(hexColor);
  if (!rgb)
    return "#000000";
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
  return brightness > 128 ? "#000000" : "#ffffff";
}
function createBezierPath(points, tension = 0.5) {
  if (points.length < 2)
    return "";
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
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function normalizeAngle(angle) {
  angle = angle % 360;
  return angle < 0 ? angle + 360 : angle;
}
function supportsOffscreenCanvas() {
  return typeof OffscreenCanvas !== "undefined";
}
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function supportsTouch() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function safeExecute(fn, fallback, errorHandler) {
  try {
    return fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error("Error in safeExecute:", error);
    }
    return fallback;
  }
}

export { blendColors, clamp, createBezierPath, createElement, createFragment, createSVGElement, debounce, debounceEnhanced, deepMerge, degToRad, distance, formatPercentage, generateId, getComputedStyleValue, getContrastColor, hexToRgb, isMobile, isValidColor, lerp, normalizeAngle, parseGradient, radToDeg, rgbToHex, safeExecute, setAttributes, setStyles, supportsOffscreenCanvas, supportsTouch, throttle, throttleEnhanced, toPx };
//# sourceMappingURL=helpers.js.map
