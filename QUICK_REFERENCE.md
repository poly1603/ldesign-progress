# Progress Library v2.0 快速参考

> 最常用功能的快速查找手册

---

## 📦 安装

```bash
npm install @ldesign/progress-core@2.0.0
# 或
pnpm add @ldesign/progress-core@2.0.0
```

---

## 🚀 基础使用

### 1. 线性进度条
```typescript
import { LinearProgress } from '@ldesign/progress-core';
import '@ldesign/progress-core/dist/index.css';

const progress = new LinearProgress('#container', {
  value: 50,
  color: '#409eff',
});
```

### 2. 圆形进度条
```typescript
import { CircleProgress } from '@ldesign/progress-core';

const progress = new CircleProgress('#container', {
  value: 75,
  radius: 60,
  strokeWidth: 8,
});
```

### 3. 时间轴进度
```typescript
import { TimelineProgress } from '@ldesign/progress-core';

const timeline = new TimelineProgress('#container', {
  events: [
    { title: '开始', date: '2024-01', status: 'completed' },
    { title: '进行中', date: '2024-02', status: 'active' },
  ],
});
```

---

## 🎨 常用配置

### 颜色渐变
```typescript
color: ['#667eea', '#764ba2']  // 渐变色数组
```

### 显示文本
```typescript
showText: true,
format: (value) => `${value}% 完成`
```

### 动画设置
```typescript
animated: true,
duration: 500,
easing: 'easeOutQuad'
```

---

## 🔌 插件系统

### 使用内置插件
```typescript
import { pluginManager, LoggerPlugin } from '@ldesign/progress-core';

pluginManager.register(LoggerPlugin);
progress.usePlugin('logger');
```

### 自定义插件
```typescript
const MyPlugin = {
  name: 'my-plugin',
  hooks: {
    afterValueChange: (value) => {
      console.log('值已更新:', value);
    },
  },
};

pluginManager.register(MyPlugin);
progress.usePlugin('my-plugin');
```

---

## 🔗 中间件

### 值限制
```typescript
progress.addMiddleware((value, next) => {
  return next(Math.min(value, 80)); // 最大 80
});
```

### 日志记录
```typescript
progress.addMiddleware((value, next) => {
  const result = next(value);
  console.log(`进度: ${value} -> ${result}`);
  return result;
});
```

---

## 🎬 动画控制

```typescript
progress.setValue(100);  // 启动动画
progress.pause();        // 暂停
progress.resume();       // 恢复
progress.isAnimating();  // 检查状态
```

---

## 📊 进度预测

```typescript
import { ProgressPredictor } from '@ldesign/progress-core';

const predictor = new ProgressPredictor();

// 定期记录
setInterval(() => {
  predictor.record(progress.getValue());
  const prediction = predictor.predict(100);
  
  if (prediction) {
    console.log('剩余时间:', 
      ProgressPredictor.formatRemainingTime(
        prediction.estimatedRemainingTime
      )
    );
  }
}, 1000);
```

---

## 📸 快照回放

```typescript
import { ProgressSnapshotManager } from '@ldesign/progress-core';

const snapshots = new ProgressSnapshotManager();

// 创建快照
snapshots.createSnapshot(
  progress.getValue(),
  progress.getOptions()
);

// 回放
snapshots.playback((snapshot) => {
  progress.setValue(snapshot.value, false);
});
```

---

## 🔗 进度同步

```typescript
import { ProgressSynchronizer } from '@ldesign/progress-core';

const sync = new ProgressSynchronizer({ mode: 'average' });

sync.add('p1', progress1);
sync.add('p2', progress2);
sync.add('p3', progress3);

// 同步所有
sync.sync();
```

---

## ⛓️ 进度链

```typescript
import { ProgressChain } from '@ldesign/progress-core';

const chain = new ProgressChain();

chain
  .add('step1', progress1, 100)
  .add('step2', progress2, 100)
  .add('step3', progress3, 100)
  .start(() => console.log('全部完成'));
```

---

## 👥 进度组

```typescript
import { ProgressGroup } from '@ldesign/progress-core';

const group = new ProgressGroup();

group.add('p1', progress1);
group.add('p2', progress2);

group.setAll(50);         // 全部设为 50
group.incrementAll(10);   // 全部增加 10
group.resetAll();         // 全部重置
```

---

## 🎯 常用方法

### 基础操作
```typescript
progress.setValue(80);           // 设置值
progress.getValue();             // 获取值
progress.increment(10);          // 增加
progress.decrement(10);          // 减少
progress.reset();                // 重置
progress.destroy();              // 销毁
```

### 配置更新
```typescript
progress.updateOptions({
  color: '#67c23a',
  duration: 1000,
});
```

### 事件监听
```typescript
progress.on('change', (value) => {
  console.log('值变化:', value);
});

progress.on('complete', () => {
  console.log('完成!');
});
```

---

## 🎨 主题

### 使用预设主题
```typescript
theme: 'success'  // default, dark, primary, success, warning, error, info
```

### 自定义主题
```typescript
import { themeManager } from '@ldesign/progress-core';

themeManager.register({
  name: 'custom',
  colors: {
    primary: '#ff6b6b',
    success: '#51cf66',
    // ...
  },
  sizes: {
    small: 4,
    medium: 6,
    large: 8,
  },
});
```

---

## 📚 类型列表

### 基础类型
- `LinearProgress` - 线性
- `CircleProgress` - 圆形
- `SemiCircleProgress` - 半圆
- `DashboardProgress` - 仪表盘
- `StepProgress` - 步骤
- `SegmentProgress` - 分段
- `WaveProgress` - 波浪

### 高级类型
- `ImageProgress` - 图片
- `CustomShapeProgress` - 自定义形状
- `GaugeProgress` - 高级仪表盘
- `RingProgress` - 多环
- `PolygonProgress` - 多边形
- `BatteryProgress` - 电池
- `HeartProgress` - 心形
- `TimelineProgress` - 时间轴 ✨ NEW

---

## 💡 最佳实践

### 1. 性能优化
```typescript
// 批量更新时禁用动画
progress.setValue(value, false);

// 不需要时及时销毁
progress.destroy();
```

### 2. 内存管理
```typescript
// 组件卸载时销毁
componentWillUnmount() {
  progress.destroy();
}
```

### 3. 事件处理
```typescript
// 使用 once 避免重复触发
progress.once('complete', () => {
  // 只执行一次
});
```

---

## 🐛 常见问题

### Q: 如何让进度条自动增长？
```typescript
let value = 0;
const interval = setInterval(() => {
  value += 10;
  if (value >= 100) {
    clearInterval(interval);
    value = 100;
  }
  progress.setValue(value);
}, 1000);
```

### Q: 如何实现不确定状态？
```typescript
const progress = new LinearProgress('#container', {
  indeterminate: true,
});
```

### Q: 如何自定义文本格式？
```typescript
format: (value) => {
  if (value < 30) return '刚开始';
  if (value < 70) return '进行中';
  return '即将完成';
}
```

---

## 🔗 相关链接

- [完整文档](./README_V2.0.md)
- [API 文档](./docs/API.md)
- [辅助功能指南](./docs/HELPERS_GUIDE.md)
- [更新日志](./CHANGELOG_V2.0.md)
- [优化报告](./V2.0_OPTIMIZATION_REPORT.md)

---

**提示**：这只是常用功能的快速参考，完整功能请查看[完整文档](./README_V2.0.md)。



