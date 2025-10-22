/**
 * @ldesign/builder 配置文件 - Progress Core
 */

export default {
  // 打包器选择（rollup 更稳定）
  bundler: 'rollup',
  
  // 输出配置
  output: {
    format: ['esm', 'cjs', 'umd'],
    esm: {
      dir: 'es',
      preserveStructure: true,
    },
    cjs: {
      dir: 'lib',
      preserveStructure: true,
    },
    umd: {
      dir: 'dist',
      name: 'LDesignProgress',
      minify: true,
    },
    sourcemap: true,
  },
  
  // 外部依赖（progress-core 无外部依赖）
  external: [],
  
  // TypeScript 配置
  typescript: {
    declaration: true,
    declarationMap: true,
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      strict: true,
      skipLibCheck: true,
    },
  },
  
  // CSS 配置
  css: {
    extract: true,
    minify: true,
  },
  
  // 清理输出目录
  clean: true,
  
  // 日志级别
  logLevel: 'info',
};



