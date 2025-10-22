/**
 * 基础配置选项
 */
export interface BaseProgressOptions {
  // 基础配置
  value?: number;
  min?: number;
  max?: number;
  size?: string | number;
  width?: string | number;
  height?: string | number;
  strokeWidth?: number;

  // 样式配置
  color?: string | string[];
  trackColor?: string;
  theme?: string;
  className?: string;

  // 动画配置
  animated?: boolean;
  duration?: number;
  easing?: EasingFunction | keyof typeof EasingFunctions;

  // 显示配置
  showText?: boolean;
  format?: (value: number) => string;
  textInside?: boolean;
  icon?: string | ((value: number) => string);

  // 功能配置
  indeterminate?: boolean;
  striped?: boolean;
  active?: boolean;

  // 事件回调
  onChange?: (value: number) => void;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: (value: number) => void;
}

/**
 * 线性进度条配置
 */
export interface LinearProgressOptions extends BaseProgressOptions {
  direction?: 'horizontal' | 'vertical';
  buffer?: number;
  segments?: SegmentConfig[];
}

/**
 * 圆形进度条配置
 */
export interface CircleProgressOptions extends BaseProgressOptions {
  radius?: number;
  clockwise?: boolean;
  startAngle?: number;
  lineCap?: 'round' | 'square' | 'butt';
}

/**
 * 半圆进度条配置
 */
export interface SemiCircleProgressOptions extends CircleProgressOptions {
  angleRange?: number;
  showScale?: boolean;
  scaleCount?: number;
}

/**
 * 仪表盘进度条配置
 */
export interface DashboardProgressOptions extends SemiCircleProgressOptions {
  showPointer?: boolean;
  colorRanges?: ColorRange[];
  warningZones?: WarningZone[];
}

/**
 * 步骤进度条配置
 */
export interface StepProgressOptions extends BaseProgressOptions {
  steps?: Step[];
  currentStep?: number;
  layout?: 'horizontal' | 'vertical';
  showDescription?: boolean;
}

/**
 * 分段进度条配置
 */
export interface SegmentProgressOptions extends BaseProgressOptions {
  segments?: SegmentConfig[];
  gap?: number;
}

/**
 * 水波纹进度条配置
 */
export interface WaveProgressOptions extends BaseProgressOptions {
  waveHeight?: number;
  waveCount?: number;
  waveSpeed?: number;
  renderMode?: 'canvas' | 'svg';
}

/**
 * 图片进度条配置
 */
export interface ImageProgressOptions extends BaseProgressOptions {
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  fillDirection?: 'horizontal' | 'vertical' | 'radial';
  maskMode?: boolean;
  objectFit?: 'fill' | 'contain' | 'cover';
}

/**
 * 自定义形状进度条配置
 */
export interface CustomShapeProgressOptions extends BaseProgressOptions {
  shapePath: string | ((width: number, height: number) => string);
  shapeWidth?: number;
  shapeHeight?: number;
  fillMode?: 'solid' | 'gradient' | 'pattern';
}

/**
 * 高级仪表盘配置
 */
export interface GaugeProgressOptions extends DashboardProgressOptions {
  showNumbers?: boolean;
  numberFormat?: (value: number) => string;
  tickCount?: number;
  showMinorTicks?: boolean;
  minorTickCount?: number;
  needleType?: 'arrow' | 'line' | 'triangle';
}

/**
 * 多环进度条配置
 */
export interface RingProgressOptions extends BaseProgressOptions {
  rings?: RingConfig[];
  ringGap?: number;
  baseRadius?: number;
}

/**
 * 多边形进度条配置
 */
export interface PolygonProgressOptions extends BaseProgressOptions {
  sides?: number;
  radius?: number;
  rotation?: number;
  fillMode?: 'edge' | 'area';
}

/**
 * 电池进度条配置
 */
export interface BatteryProgressOptions extends BaseProgressOptions {
  orientation?: 'horizontal' | 'vertical';
  batteryWidth?: number;
  batteryHeight?: number;
  showBoltIcon?: boolean;
  chargingColor?: string;
  lowBatteryThreshold?: number;
  lowBatteryColor?: string;
}

/**
 * 心形进度条配置
 */
export interface HeartProgressOptions extends BaseProgressOptions {
  heartSize?: number;
  fillMode?: 'bottom-up' | 'center-out' | 'pulse';
  beatAnimation?: boolean;
  beatSpeed?: number;
}

/**
 * 段配置
 */
export interface SegmentConfig {
  value: number;
  color?: string;
  label?: string;
}

/**
 * 颜色范围
 */
export interface ColorRange {
  min: number;
  max: number;
  color: string;
}

/**
 * 警告区域
 */
export interface WarningZone {
  min: number;
  max: number;
  color?: string;
}

/**
 * 步骤配置
 */
export interface Step {
  title?: string;
  description?: string;
  icon?: string;
  status?: 'completed' | 'active' | 'pending' | 'error';
}

/**
 * 环配置
 */
export interface RingConfig {
  value: number;
  color?: string;
  strokeWidth?: number;
  label?: string;
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    track: string;
    text: string;
  };
  sizes: {
    small: number;
    medium: number;
    large: number;
  };
  borderRadius?: string;
  shadow?: string;
}

/**
 * 缓动函数
 */
export type EasingFunction = (t: number) => number;

/**
 * 预设缓动函数
 */
export const EasingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

/**
 * 事件类型
 */
