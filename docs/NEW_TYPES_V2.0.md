# Progress Library v2.0 新增进度条类型完整指南

> 从 15 种扩展到 31 种，翻倍的选择！

---

## 📊 总览

### 原有类型（15 种）
- LinearProgress, CircleProgress, SemiCircleProgress, DashboardProgress
- StepProgress, SegmentProgress, WaveProgress
- ImageProgress, CustomShapeProgress, GaugeProgress, RingProgress
- PolygonProgress, BatteryProgress, HeartProgress, TimelineProgress

### v2.0 新增（16 种）

#### 📋 计划中的 4 种
1. **PathProgress** - 路径进度
2. **SparklineProgress** - 迷你图进度
3. **GradientRingProgress** - 渐变环形
4. **LiquidProgress** - 液体填充

#### ✨ 创新的 12 种
5. **ParticleProgress** - 粒子流动
6. **NeonProgress** - 霓虹灯
7. **RippleProgress** - 涟漪扩散
8. **SkeletonProgress** - 骨架屏
9. **CountdownProgress** - 倒计时
10. **GlassProgress** - 毛玻璃
11. **GradientFlowProgress** - 渐变流动
12. **StackedProgress** - 3D 堆叠
13. **RadarProgress** - 雷达扫描
14. **BubbleProgress** - 气泡上升
15. **SpiralProgress** - 螺旋
16. **MetroProgress** - 地铁线路

---

## 1. PathProgress（路径进度）

沿自定义 SVG 路径运动的进度指示器。

### 基本使用
```typescript
import { PathProgress } from '@ldesign/progress-core';

const progress = new PathProgress('#container', {
  value: 50,
  pathData: 'M 10 80 Q 95 10 180 80', // 贝塞尔曲线
  indicatorType: 'circle',
  indicatorSize: 12,
  showPath: true,
});
```

### 配置选项
- `pathData`: SVG 路径数据（必需）
- `indicatorType`: 指示器类型（'circle' | 'arrow' | 'square' | 'none'）
- `indicatorSize`: 指示器大小
- `showPath`: 是否显示路径背景
- `pathColor`: 路径颜色

### 适用场景
- 自定义路线展示
- 游戏进度
- 动画效果

---

## 2. SparklineProgress（迷你图进度）

结合数据可视化的进度条。

### 基本使用
```typescript
import { SparklineProgress } from '@ldesign/progress-core';

const progress = new SparklineProgress('#container', {
  value: 75,
  data: [30, 45, 35, 50, 40, 60, 55, 70, 65, 75],
  lineColor: '#409eff',
  fillColor: 'rgba(64, 158, 255, 0.1)',
  smooth: true,
  showDots: true,
});
```

### 配置选项
- `data`: 数据点数组
- `lineColor`: 线条颜色
- `fillColor`: 填充颜色
- `smooth`: 是否平滑曲线
- `showDots`: 是否显示数据点
- `dotSize`: 数据点大小

### API 方法
```typescript
sparkline.setData([...]); // 设置数据
sparkline.addDataPoint(80); // 添加数据点
```

### 适用场景
- 数据趋势展示
- 股票图表
- 性能监控

---

## 3. GradientRingProgress（渐变环形）

圆锥渐变的高级环形进度条。

### 基本使用
```typescript
import { GradientRingProgress } from '@ldesign/progress-core';

const progress = new GradientRingProgress('#container', {
  value: 65,
  radius: 60,
  strokeWidth: 12,
  gradientColors: ['#ff0080', '#ff8c00', '#40e0d0', '#ff0080'],
});
```

### 配置选项
- `radius`: 半径
- `gradientColors`: 渐变颜色数组（彩虹色）
- `lineCap`: 线帽样式
- `rotate`: 旋转角度

### 适用场景
- 彩色进度展示
- 创意设计
- Dashboard

---

## 4. LiquidProgress（液体进度）

模拟液体填充效果。

