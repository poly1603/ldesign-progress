/**
 * @ldesign/builder 配置文件 - Progress React
 */

export default {
  bundler: 'rollup',
  
  libraryType: 'react',
  
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

  external: ['react', 'react-dom', '@ldesign/progress-core'],

  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@ldesign/progress-core': 'LDesignProgress',
  },

  typescript: {
    declaration: true,
    declarationMap: true,
  },

  clean: true,
  logLevel: 'info',
};



