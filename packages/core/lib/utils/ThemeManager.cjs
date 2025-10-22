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

const defaultThemes = {
  default: {
    name: "default",
    colors: {
      primary: "#409eff",
      success: "#67c23a",
      warning: "#e6a23c",
      error: "#f56c6c",
      info: "#909399",
      track: "#e4e7ed",
      text: "#303133"
    },
    sizes: {
      small: 4,
      medium: 6,
      large: 8
    },
    borderRadius: "4px",
    shadow: "0 2px 4px rgba(0, 0, 0, 0.12)"
  },
  dark: {
    name: "dark",
    colors: {
      primary: "#409eff",
      success: "#67c23a",
      warning: "#e6a23c",
      error: "#f56c6c",
      info: "#909399",
      track: "#4c4d4f",
      text: "#e5eaf3"
    },
    sizes: {
      small: 4,
      medium: 6,
      large: 8
    },
    borderRadius: "4px",
    shadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
  },
  primary: {
    name: "primary",
    colors: {
      primary: "#409eff",
      success: "#67c23a",
      warning: "#e6a23c",
      error: "#f56c6c",
      info: "#909399",
      track: "#d3e3fd",
      text: "#303133"
    },
    sizes: {
      small: 4,
      medium: 6,
      large: 8
    },
    borderRadius: "4px",
    shadow: "0 2px 8px rgba(64, 158, 255, 0.2)"
  },
  success: {
    name: "success",
    colors: {
      primary: "#67c23a",
      success: "#67c23a",
      warning: "#e6a23c",
      error: "#f56c6c",
      info: "#909399",
      track: "#d9f0ce",
      text: "#303133"
    },
    sizes: {
      small: 4,
      medium: 6,
      large: 8
    },
    borderRadius: "4px",
    shadow: "0 2px 8px rgba(103, 194, 58, 0.2)"
  },
  warning: {
    name: "warning",
    colors: {
      primary: "#e6a23c",
      success: "#67c23a",
      warning: "#e6a23c",
      error: "#f56c6c",
      info: "#909399",
      track: "#f9e8d1",
      text: "#303133"
    },
    sizes: {
      small: 4,
      medium: 6,
      large: 8
    },
    borderRadius: "4px",
    shadow: "0 2px 8px rgba(230, 162, 60, 0.2)"
  },
  error: {
    name: "error",
    colors: {
      primary: "#f56c6c",
      success: "#67c23a",
      warning: "#e6a23c",
      error: "#f56c6c",
      info: "#909399",
      track: "#fde2e2",
      text: "#303133"
    },
    sizes: {
      small: 4,
      medium: 6,
      large: 8
    },
    borderRadius: "4px",
    shadow: "0 2px 8px rgba(245, 108, 108, 0.2)"
  },
  info: {
    name: "info",
    colors: {
      primary: "#909399",
      success: "#67c23a",
      warning: "#e6a23c",
      error: "#f56c6c",
      info: "#909399",
      track: "#e4e7ed",
      text: "#303133"
    },
    sizes: {
      small: 4,
      medium: 6,
      large: 8
    },
    borderRadius: "4px",
    shadow: "0 2px 8px rgba(144, 147, 153, 0.2)"
  }
};
class ThemeManager {
  constructor() {
    this.currentTheme = "default";
    this.themes = new Map(Object.entries(defaultThemes));
  }
  /**
   * 注册主题
   */
  register(theme) {
    this.themes.set(theme.name, theme);
  }
  /**
   * 获取主题
   */
  get(name) {
    return this.themes.get(name);
  }
  /**
   * 获取当前主题
   */
  getCurrent() {
    return this.themes.get(this.currentTheme) || defaultThemes.default;
  }
  /**
   * 设置当前主题
   */
  setCurrent(name) {
    if (this.themes.has(name)) {
      this.currentTheme = name;
    } else {
      console.warn(`Theme "${name}" not found, using default theme`);
    }
  }
  /**
   * 删除主题
   */
  remove(name) {
    if (name !== "default") {
      this.themes.delete(name);
      if (this.currentTheme === name) {
        this.currentTheme = "default";
      }
    }
  }
  /**
   * 获取所有主题名称
   */
  getThemeNames() {
    return Array.from(this.themes.keys());
  }
  /**
   * 应用主题到元素（通过CSS变量）
   */
  applyTheme(element, themeName) {
    const theme = themeName ? this.get(themeName) : this.getCurrent();
    if (!theme)
      return;
    const { colors, sizes, borderRadius, shadow } = theme;
    Object.entries(colors).forEach(([key, value]) => {
      element.style.setProperty(`--progress-color-${key}`, value);
    });
    Object.entries(sizes).forEach(([key, value]) => {
      element.style.setProperty(`--progress-size-${key}`, `${value}px`);
    });
    if (borderRadius) {
      element.style.setProperty("--progress-border-radius", borderRadius);
    }
    if (shadow) {
      element.style.setProperty("--progress-shadow", shadow);
    }
  }
  /**
   * 根据主题获取颜色
   */
  getColor(colorKey, themeName) {
    const theme = themeName ? this.get(themeName) : this.getCurrent();
    return theme?.colors[colorKey] || defaultThemes.default.colors[colorKey];
  }
  /**
   * 创建渐变色
   */
  createGradient(colors, direction = "to right") {
    if (colors.length === 1)
      return colors[0];
    return `linear-gradient(${direction}, ${colors.join(", ")})`;
  }
}
const themeManager = new ThemeManager();

exports.ThemeManager = ThemeManager;
exports.themeManager = themeManager;
//# sourceMappingURL=ThemeManager.cjs.map
