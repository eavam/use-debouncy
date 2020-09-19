import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import package_ from './package.json';

export default {
  input: './index.ts',
  external: ['react'],
  output: [
    {
      file: package_.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
    },
    {
      file: package_.module,
      format: 'es',
      sourcemap: true,
      exports: 'default',
    },
  ],
  // external: [...Object.keys(package_.dependencies || {})],
  plugins: [
    typescript(),
    terser({
      mangle: {
        properties: {
          reserved: ['useRef', 'useCallback', 'useEffect', 'current'],
        },
      },
    }), // minifies generated bundles
    commonjs(),
  ],
};
