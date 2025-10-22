# Progress 辅助功能使用指南

本指南介绍 Progress Library v2.0 中新增的辅助功能模块。

---

## 📊 进度预测器（ProgressPredictor）

基于历史数据预测进度完成时间。

### 基本使用

```typescript
import { LinearProgress, ProgressPredictor } from '@ldesign/progress-core';

const progress = new LinearProgress('#container', { value: 0 });
const predictor = new ProgressPredictor();

// 记录进度数据
setInterval(() => {
  const currentValue = progress.getValue();
  predictor.record(currentValue);
  
  // 预测完成时间
  const prediction = predictor.predict(100);
  if (prediction) {
    console.log('预计剩余时间:', ProgressPredictor.formatRemainingTime(prediction.estimatedRemainingTime));
    console.log('预计完成时间:', ProgressPredictor.formatCompletionTime(prediction.estimatedCompletionTime));
    console.log('置信度:', (prediction.confidence * 100).toFixed(1) + '%');
  }
}, 1000);
```

### 预测结果

```typescript
interface PredictionResult {
  estimatedCompletionTime: number;  // 预计完成时间戳
  estimatedRemainingTime: number;   // 预计剩余时间（毫秒）
  currentSpeed: number;             // 当前速度
  averageSpeed: number;             // 平均速度
  confidence: number;               // 置信度（0-1）
}
```

### 配置选项

```typescript
// 最多保存 100 个历史数据点，最少需要 5 个数据点才能预测
const predictor = new ProgressPredictor(
  100,  // maxHistorySize
  5     // minDataPoints
);
```

### 实用方法

```typescript
// 获取趋势
const trend = predictor.getTrend(); // 'increasing' | 'decreasing' | 'stable'

// 获取历史数据
const history = predictor.getHistory();

// 清空数据
predictor.clear();
```

---

## 📸 快照与回放（ProgressSnapshotManager）

保存进度状态并支持回放。

### 基本使用

```typescript
import { LinearProgress, ProgressSnapshotManager } from '@ldesign/progress-core';

const progress = new LinearProgress('#container', { value: 0 });
const snapshotManager = new ProgressSnapshotManager();

// 创建快照
const snapshot1 = snapshotManager.createSnapshot(
  progress.getValue(),
  progress.getOptions(),
  { note: '开始阶段' }
);

// 稍后创建更多快照
progress.setValue(50);
const snapshot2 = snapshotManager.createSnapshot(
  progress.getValue(),
  progress.getOptions(),
  { note: '中间阶段' }
);

progress.setValue(100);
const snapshot3 = snapshotManager.createSnapshot(
  progress.getValue(),
  progress.getOptions(),
  { note: '完成阶段' }
);
```

### 回放快照

```typescript
// 回放所有快照
snapshotManager.playback(
  (snapshot) => {
    progress.setValue(snapshot.value, false);
    console.log('回放:', snapshot.metadata?.note);
  },
  {
    speed: 1,        // 播放速度
    loop: false,     // 是否循环
    onComplete: () => {
      console.log('回放完成');
    },
    onFrame: (snapshot, index) => {
      console.log(`帧 ${index}:`, snapshot.value);
    },
  }
);

// 停止回放
snapshotManager.stopPlayback();
```

### 导出/导入

```typescript
// 导出到 JSON
const json = snapshotManager.exportToJSON();

// 导入 JSON
snapshotManager.importFromJSON(json);

// 保存到 localStorage
snapshotManager.saveToLocalStorage('my-progress');

// 从 localStorage 加载
snapshotManager.loadFromLocalStorage('my-progress');
```

### 统计信息

```typescript
const stats = snapshotManager.getStatistics();
console.log('快照数量:', stats.count);
console.log('时间范围:', stats.timeRange);
console.log('平均间隔:', stats.avgInterval);
console.log('值范围:', stats.minValue, '-', stats.maxValue);
```

---

## 🔗 进度同步器（ProgressSynchronizer）

多个进度条同步更新。

### 主从模式

```typescript
import { LinearProgress, ProgressSynchronizer } from '@ldesign/progress-core';

const progress1 = new LinearProgress('#p1', { value: 0 });
const progress2 = new LinearProgress('#p2', { value: 0 });
const progress3 = new LinearProgress('#p3', { value: 0 });

const synchronizer = new ProgressSynchronizer({ mode: 'master-slave' });

synchronizer.add('master', progress1);
synchronizer.add('slave1', progress2);
synchronizer.add('slave2', progress3);

// 更新主进度，其他自动跟随
progress1.setValue(50);
synchronizer.sync('master');
```

### 平均值模式

```typescript
const synchronizer = new ProgressSynchronizer({ mode: 'average' });

// 所有进度条同步到平均值
synchronizer.sync();
```

### 最大/最小值模式

```typescript
// 同步到最大值
const syncMax = new ProgressSynchronizer({ mode: 'max' });
syncMax.sync();

// 同步到最小值
const syncMin = new ProgressSynchronizer({ mode: 'min' });
syncMin.sync();
```

### 值转换

```typescript
const synchronizer = new ProgressSynchronizer({
  mode: 'master-slave',
  transform: (value, instanceId) => {
    // 不同实例使用不同的转换规则
    if (instanceId === 'slave1') {
      return value * 0.8;  // 80%
    }
    return value;
  },
});
```

### 延迟同步

```typescript
const synchronizer = new ProgressSynchronizer({
  delay: 500,  // 延迟 500ms
});
```

---

## ⛓️ 进度链（ProgressChain）

一个完成后触发下一个。

### 基本使用