### 基本使用
```typescript
import { LiquidProgress } from '@ldesign/progress-core';

const progress = new LiquidProgress('#container', {
  value: 60,
  shape: 'circle',
  waveHeight: 8,
  waveSpeed: 0.03,
  liquidColor: '#409eff',
});
```

### 配置选项
- `shape`: 容器形状（'circle' | 'square' | 'rounded'）
- `waveHeight`: 波浪高度
- `waveSpeed`: 波浪速度
- `liquidColor`: 液体颜色
- `backgroundColor`: 背景颜色

### 适用场景
- 水位显示
- 容量展示
- 创意动画

---

## 5. ParticleProgress（粒子流动）

粒子从起点流向终点。

### 基本使用
```typescript
import { ParticleProgress } from '@ldesign/progress-core';

const progress = new ParticleProgress('#container', {
  value: 70,
  particleCount: 50,
  particleSize: 3,
  particleSpeed: 2,
  particleColor: '#409eff',
  trailLength: 5,
});
```

### 配置选项
- `particleCount`: 粒子数量
- `particleSize`: 粒子大小
- `particleSpeed`: 粒子速度
- `particleColor`: 粒子颜色
- `trailLength`: 轨迹长度

### 适用场景
- 数据传输
- 流程动画
- 创意效果

---

## 6. NeonProgress（霓虹灯）

霓虹灯管发光效果。

### 基本使用
```typescript
import { NeonProgress } from '@ldesign/progress-core';

const progress = new NeonProgress('#container', {
  value: 55,
  neonColor: '#00ffff',
  glowIntensity: 3,
  flickerEffect: true,
  tubeStyle: true,
});
```

### 配置选项
- `neonColor`: 霓虹灯颜色
- `glowIntensity`: 发光强度（1-5）
- `flickerEffect`: 闪烁效果
- `tubeStyle`: 灯管样式

### 适用场景
- 暗色主题
- 游戏界面
- 夜间模式

---

## 7. RippleProgress（涟漪扩散）

涟漪从中心向外扩散。

### 基本使用
```typescript
import { RippleProgress } from '@ldesign/progress-core';

const progress = new RippleProgress('#container', {
  value: 45,
  size: 150,
  rippleCount: 3,
  rippleSpeed: 0.5,
  rippleColor: '#409eff',
});
```

### 配置选项
- `size`: 容器尺寸
- `rippleCount`: 涟漪数量
- `rippleSpeed`: 扩散速度
- `rippleColor`: 涟漪颜色
- `maxRadius`: 最大半径

### 适用场景
- 触摸反馈
- 加载动画
- 扩散效果

---

## 8. SkeletonProgress（骨架屏）

骨架屏加载占位符。

### 基本使用
```typescript
import { SkeletonProgress } from '@ldesign/progress-core';

const progress = new SkeletonProgress('#container', {
  value: 30,
  shimmerSpeed: 1.5,
  baseColor: '#e4e7ed',
  shimmerColor: '#f5f7fa',
  showShimmer: true,
});
```

### 配置选项
- `shimmerSpeed`: 闪光速度
- `baseColor`: 基础颜色
- `shimmerColor`: 闪光颜色
- `showShimmer`: 是否显示闪光

### 适用场景
- 内容加载
- 占位符
- 等待动画

---

## 9. CountdownProgress（倒计时）

倒计时进度条。

### 基本使用
```typescript
import { CountdownProgress } from '@ldesign/progress-core';

const progress = new CountdownProgress('#container', {
  countdownDuration: 60, // 60 秒
  showTime: true,
  timeFormat: 'mm:ss',
  autoStart: true,
});

// 手动控制
progress.start(); // 开始
progress.stop();  // 停止
```

### 配置选项
- `countdownDuration`: 倒计时时长（秒）
- `showTime`: 显示时间
- `timeFormat`: 时间格式（'mm:ss' | 'ss' | 'mm'）
- `autoStart`: 自动开始

