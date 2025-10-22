/**
 * @ldesign/builder 配置文件 - Progress Lit
 */

export default {
  bundler: 'rollup',
  
  libraryType: 'lit',
  
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

  external: ['lit', '@ldesign/progress-core'],

  globals: {
    lit: 'Lit',
    '@ldesign/progress-core': 'LDesignProgress',
  },

  typescript: {
    declaration: true,
    declarationMap: true,
  },

  clean: true,
  logLevel: 'info',
};