```typescript
import { LinearProgress, ProgressChain } from '@ldesign/progress-core';

const p1 = new LinearProgress('#p1', { value: 0, duration: 1000 });
const p2 = new LinearProgress('#p2', { value: 0, duration: 1000 });
const p3 = new LinearProgress('#p3', { value: 0, duration: 1000 });

const chain = new ProgressChain();

chain
  .add('step1', p1, 100)
  .add('step2', p2, 100)
  .add('step3', p3, 100);

// 开始执行链
chain.start(
  () => {
    console.log('所有步骤完成');
  },
  (index, id) => {
    console.log(`步骤 ${index} (${id}) 完成`);
  }
);
```

### 控制方法

```typescript
// 停止
chain.stop();

// 重置所有进度
chain.reset();

// 清空链
chain.clear();

// 检查状态
if (chain.isChainRunning()) {
  console.log('当前步骤:', chain.getCurrentIndex());
}
```

---

## 👥 进度组（ProgressGroup）

管理一组相关的进度条。

### 基本使用

```typescript
import { LinearProgress, ProgressGroup } from '@ldesign/progress-core';

const group = new ProgressGroup();

// 添加多个进度条
for (let i = 0; i < 5; i++) {
  const p = new LinearProgress(`#p${i}`, { value: 0 });
  group.add(`progress-${i}`, p);
}

// 全部设置为相同值
group.setAll(50);

// 全部增加
group.incrementAll(10);

// 全部重置
group.resetAll();

// 全部销毁
group.destroyAll();
```

### 统计方法

```typescript
// 获取平均值
const avg = group.getAverage();

// 获取总和
const sum = group.getSum();

// 获取最大值
const max = group.getMax();

// 获取最小值
const min = group.getMin();

// 获取所有值
const allValues = group.getAllValues();
allValues.forEach((value, id) => {
  console.log(`${id}: ${value}%`);
});
```

---

## 📊 进度比较器（ProgressComparator）

并排对比多个进度条。

### 基本使用

```typescript
import { ProgressComparator } from '@ldesign/progress-core';

const comparator = new ProgressComparator();

// 添加数据
setInterval(() => {
  comparator.addData('任务A', progress1.getValue());
  comparator.addData('任务B', progress2.getValue());
  comparator.addData('任务C', progress3.getValue());
}, 1000);

// 比较当前值
const current = comparator.compareCurrent();
current.forEach((value, name) => {
  console.log(`${name}: ${value}%`);
});

// 比较平均值
const average = comparator.compareAverage();

// 获取领先者
const leader = comparator.getLeader();
console.log('领先者:', leader);
```

---

## 🎯 完整示例

### 综合示例：带预测和快照的进度条

```typescript
import {
  LinearProgress,
  ProgressPredictor,
  ProgressSnapshotManager,
} from '@ldesign/progress-core';

// 创建进度条
const progress = new LinearProgress('#container', {
  value: 0,
  duration: 500,
});

// 创建预测器
const predictor = new ProgressPredictor();

// 创建快照管理器
const snapshotManager = new ProgressSnapshotManager();

// 模拟进度更新
let value = 0;
const interval = setInterval(() => {
  value += Math.random() * 5;
  if (value >= 100) {
    value = 100;
    clearInterval(interval);
  }

  // 更新进度
  progress.setValue(value);

  // 记录预测数据
  predictor.record(value);

  // 创建快照
  if (value % 20 < 5) {
    snapshotManager.createSnapshot(
      value,
      progress.getOptions(),
      { timestamp: new Date().toISOString() }
    );
  }

  // 显示预测
  const prediction = predictor.predict(100);
  if (prediction) {
    const remaining = ProgressPredictor.formatRemainingTime(
      prediction.estimatedRemainingTime
    );
    console.log(`预计剩余: ${remaining} (置信度: ${(prediction.confidence * 100).toFixed(1)}%)`);
  }
}, 1000);

// 完成后回放
progress.on('complete', () => {
  console.log('开始回放...');
  setTimeout(() => {
    snapshotManager.playback(
      (snapshot) => {
        progress.setValue(snapshot.value, false);
      },
      {
        speed: 2,
        onComplete: () => {
          console.log('回放完成');
        },
      }
    );
  }, 2000);
});
```

---

## 📝 最佳实践

### 1. 预测器使用建议

- 至少收集 3-5 个数据点后再开始预测
- 定期清理历史数据，避免内存占用过大
- 根据置信度判断预测准确性（> 0.7 较可靠）

### 2. 快照管理建议

- 合理设置最大快照数量（默认 100）
- 重要节点手动创建快照
- 定期保存到 localStorage 作为备份

### 3. 同步器使用建议

- 选择合适的同步模式
- 使用延迟同步避免频繁更新
- 为不同实例设置转换函数实现个性化同步

### 4. 进度链使用建议

- 确保每个步骤都有明确的完成回调
- 使用 onStepComplete 跟踪进度
- 提供停止/重置功能给用户

---

## 🎓 进阶技巧

### 组合使用

```typescript
// 同时使用预测器、快照和同步器
const predictor = new ProgressPredictor();
const snapshotManager = new ProgressSnapshotManager();
const synchronizer = new ProgressSynchronizer({ mode: 'average' });

// 添加多个进度条到同步器
progresses.forEach((p, i) => {
  synchronizer.add(`p${i}`, p);
});

// 统一监控
setInterval(() => {
  const avgValue = synchronizer.getAllValues();
  // 计算平均值
  const avg = Array.from(avgValue.values()).reduce((a, b) => a + b, 0) / avgValue.size;
  
  // 记录预测
  predictor.record(avg);
  
  // 创建快照
  if (avg % 25 < 1) {
    snapshotManager.createSnapshot(avg, {}, { milestone: true });
  }
}, 1000);
```

---

**提示**：所有辅助功能都可以独立使用，也可以组合使用以实现更强大的功能。



