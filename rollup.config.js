import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'dist/src/index.js',
    output: {
      file: 'build/pp-browser.min.js',
      format: 'iife',
      plugins: [terser()],
    },
  },
];