### 适用场景
- 定时任务
- 考试计时
- 活动倒计时

---

## 10. GlassProgress（毛玻璃）

毛玻璃效果进度条。

### 基本使用
```typescript
import { GlassProgress } from '@ldesign/progress-core';

const progress = new GlassProgress('#container', {
  value: 60,
  blurAmount: 10,
  opacity: 0.7,
  glassColor: 'rgba(255, 255, 255, 0.2)',
  borderColor: 'rgba(255, 255, 255, 0.3)',
});
```

### 配置选项
- `blurAmount`: 模糊程度
- `opacity`: 透明度
- `glassColor`: 玻璃颜色
- `borderColor`: 边框颜色

### 适用场景
- 现代 UI
- iOS 风格
- 半透明效果

---

## 11. GradientFlowProgress（渐变流动）

动态渐变流动效果。

### 基本使用
```typescript
import { GradientFlowProgress } from '@ldesign/progress-core';

const progress = new GradientFlowProgress('#container', {
  value: 50,
  flowSpeed: 0.5,
  gradientColors: ['#ff0080', '#ff8c00', '#40e0d0', '#ff0080'],
});
```

### 配置选项
- `flowSpeed`: 流动速度
- `gradientColors`: 渐变颜色数组

### 适用场景
- 彩虹进度
- 动态背景
- 创意动画

---

## 12. StackedProgress（3D 堆叠）

3D 堆叠效果进度条。

### 基本使用
```typescript
import { StackedProgress } from '@ldesign/progress-core';

const progress = new StackedProgress('#container', {
  value: 65,
  layerCount: 3,
  layerOffset: 5,
  depth: 10,
  colors: ['#409eff', '#67c23a', '#e6a23c'],
});
```

### 配置选项
- `layerCount`: 层数
- `layerOffset`: 层间距
- `depth`: 景深
- `colors`: 每层颜色

### 适用场景
- 3D 效果
- 多层数据
- 创意设计

---

## 13. RadarProgress（雷达扫描）

雷达扫描动画。

### 基本使用
```typescript
import { RadarProgress } from '@ldesign/progress-core';

const progress = new RadarProgress('#container', {
  value: 75,
  size: 200,
  scanSpeed: 2,
  radarColor: '#00ff00',
  gridLines: 4,
  showGrid: true,
});
```

### 配置选项
- `size`: 雷达尺寸
- `scanSpeed`: 扫描速度
- `radarColor`: 雷达颜色
- `gridColor`: 网格颜色
- `gridLines`: 网格线数量
- `showGrid`: 显示网格

### 适用场景
- 检测动画
- 扫描效果
- 监控界面

---

## 14. BubbleProgress（气泡上升）

气泡从底部上升。

### 基本使用
```typescript
import { BubbleProgress } from '@ldesign/progress-core';

const progress = new BubbleProgress('#container', {
  value: 60,
  width: 150,
  height: 300,
  bubbleColor: 'rgba(64, 158, 255, 0.6)',
  bubbleCount: 20,
  bubbleSpeed: 2,
});
```

### 配置选项
- `bubbleColor`: 气泡颜色
- `bubbleCount`: 气泡数量
- `bubbleSpeed`: 上升速度
- `backgroundColor`: 背景颜色

### 适用场景
- 加载动画
- 水位显示
- 创意效果

---

## 15. SpiralProgress（螺旋）

螺旋形路径进度。

### 基本使用
```typescript
import { SpiralProgress } from '@ldesign/progress-core';

const progress = new SpiralProgress('#container', {
  value: 75,
  size: 200,
  turns: 3,
  innerRadius: 20,
  clockwise: true,
});
```

### 配置选项
- `size`: 尺寸
- `turns`: 螺旋圈数
- `innerRadius`: 内半径
- `clockwise`: 顺时针

### 适用场景
- 螺旋动画
- 创意设计
- 特殊效果

---

## 16. MetroProgress（地铁线路）

