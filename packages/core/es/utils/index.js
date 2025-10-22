/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
export { EventEmitter } from './EventEmitter.js';
export { ConfigManager } from './ConfigManager.js';
export { AnimationController } from './AnimationController.js';
export { ThemeManager, themeManager } from './ThemeManager.js';
export { blendColors, clamp, createBezierPath, createElement, createFragment, createSVGElement, debounce, debounceEnhanced, deepMerge, degToRad, distance, formatPercentage, generateId, getComputedStyleValue, getContrastColor, hexToRgb, isMobile, isValidColor, lerp, normalizeAngle, parseGradient, radToDeg, rgbToHex, safeExecute, setAttributes, setStyles, supportsOffscreenCanvas, supportsTouch, throttle, throttleEnhanced, toPx } from './helpers.js';
export { CanvasContextCache, ComputationCache, DOMElementPool, GradientCache, MemoryMonitor, ObjectPool, SVGElementPool, canvasContextCache, domElementPool, gradientCache, memoryMonitor, svgElementPool } from './MemoryManager.js';
export { AnimationWrapper, DOMBatcher, domBatcher, rafController } from './RAFController.js';
export { AutoSavePlugin, LoggerPlugin, MiddlewareManager, PerformancePlugin, PluginManager, pluginManager } from './PluginSystem.js';
export { ProgressPredictor } from './ProgressPredictor.js';
export { ProgressComparator, ProgressSnapshotManager } from './ProgressSnapshot.js';
export { ProgressChain, ProgressGroup, ProgressSynchronizer } from './ProgressSynchronizer.js';
//# sourceMappingURL=index.js.map
