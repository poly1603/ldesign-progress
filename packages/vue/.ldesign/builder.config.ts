/**
 * @ldesign/builder 配置文件 - Progress Vue
 */

export default {
  bundler: 'rollup',
  
  libraryType: 'vue3',
  
  output: {
    format: ['esm', 'cjs'],
    esm: {
      dir: 'es',
      preserveStructure: true,
    },
    cjs: {
      dir: 'lib',
      preserveStructure: true,
    },
    sourcemap: true,
  },

  external: ['vue', '@ldesign/progress-core'],

  globals: {
    vue: 'Vue',
    '@ldesign/progress-core': 'LDesignProgress',
  },

  vue: {
    version: 3,
  },

  typescript: {
    declaration: true,
    declarationMap: true,
  },

  clean: true,
  logLevel: 'info',
};