export type EventType = 'change' | 'complete' | 'start' | 'update' | 'destroy';

/**
 * 事件处理器
 */
export type EventHandler = (...args: any[]) => void;

/**
 * 时间轴进度条配置
 */
export interface TimelineProgressOptions extends BaseProgressOptions {
  layout?: 'vertical' | 'horizontal';
  events?: TimelineEvent[];
  showDates?: boolean;
  showConnector?: boolean;
  connectorStyle?: 'solid' | 'dashed' | 'dotted';
  eventSize?: number;
  spacing?: number;
}

/**
 * 时间轴事件
 */
export interface TimelineEvent {
  title?: string;
  description?: string;
  date?: string;
  icon?: string;
  color?: string;
  status?: 'completed' | 'active' | 'pending';
  customContent?: string | HTMLElement;
}

/**
 * PathProgress 配置
 */
export interface PathProgressOptions extends BaseProgressOptions {
  pathData: string;
  indicatorType?: 'circle' | 'arrow' | 'square' | 'none';
  indicatorSize?: number;
  showPath?: boolean;
  pathColor?: string;
}

/**
 * SparklineProgress 配置
 */
export interface SparklineProgressOptions extends BaseProgressOptions {
  data?: number[];
  lineColor?: string;
  fillColor?: string;
  smooth?: boolean;
  showDots?: boolean;
  dotSize?: number;
}

/**
 * GradientRingProgress 配置
 */
export interface GradientRingProgressOptions extends BaseProgressOptions {
  radius?: number;
  gradientColors?: string[];
  lineCap?: 'round' | 'square' | 'butt';
  rotate?: number;
}

/**
 * LiquidProgress 配置
 */
export interface LiquidProgressOptions extends BaseProgressOptions {
  shape?: 'circle' | 'square' | 'rounded';
  waveHeight?: number;
  waveSpeed?: number;
  liquidColor?: string;
  backgroundColor?: string;
}

/**
 * ParticleProgress 配置
 */
export interface ParticleProgressOptions extends BaseProgressOptions {
  particleCount?: number;
  particleSize?: number;
  particleSpeed?: number;
  particleColor?: string;
  trailLength?: number;
}

/**
 * 粒子
 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  trail?: Array<{ x: number; y: number }>;
}

/**
 * NeonProgress 配置
 */
export interface NeonProgressOptions extends BaseProgressOptions {
  neonColor?: string;
  glowIntensity?: number;
  flickerEffect?: boolean;
  tubeStyle?: boolean;
}

/**
 * RippleProgress 配置
 */
export interface RippleProgressOptions extends BaseProgressOptions {
  size?: number;
  rippleCount?: number;
  rippleSpeed?: number;
  rippleColor?: string;
  maxRadius?: number;
}

/**
 * 涟漪圆
 */
export interface RippleCircle {
  radius: number;
  alpha: number;
  maxRadius: number;
}

/**
 * SkeletonProgress 配置
 */
export interface SkeletonProgressOptions extends BaseProgressOptions {
  shimmerSpeed?: number;
  baseColor?: string;
  shimmerColor?: string;
  showShimmer?: boolean;
}

/**
 * CountdownProgress 配置
 */
export interface CountdownProgressOptions extends BaseProgressOptions {
  radius?: number;
  countdownDuration?: number;
  showTime?: boolean;
  timeFormat?: 'mm:ss' | 'ss' | 'mm';
  autoStart?: boolean;
}

/**
 * GlassProgress 配置
 */
export interface GlassProgressOptions extends BaseProgressOptions {
  blurAmount?: number;
  opacity?: number;
  glassColor?: string;
  borderColor?: string;
}

/**
 * GradientFlowProgress 配置
 */
export interface GradientFlowProgressOptions extends BaseProgressOptions {
  flowSpeed?: number;
  gradientColors?: string[];
}

/**
 * StackedProgress 配置
 */
export interface StackedProgressOptions extends BaseProgressOptions {
  layerCount?: number;
  layerOffset?: number;
  depth?: number;
  colors?: string[];
}

/**
 * 堆叠层
 */
export interface StackLayer {
  element: HTMLElement;
  offset: number;
  color: string;
}

/**
 * RadarProgress 配置
 */
export interface RadarProgressOptions extends BaseProgressOptions {
  size?: number;
  scanSpeed?: number;
  radarColor?: string;
  gridColor?: string;
  gridLines?: number;
  showGrid?: boolean;
}

/**
 * BubbleProgress 配置
 */
export interface BubbleProgressOptions extends BaseProgressOptions {
  bubbleColor?: string;
  bubbleCount?: number;
  bubbleSpeed?: number;
  backgroundColor?: string;
}

/**
 * 气泡
 */
export interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  alpha: number;
}

/**
 * SpiralProgress 配置
 */
export interface SpiralProgressOptions extends BaseProgressOptions {
  size?: number;
  turns?: number;
  innerRadius?: number;
  clockwise?: boolean;
}

/**
 * MetroProgress 配置
 */
export interface MetroProgressOptions extends BaseProgressOptions {
  layout?: 'horizontal' | 'vertical';
  stations?: MetroStation[];
  stationSize?: number;
  lineColor?: string;
  spacing?: number;
  showStationNames?: boolean;
}

/**
 * 地铁站点
 */
export interface MetroStation {
  name: string;
  status?: 'completed' | 'active' | 'pending';
  icon?: string;
  color?: string;
}

