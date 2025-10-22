# @ldesign/progress v2.0

> 功能全面、性能优越的进度条插件库 - 全新升级！

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/ldesign/progress)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

## 🎉 v2.0 重大更新

### ⚡ 性能提升

| 指标 | v1.1 | v2.0 | 提升 |
|------|------|------|------|
| 初始化时间 | 15ms | 8ms | **↑ 47%** |
| 内存占用 | 80KB | 45KB | **↓ 44%** |
| 100 实例 FPS | 45 | 60 | **↑ 33%** |
| gzip 包体积 | 28KB | 22KB | **↓ 21%** |

### ✨ 新特性

- 🔌 **插件系统** - 支持第三方扩展
- 🔗 **中间件系统** - 值更新拦截
- 📅 **TimelineProgress** - 全新时间轴进度条
- ⚡ **RAF 池化** - 共享动画循环
- 💾 **内存优化** - 对象池、WeakMap 缓存
- 🎬 **动画控制** - pause/resume 支持
- 🖥️ **OffscreenCanvas** - 离屏渲染优化
- 📘 **TypeScript Strict** - 严格类型检查

## 📦 安装

```bash
# 核心库（框架无关）
npm install @ldesign/progress-core@2.0.0

# Vue 3 封装
npm install @ldesign/progress-vue@2.0.0

# React 封装
npm install @ldesign/progress-react@2.0.0

# Lit Web Components 封装
npm install @ldesign/progress-lit@2.0.0
```

## 🚀 快速开始

### 基础使用

```typescript
import { LinearProgress } from '@ldesign/progress-core';
import '@ldesign/progress-core/dist/index.css';

const progress = new LinearProgress('#container', {
  value: 50,
  color: ['#667eea', '#764ba2'],
  animated: true,
});

// 更新进度
progress.setValue(80);
```

### 使用插件系统

```typescript
import { 
  LinearProgress, 
  pluginManager, 
  LoggerPlugin,
  PerformancePlugin 
} from '@ldesign/progress-core';

// 注册插件
pluginManager.register(LoggerPlugin);
pluginManager.register(PerformancePlugin);

// 创建进度条并使用插件
const progress = new LinearProgress('#container', { value: 0 });
progress.usePlugin('logger');
progress.usePlugin('performance');

// 更新值时会自动记录日志和性能数据
progress.setValue(100);
```

### 使用中间件

```typescript
// 添加值验证中间件
progress.addMiddleware((value, next) => {
  // 限制值在 0-80 之间
  const clampedValue = Math.min(Math.max(value, 0), 80);
  console.log(`Value clamped: ${value} -> ${clampedValue}`);
  return next(clampedValue);
});

// 添加日志中间件
progress.addMiddleware((value, next) => {
  const result = next(value);
  console.log(`Progress updated to ${result}%`);
  return result;
});
```

### 使用 TimelineProgress

```typescript
import { TimelineProgress } from '@ldesign/progress-core';

const timeline = new TimelineProgress('#container', {
  value: 50,
  layout: 'vertical',
  events: [
    {
      title: '项目启动',
      description: '完成立项和需求分析',
      date: '2024-01-01',
      status: 'completed',
      icon: '🚀',
    },
    {
      title: '设计阶段',
      description: 'UI/UX 设计和原型制作',
      date: '2024-02-01',
      status: 'active',
      icon: '🎨',
    },
    {
      title: '开发阶段',
      description: '核心功能开发',
      date: '2024-03-01',
      status: 'pending',
      icon: '💻',
    },
  ],
});

// 动态添加事件
timeline.addEvent({
  title: '测试阶段',
  date: '2024-04-01',
  status: 'pending',
});
```

### 动画控制

```typescript
const progress = new LinearProgress('#container', {
  value: 0,
  duration: 3000,
});

// 启动长动画
progress.setValue(100);

// 暂停动画
setTimeout(() => {
  progress.pause();
}, 1000);

// 2秒后恢复
setTimeout(() => {
  progress.resume();
}, 3000);

// 检查动画状态
if (progress.isAnimating()) {
  console.log('Animation is running');
}
```

## 📚 支持的进度条类型

### 基础类型（7 种）
- ✅ **LinearProgress** - 线性进度条
- ✅ **CircleProgress** - 圆形进度条
- ✅ **SemiCircleProgress** - 半圆进度条
- ✅ **DashboardProgress** - 仪表盘进度条
- ✅ **StepProgress** - 步骤进度条
- ✅ **SegmentProgress** - 分段进度条
- ✅ **WaveProgress** - 水波纹进度条

### 高级类型（7 种）
- ✅ **ImageProgress** - 图片进度条
- ✅ **CustomShapeProgress** - 自定义形状进度条
- ✅ **GaugeProgress** - 高级仪表盘
- ✅ **RingProgress** - 多环进度条
- ✅ **PolygonProgress** - 多边形进度条
- ✅ **BatteryProgress** - 电池进度条
- ✅ **HeartProgress** - 心形进度条

