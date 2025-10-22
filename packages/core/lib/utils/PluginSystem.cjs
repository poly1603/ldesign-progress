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

class PluginManager {
  constructor() {
    this.plugins = /* @__PURE__ */ new Map();
    this.installedPlugins = /* @__PURE__ */ new Set();
    this.context = {
      data: /* @__PURE__ */ new Map()
    };
  }
  /**
   * 注册插件
   */
  register(plugin) {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered.`);
      return;
    }
    this.plugins.set(plugin.name, plugin);
  }
  /**
   * 安装插件
   */
  install(pluginName, instance, options) {
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
  uninstall(pluginName) {
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
  isInstalled(pluginName) {
    return this.installedPlugins.has(pluginName);
  }
  /**
   * 获取所有已注册插件
   */
  getRegisteredPlugins() {
    return Array.from(this.plugins.keys());
  }
  /**
   * 获取所有已安装插件
   */
  getInstalledPlugins() {
    return Array.from(this.installedPlugins);
  }
  /**
   * 获取插件
   */
  getPlugin(pluginName) {
    return this.plugins.get(pluginName);
  }
  /**
   * 调用钩子
   */
  callHook(hookName, ...args) {
    const results = [];
    for (const pluginName of this.installedPlugins) {
      const plugin = this.plugins.get(pluginName);
      if (plugin?.hooks?.[hookName]) {
        try {
          const hook = plugin.hooks[hookName];
          const result = hook(...args);
          if (result !== void 0) {
            results.push(result);
          }
        } catch (error) {
          console.error(`Error calling hook "${hookName}" in plugin "${pluginName}":`, error);
        }
      }
    }
    return results.length > 0 ? results[results.length - 1] : args[args.length - 1];
  }
  /**
   * 设置上下文数据
   */
  setContextData(key, value) {
    this.context.data?.set(key, value);
  }
  /**
   * 获取上下文数据
   */
  getContextData(key) {
    return this.context.data?.get(key);
  }
  /**
   * 清空所有插件
   */
  clear() {
    const installed = Array.from(this.installedPlugins);
    installed.forEach((name) => this.uninstall(name));
    this.plugins.clear();
    this.installedPlugins.clear();
    this.context.data?.clear();
  }
}
class MiddlewareManager {
  constructor() {
    this.middlewares = [];
  }
  /**
   * 添加中间件
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }
  /**
   * 移除中间件
   */
  remove(middleware) {
    const index = this.middlewares.indexOf(middleware);
    if (index > -1) {
      this.middlewares.splice(index, 1);
    }
  }
  /**
   * 执行中间件链
   */
  execute(initialValue) {
    if (this.middlewares.length === 0) {
      return initialValue;
    }
    let index = 0;
    const next = (value) => {
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
  clear() {
    this.middlewares = [];
  }
  /**
   * 获取中间件数量
   */
  size() {
    return this.middlewares.length;
  }
}
const LoggerPlugin = {
  name: "logger",
  version: "1.0.0",
  description: "Logs all lifecycle events",
  hooks: {
    beforeInit: (options) => {
      console.log("[Logger] beforeInit:", options);
    },
    afterInit: (instance) => {
      console.log("[Logger] afterInit:", instance);
    },
    beforeValueChange: (oldValue, newValue) => {
      console.log("[Logger] beforeValueChange:", oldValue, "->", newValue);
    },
    afterValueChange: (value) => {
      console.log("[Logger] afterValueChange:", value);
    },
    beforeDestroy: (instance) => {
      console.log("[Logger] beforeDestroy:", instance);
    }
  }
};
const PerformancePlugin = {
  name: "performance",
  version: "1.0.0",
  description: "Monitors rendering performance",
  install: (context) => {
    context.data?.set("performance:renderTimes", []);
  },
  hooks: {
    beforeRender: () => {
      performance.mark("render-start");
    },
    afterRender: (instance) => {
      performance.mark("render-end");
      performance.measure("render", "render-start", "render-end");
      const measure = performance.getEntriesByName("render", "measure")[0];
      const renderTimes = instance.pluginManager?.getContextData("performance:renderTimes") || [];
      renderTimes.push(measure.duration);
      console.log("[Performance] Render time:", measure.duration.toFixed(2), "ms");
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
};
const AutoSavePlugin = {
  name: "autoSave",
  version: "1.0.0",
  description: "Automatically saves progress state",
  hooks: {
    afterValueChange: (value) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("progress:lastValue", String(value));
        localStorage.setItem("progress:lastUpdate", String(Date.now()));
      }
    }
  }
};
const pluginManager = new PluginManager();

exports.AutoSavePlugin = AutoSavePlugin;
exports.LoggerPlugin = LoggerPlugin;
exports.MiddlewareManager = MiddlewareManager;
exports.PerformancePlugin = PerformancePlugin;
exports.PluginManager = PluginManager;
exports.pluginManager = pluginManager;
//# sourceMappingURL=PluginSystem.cjs.map