地铁站点样式进度条。

### 基本使用
```typescript
import { MetroProgress } from '@ldesign/progress-core';

const progress = new MetroProgress('#container', {
  value: 50,
  layout: 'horizontal',
  stations: [
    { name: '起点站', status: 'completed' },
    { name: '中转站', status: 'active' },
    { name: '目的地', status: 'pending' },
  ],
  showStationNames: true,
});
```

### 配置选项
- `layout`: 布局（'horizontal' | 'vertical'）
- `stations`: 站点数组
- `stationSize`: 站点大小
- `lineColor`: 线路颜色
- `spacing`: 站点间距
- `showStationNames`: 显示站点名称

### API 方法
```typescript
metro.setStations([...]); // 设置站点
```

### 适用场景
- 步骤流程
- 旅程展示
- 路线规划

---

## 🎯 使用建议

### 选择指南

| 场景 | 推荐类型 |
|------|---------|
| 文件上传 | LinearProgress, ParticleProgress |
| 数据加载 | SkeletonProgress, LiquidProgress |
| 任务进度 | StepProgress, MetroProgress, TimelineProgress |
| 倒计时 | CountdownProgress, CircleProgress |
| 数据展示 | SparklineProgress, DashboardProgress |
| 创意动画 | NeonProgress, RippleProgress, SpiralProgress |
| 暗色主题 | NeonProgress, RadarProgress |
| 现代 UI | GlassProgress, GradientFlowProgress |

### 性能考虑

**高性能（适合大量实例）：**
- LinearProgress
- CircleProgress
- StepProgress

**中等性能（适合少量实例）：**
- PathProgress
- SparklineProgress
- SkeletonProgress

**动画密集（建议限制数量）：**
- ParticleProgress
- BubbleProgress
- RadarProgress
- LiquidProgress

---

## 📦 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="@ldesign/progress-core/dist/index.css">
</head>
<body>
  <div id="path"></div>
  <div id="sparkline"></div>
  <div id="liquid"></div>
  <!-- 更多容器... -->

  <script src="@ldesign/progress-core/dist/index.js"></script>
  <script>
    const {
      PathProgress,
      SparklineProgress,
      LiquidProgress,
      // ... 导入其他类型
    } = LDesignProgress;

    // 创建各种进度条
    const path = new PathProgress('#path', {
      value: 50,
      pathData: 'M 10 80 Q 95 10 180 80',
    });

    const sparkline = new SparklineProgress('#sparkline', {
      value: 75,
      data: [30, 45, 50, 60, 70, 75],
    });

    const liquid = new LiquidProgress('#liquid', {
      value: 60,
      shape: 'circle',
    });
  </script>
</body>
</html>
```

---

## 🚀 快速对比

| 类型 | 动画 | 复杂度 | 适用场景 |
|------|------|--------|---------|
| PathProgress | 中 | 中 | 路径动画 |
| SparklineProgress | 低 | 中 | 数据展示 |
| GradientRingProgress | 低 | 低 | 彩色进度 |
| LiquidProgress | 高 | 高 | 液体效果 |
| ParticleProgress | 高 | 高 | 粒子动画 |
| NeonProgress | 中 | 低 | 霓虹效果 |
| RippleProgress | 高 | 中 | 涟漪效果 |
| SkeletonProgress | 低 | 低 | 加载占位 |
| CountdownProgress | 低 | 中 | 倒计时 |
| GlassProgress | 低 | 低 | 毛玻璃 |
| GradientFlowProgress | 中 | 低 | 流动渐变 |
| StackedProgress | 中 | 中 | 3D 效果 |
| RadarProgress | 高 | 高 | 雷达扫描 |
| BubbleProgress | 高 | 高 | 气泡动画 |
| SpiralProgress | 中 | 中 | 螺旋效果 |
| MetroProgress | 低 | 中 | 线路图 |

---

**总计：31 种进度条类型，满足所有需求！** 🎉



