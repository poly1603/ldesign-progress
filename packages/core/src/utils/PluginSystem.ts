/**
 * 插件系统 - 支持第三方扩展
 */

import { BaseProgressOptions } from '../types';

/**
 * 插件生命周期钩子
 */
export interface PluginHooks {
  /** 进度条初始化前 */
  beforeInit?: (options: Partial<BaseProgressOptions>) => void | Partial<BaseProgressOptions>;
  /** 进度条初始化后 */
  afterInit?: (instance: any) => void;
  /** 渲染前 */
  beforeRender?: (instance: any) => void;
  /** 渲染后 */
  afterRender?: (instance: any) => void;
  /** 值更新前 */
  beforeValueChange?: (oldValue: number, newValue: number) => number | void;
  /** 值更新后 */
  afterValueChange?: (value: number) => void;
  /** 销毁前 */
  beforeDestroy?: (instance: any) => void;
  /** 销毁后 */
  afterDestroy?: () => void;
}

/**
 * 插件接口
 */
export interface Plugin {
  /** 插件名称 */
  name: string;
  /** 插件版本 */
  version?: string;
  /** 插件描述 */
  description?: string;
  /** 生命周期钩子 */
  hooks?: PluginHooks;
  /** 安装方法 */
  install?: (context: PluginContext) => void;
  /** 卸载方法 */
  uninstall?: (context: PluginContext) => void;
}

/**
 * 插件上下文
 */
export interface PluginContext {
  /** 进度条实例 */
  instance?: any;
  /** 配置选项 */
  options?: Partial<BaseProgressOptions>;
  /** 共享数据 */
  data?: Map<string, any>;
}

/**
 * 插件管理器
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private installedPlugins: Set<string> = new Set();
  private context: PluginContext = {
    data: new Map(),
  };

  /**
   * 注册插件
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered.`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
  }

  /**
   * 安装插件
   */
  install(pluginName: string, instance?: any, options?: Partial<BaseProgressOptions>): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.error(`Plugin "${pluginName}" not found.`);
      return;
    }

    if (this.installedPlugins.has(pluginName)) {
      console.warn(`Plugin "${pluginName}" is already installed.`);
      return;
    }

    this.context.instance = instance;
    this.context.options = options;

    if (plugin.install) {
      plugin.install(this.context);
    }

    this.installedPlugins.add(pluginName);
  }

  /**
   * 卸载插件
   */
  uninstall(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.error(`Plugin "${pluginName}" not found.`);
      return;
    }

    if (!this.installedPlugins.has(pluginName)) {
      console.warn(`Plugin "${pluginName}" is not installed.`);
      return;
    }

    if (plugin.uninstall) {
      plugin.uninstall(this.context);
    }

    this.installedPlugins.delete(pluginName);
  }

  /**
   * 检查插件是否已安装
   */
  isInstalled(pluginName: string): boolean {
    return this.installedPlugins.has(pluginName);
  }

  /**
   * 获取所有已注册插件
   */
  getRegisteredPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * 获取所有已安装插件
   */
  getInstalledPlugins(): string[] {
    return Array.from(this.installedPlugins);
  }

  /**
   * 获取插件
   */
  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * 调用钩子
   */
  callHook<K extends keyof PluginHooks>(
    hookName: K,
    ...args: Parameters<NonNullable<PluginHooks[K]>>
  ): any {
    const results: any[] = [];

    for (const pluginName of this.installedPlugins) {
      const plugin = this.plugins.get(pluginName);
      if (plugin?.hooks?.[hookName]) {
        try {
          const hook = plugin.hooks[hookName] as any;
          const result = hook(...args);
          if (result !== undefined) {
            results.push(result);
          }
        } catch (error) {
          console.error(`Error calling hook "${hookName}" in plugin "${pluginName}":`, error);
        }
      }
    }

    // 返回最后一个有效结果，用于钩子链
    return results.length > 0 ? results[results.length - 1] : args[args.length - 1];
  }

  /**
   * 设置上下文数据
   */
  setContextData(key: string, value: any): void {
    this.context.data?.set(key, value);
  }

  /**
   * 获取上下文数据
   */
  getContextData(key: string): any {
    return this.context.data?.get(key);
  }

  /**
   * 清空所有插件
   */
  clear(): void {
    // 卸载所有已安装插件
    const installed = Array.from(this.installedPlugins);
    installed.forEach(name => this.uninstall(name));

    this.plugins.clear();
    this.installedPlugins.clear();
    this.context.data?.clear();
  }
}

