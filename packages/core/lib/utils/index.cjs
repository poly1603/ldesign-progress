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

var EventEmitter = require('./EventEmitter.cjs');
var ConfigManager = require('./ConfigManager.cjs');
var AnimationController = require('./AnimationController.cjs');
var ThemeManager = require('./ThemeManager.cjs');
var helpers = require('./helpers.cjs');
var MemoryManager = require('./MemoryManager.cjs');
var RAFController = require('./RAFController.cjs');
var PluginSystem = require('./PluginSystem.cjs');
var ProgressPredictor = require('./ProgressPredictor.cjs');
var ProgressSnapshot = require('./ProgressSnapshot.cjs');
var ProgressSynchronizer = require('./ProgressSynchronizer.cjs');



exports.EventEmitter = EventEmitter.EventEmitter;
exports.ConfigManager = ConfigManager.ConfigManager;
exports.AnimationController = AnimationController.AnimationController;
exports.ThemeManager = ThemeManager.ThemeManager;
exports.themeManager = ThemeManager.themeManager;
exports.blendColors = helpers.blendColors;
exports.clamp = helpers.clamp;
exports.createBezierPath = helpers.createBezierPath;
exports.createElement = helpers.createElement;
exports.createFragment = helpers.createFragment;
exports.createSVGElement = helpers.createSVGElement;
exports.debounce = helpers.debounce;
exports.debounceEnhanced = helpers.debounceEnhanced;
exports.deepMerge = helpers.deepMerge;
exports.degToRad = helpers.degToRad;
exports.distance = helpers.distance;
exports.formatPercentage = helpers.formatPercentage;
exports.generateId = helpers.generateId;
exports.getComputedStyleValue = helpers.getComputedStyleValue;
exports.getContrastColor = helpers.getContrastColor;
exports.hexToRgb = helpers.hexToRgb;
exports.isMobile = helpers.isMobile;
exports.isValidColor = helpers.isValidColor;
exports.lerp = helpers.lerp;
exports.normalizeAngle = helpers.normalizeAngle;
exports.parseGradient = helpers.parseGradient;
exports.radToDeg = helpers.radToDeg;
exports.rgbToHex = helpers.rgbToHex;
exports.safeExecute = helpers.safeExecute;
exports.setAttributes = helpers.setAttributes;
exports.setStyles = helpers.setStyles;
exports.supportsOffscreenCanvas = helpers.supportsOffscreenCanvas;
exports.supportsTouch = helpers.supportsTouch;
exports.throttle = helpers.throttle;
exports.throttleEnhanced = helpers.throttleEnhanced;
exports.toPx = helpers.toPx;
exports.CanvasContextCache = MemoryManager.CanvasContextCache;
exports.ComputationCache = MemoryManager.ComputationCache;
exports.DOMElementPool = MemoryManager.DOMElementPool;
exports.GradientCache = MemoryManager.GradientCache;
exports.MemoryMonitor = MemoryManager.MemoryMonitor;
exports.ObjectPool = MemoryManager.ObjectPool;
exports.SVGElementPool = MemoryManager.SVGElementPool;
exports.canvasContextCache = MemoryManager.canvasContextCache;
exports.domElementPool = MemoryManager.domElementPool;
exports.gradientCache = MemoryManager.gradientCache;
exports.memoryMonitor = MemoryManager.memoryMonitor;
exports.svgElementPool = MemoryManager.svgElementPool;
exports.AnimationWrapper = RAFController.AnimationWrapper;
exports.DOMBatcher = RAFController.DOMBatcher;
exports.domBatcher = RAFController.domBatcher;
exports.rafController = RAFController.rafController;
exports.AutoSavePlugin = PluginSystem.AutoSavePlugin;
exports.LoggerPlugin = PluginSystem.LoggerPlugin;
exports.MiddlewareManager = PluginSystem.MiddlewareManager;
exports.PerformancePlugin = PluginSystem.PerformancePlugin;
exports.PluginManager = PluginSystem.PluginManager;
exports.pluginManager = PluginSystem.pluginManager;
exports.ProgressPredictor = ProgressPredictor.ProgressPredictor;
exports.ProgressComparator = ProgressSnapshot.ProgressComparator;
exports.ProgressSnapshotManager = ProgressSnapshot.ProgressSnapshotManager;
exports.ProgressChain = ProgressSynchronizer.ProgressChain;
exports.ProgressGroup = ProgressSynchronizer.ProgressGroup;
exports.ProgressSynchronizer = ProgressSynchronizer.ProgressSynchronizer;
//# sourceMappingURL=index.cjs.map