### v2.0 新增（1 种）
- 🆕 **TimelineProgress** - 时间轴进度条

## 🔌 插件系统

### 内置插件

#### LoggerPlugin
记录所有生命周期事件

```typescript
import { pluginManager, LoggerPlugin } from '@ldesign/progress-core';

pluginManager.register(LoggerPlugin);
progress.usePlugin('logger');
```

#### PerformancePlugin
监控渲染性能

```typescript
pluginManager.register(PerformancePlugin);
progress.usePlugin('performance');
```

#### AutoSavePlugin
自动保存进度到 localStorage

```typescript
pluginManager.register(AutoSavePlugin);
progress.usePlugin('autoSave');
```

### 自定义插件

```typescript
import { Plugin, PluginContext } from '@ldesign/progress-core';

const CustomPlugin: Plugin = {
  name: 'custom',
  version: '1.0.0',
  description: 'My custom plugin',
  
  hooks: {
    afterValueChange: (value) => {
      console.log('Custom plugin: value changed to', value);
    },
  },
  
  install: (context: PluginContext) => {
    console.log('Plugin installed', context);
  },
  
  uninstall: (context: PluginContext) => {
    console.log('Plugin uninstalled', context);
  },
};

pluginManager.register(CustomPlugin);
progress.usePlugin('custom');
```

## 🎯 API 参考

### 基础方法

```typescript
// 设置值
progress.setValue(80);
progress.setValue(80, false); // 禁用动画

// 获取值
const value = progress.getValue();

// 增减值
progress.increment(10);
progress.decrement(10);

// 重置
progress.reset();

// 销毁
progress.destroy();
```

### v2.0 新增方法

```typescript
// 动画控制
progress.pause();
progress.resume();
progress.isAnimating();

// 插件管理
progress.usePlugin('pluginName');
progress.getPluginManager();

// 中间件
progress.addMiddleware((value, next) => next(value));
progress.getMiddlewareManager();

// 配置更新
progress.updateOptions({ color: '#409eff' });
progress.getOptions();
```

## ⚡ 性能优化特性

### RAF 池化
所有进度条共享同一个 `requestAnimationFrame` 循环，大幅降低 CPU 使用率。

### 对象池
复用 DOM 和 SVG 元素，减少 GC 压力。

### WeakMap 缓存
自动 GC 的计算结果缓存，避免内存泄漏。

### OffscreenCanvas
支持离屏渲染，提升 Canvas 性能。

### 批量 DOM 操作
使用 `DocumentFragment` 和 `DOMBatcher` 减少重排重绘。

### 自动暂停
页面不可见时自动暂停所有动画，节省资源。

## 🔧 高级配置

### 完整配置示例

```typescript
const progress = new LinearProgress('#container', {
  // 基础配置
  value: 50,
  min: 0,
  max: 100,
  
  // 样式配置
  color: ['#667eea', '#764ba2'],
  trackColor: '#e4e7ed',
  theme: 'primary',
  strokeWidth: 6,
  
  // 动画配置
  animated: true,
  duration: 300,
  easing: 'easeOutQuad',
  
  // 显示配置
  showText: true,
  textInside: false,
  format: (value) => `${value}%`,
  
  // 事件回调
  onChange: (value) => console.log('Changed:', value),
  onComplete: () => console.log('Completed!'),
  onStart: () => console.log('Started!'),
});
```

## 📖 完整文档

- [API 文档](./docs/API.md)
- [进度条类型详解](./docs/ADVANCED_TYPES.md)
- [插件开发指南](./docs/PLUGIN_GUIDE.md)
- [性能优化指南](./docs/PERFORMANCE.md)
- [迁移指南](./MIGRATION_V2.md)
- [更新日志](./CHANGELOG_V2.0.md)

## 🌟 特性对比

| 特性 | v1.1 | v2.0 |
|------|------|------|
| 进度条类型 | 14 种 | 15 种 |
| 插件系统 | ❌ | ✅ |
| 中间件系统 | ❌ | ✅ |
| RAF 池化 | ❌ | ✅ |
| 对象池 | ❌ | ✅ |
| OffscreenCanvas | ❌ | ✅ |
| 动画控制 | 部分 | 完整 |
| TypeScript Strict | ❌ | ✅ |
| 内存监控 | ❌ | ✅ |
| 性能提升 | - | 30%+ |

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT © ldesign

## 🔗 相关链接

- [GitHub](https://github.com/ldesign/progress)
- [文档](https://progress.ldesign.dev)
- [在线示例](https://progress.ldesign.dev/examples)
- [更新日志](./CHANGELOG_V2.0.md)

---

**从 v1.x 升级？** 查看 [迁移指南](./MIGRATION_V2.md) 了解详情。

**需要帮助？** 提交 [Issue](https://github.com/ldesign/progress/issues) 或查看 [FAQ](./docs/FAQ.md)。




