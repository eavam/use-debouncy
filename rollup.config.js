import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer';
import package_ from './package.json';

export default {
  input: './index.ts',
  output: [
    {
      file: package_.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: package_.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [...Object.keys(package_.dependencies || {})],
  plugins: [
    analyze(),
    typescript(),
    terser(), // minifies generated bundles
    commonjs(),
  ],
};
