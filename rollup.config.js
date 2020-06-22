import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer';
import replace from '@rollup/plugin-replace';
import package_ from './package.json';

export default {
  input: './index.ts',
  output: [
    {
      file: package_.main,
      format: 'cjs',
    },
    {
      file: package_.module,
      format: 'es', // the preferred format
    },
  ],
  // external: [...Object.keys(package_.dependencies || {})],
  plugins: [
    analyze(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve(),
    commonjs(),
    typescript(),
    terser(), // minifies generated bundles
  ],
};
