import { BaseProgressOptions } from '../types';
import {
  EventEmitter,
  ConfigManager,
  AnimationController,
  themeManager,
  generateId,
  PluginManager,
  MiddlewareManager,
  memoryMonitor,
} from '../utils';

/**
 * 进度条基类 - 支持插件和中间件
 */
export abstract class ProgressBase<
  T extends BaseProgressOptions = BaseProgressOptions
> extends EventEmitter {
  protected container: HTMLElement;
  protected config: ConfigManager<T>;
  protected animator: AnimationController;
  protected pluginManager: PluginManager;
  protected valueMiddleware: MiddlewareManager<number>;
  protected id: string;
  protected currentValue: number;
  protected destroyed: boolean = false;

  constructor(container: HTMLElement | string, options?: Partial<T>) {
    super();

    // 初始化插件管理器和中间件
    this.pluginManager = new PluginManager();
    this.valueMiddleware = new MiddlewareManager<number>();

    // 插件钩子：beforeInit
    let processedOptions = this.pluginManager.callHook('beforeInit', options);
    if (processedOptions) {
      options = processedOptions;
    }

    // 初始化容器
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (!element) {
        throw new Error(`Container element "${container}" not found`);
      }
      this.container = element as HTMLElement;
    } else {
      this.container = container;
    }

    // 生成唯一ID
    this.id = generateId();
    this.container.setAttribute('data-progress-id', this.id);

    // 初始化配置管理器
    this.config = new ConfigManager<T>(this.getDefaultOptions());
    if (options) {
      this.config.setMultiple(options);
    }

    // 初始化动画控制器
    this.animator = new AnimationController();

    // 初始化当前值
    this.currentValue = this.config.get('value') ?? 0;

    // 应用主题
    const theme = this.config.get('theme');
    if (theme) {
      themeManager.applyTheme(this.container, theme);
    }

    // 设置事件监听
    this.setupEventListeners();

    // 内存监控
    memoryMonitor.register(this);

    // 插件钩子：afterInit
    this.pluginManager.callHook('afterInit', this);

    // 渲染
    this.render();
  }

  /**
   * 获取默认配置
   */
  protected getDefaultOptions(): Partial<T> {
    return {
      value: 0,
      min: 0,
      max: 100,
      animated: true,
      duration: 300,
      easing: 'easeOutQuad',
      showText: true,
      format: (value: number) => `${Math.round(value)}%`,
      theme: 'default',
      className: '',
    } as Partial<T>;
  }

  /**
   * 设置事件监听器
   */
  protected setupEventListeners(): void {
    const onChange = this.config.get('onChange');
    const onComplete = this.config.get('onComplete');
    const onStart = this.config.get('onStart');

    if (onChange) {
      this.on('change', onChange);
    }
    if (onComplete) {
      this.on('complete', onComplete);
    }
    if (onStart) {
      this.on('start', onStart);
    }
  }

  /**
   * 渲染（抽象方法，由子类实现）
   */
  protected abstract render(): void;

  /**
   * 更新进度值（抽象方法，由子类实现）
   */
  protected abstract updateProgress(value: number): void;

  /**
   * 设置进度值（支持中间件和插件钩子）
   */
  setValue(value: number, animated: boolean = this.config.get('animated') ?? true): void {
    if (this.destroyed) return;

    let normalizedValue = this.config.normalizeValue(value);
    const oldValue = this.currentValue;

    // 插件钩子：beforeValueChange
    const hookResult = this.pluginManager.callHook('beforeValueChange', oldValue, normalizedValue);
    if (typeof hookResult === 'number') {
      normalizedValue = hookResult;
    }

    // 中间件处理
    normalizedValue = this.valueMiddleware.execute(normalizedValue);

    // 再次标准化
    normalizedValue = this.config.normalizeValue(normalizedValue);

    if (oldValue === normalizedValue) return;

    // 触发开始事件
    if (oldValue === 0 || oldValue === this.config.get('min')) {
      this.emit('start');
    }

    if (animated && this.config.get('duration')! > 0) {
      this.animateValue(oldValue, normalizedValue);
    } else {
      this.currentValue = normalizedValue;
      this.updateProgress(normalizedValue);
      this.emit('change', normalizedValue);

      // 插件钩子：afterValueChange
      this.pluginManager.callHook('afterValueChange', normalizedValue);

      // 检查是否完成
      if (normalizedValue >= (this.config.get('max') ?? 100)) {
        this.emit('complete');
      }
    }
  }

  /**
   * 动画更新值
   */
  protected animateValue(from: number, to: number): void {
    this.animator.start({
      from,
      to,
      duration: this.config.get('duration') ?? 300,
      easing: this.config.get('easing'),
      onUpdate: (value) => {
        this.currentValue = value;
        this.updateProgress(value);
        this.emit('update', value);
      },
      onComplete: () => {
        this.emit('change', to);

        // 插件钩子：afterValueChange
        this.pluginManager.callHook('afterValueChange', to);

        if (to >= (this.config.get('max') ?? 100)) {
          this.emit('complete');
        }
      },
    });
  }

  /**
   * 获取当前值
   */
  getValue(): number {
    return this.currentValue;
  }

  /**
   * 获取百分比
   */
  getPercentage(): number {
    return this.config.getPercentage(this.currentValue);
  }

  /**
   * 增加值
   */
  increment(delta: number = 1): void {
    this.setValue(this.currentValue + delta);
  }

  /**
   * 减少值
   */
  decrement(delta: number = 1): void {
    this.setValue(this.currentValue - delta);
  }

  /**
   * 重置
   */
  reset(): void {
    this.setValue(this.config.get('min') ?? 0, false);
    this.animator.reset();
  }

  /**
   * 更新配置
   */
  updateOptions(options: Partial<T>): void {
    this.config.setMultiple(options);

    // 如果主题改变，重新应用
    if (options.theme) {
      themeManager.applyTheme(this.container, options.theme);
    }

    // 重新渲染
    this.render();

    // 如果值改变，更新进度
    if (options.value !== undefined) {
      this.setValue(options.value, false);
    }
  }

  /**
   * 获取配置
   */
  getOptions(): T {
    return this.config.getAll();
  }

  /**
   * 格式化显示文本
   */
  protected formatText(value: number): string {
    const formatter = this.config.get('format');
    if (formatter) {
      return formatter(this.config.getPercentage(value));
    }
    return `${Math.round(this.config.getPercentage(value))}%`;
  }

  /**
   * 销毁（完善内存清理）
   */
  destroy(): void {
    if (this.destroyed) return;

    // 插件钩子：beforeDestroy
    this.pluginManager.callHook('beforeDestroy', this);

    // 停止动画
    this.animator.stop();

    // 移除所有事件监听
    this.removeAllListeners();

    // 清空容器
    this.container.innerHTML = '';
    this.container.removeAttribute('data-progress-id');

    // 清空中间件
    this.valueMiddleware.clear();

    // 卸载所有插件
    this.pluginManager.getInstalledPlugins().forEach(name => {
      this.pluginManager.uninstall(name);
    });

    // 内存监控注销
    memoryMonitor.unregister(this);

    this.destroyed = true;
    this.emit('destroy');

    // 插件钩子：afterDestroy
    this.pluginManager.callHook('afterDestroy');
  }

  /**
   * 检查是否已销毁
   */
  isDestroyed(): boolean {
    return this.destroyed;
  }

  /**
   * 使用插件
   */
  usePlugin(pluginName: string): this {
    this.pluginManager.install(pluginName, this, this.getOptions());
    return this;
  }

  /**
   * 添加值更新中间件
   */
  addMiddleware(middleware: (value: number, next: (value: number) => number) => number): this {
    this.valueMiddleware.use(middleware);
    return this;
  }

  /**
   * 获取插件管理器
   */
  getPluginManager(): PluginManager {
    return this.pluginManager;
  }

  /**
   * 获取中间件管理器
   */
  getMiddlewareManager(): MiddlewareManager<number> {
    return this.valueMiddleware;
  }

  /**
   * 暂停动画
   */
  pause(): void {
    this.animator.pause();
  }

  /**
   * 恢复动画
   */
  resume(): void {
    this.animator.resume();
  }

  /**
   * 检查是否正在动画
   */
  isAnimating(): boolean {
    return this.animator.isAnimating();
  }
}