/**
 * 中间件函数类型
 */
export type Middleware<T = any> = (
  value: T,
  next: (value: T) => T
) => T;

/**
 * 中间件管理器
 */
export class MiddlewareManager<T = any> {
  private middlewares: Middleware<T>[] = [];

  /**
   * 添加中间件
   */
  use(middleware: Middleware<T>): void {
    this.middlewares.push(middleware);
  }

  /**
   * 移除中间件
   */
  remove(middleware: Middleware<T>): void {
    const index = this.middlewares.indexOf(middleware);
    if (index > -1) {
      this.middlewares.splice(index, 1);
    }
  }

  /**
   * 执行中间件链
   */
  execute(initialValue: T): T {
    if (this.middlewares.length === 0) {
      return initialValue;
    }

    let index = 0;

    const next = (value: T): T => {
      if (index >= this.middlewares.length) {
        return value;
      }

      const middleware = this.middlewares[index++];
      return middleware(value, next);
    };

    return next(initialValue);
  }

  /**
   * 清空所有中间件
   */
  clear(): void {
    this.middlewares = [];
  }

  /**
   * 获取中间件数量
   */
  size(): number {
    return this.middlewares.length;
  }
}

// 内置插件示例

/**
 * 日志插件 - 记录所有生命周期事件
 */
export const LoggerPlugin: Plugin = {
  name: 'logger',
  version: '1.0.0',
  description: 'Logs all lifecycle events',
  hooks: {
    beforeInit: (options) => {
      console.log('[Logger] beforeInit:', options);
    },
    afterInit: (instance) => {
      console.log('[Logger] afterInit:', instance);
    },
    beforeValueChange: (oldValue, newValue) => {
      console.log('[Logger] beforeValueChange:', oldValue, '->', newValue);
    },
    afterValueChange: (value) => {
      console.log('[Logger] afterValueChange:', value);
    },
    beforeDestroy: (instance) => {
      console.log('[Logger] beforeDestroy:', instance);
    },
  },
};

/**
 * 性能监控插件 - 监控渲染性能
 */
export const PerformancePlugin: Plugin = {
  name: 'performance',
  version: '1.0.0',
  description: 'Monitors rendering performance',
  install: (context) => {
    context.data?.set('performance:renderTimes', []);
  },
  hooks: {
    beforeRender: () => {
      performance.mark('render-start');
    },
    afterRender: (instance) => {
      performance.mark('render-end');
      performance.measure('render', 'render-start', 'render-end');

      const measure = performance.getEntriesByName('render', 'measure')[0];
      const renderTimes = instance.pluginManager?.getContextData('performance:renderTimes') || [];
      renderTimes.push(measure.duration);

      console.log('[Performance] Render time:', measure.duration.toFixed(2), 'ms');

      performance.clearMarks();
      performance.clearMeasures();
    },
  },
};

/**
 * 自动保存插件 - 自动保存进度状态
 */
export const AutoSavePlugin: Plugin = {
  name: 'autoSave',
  version: '1.0.0',
  description: 'Automatically saves progress state',
  hooks: {
    afterValueChange: (value) => {
      // 保存到 localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('progress:lastValue', String(value));
        localStorage.setItem('progress:lastUpdate', String(Date.now()));
      }
    },
  },
};

// 导出单例
export const pluginManager = new PluginManager();




