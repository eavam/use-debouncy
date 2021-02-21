import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';
import package_ from './package.json';

const createConfig = (file) => ({
  input: `./src/${file}.ts`,
  external: ['react'],
  output: [
    {
      file: `${package_.main}/${file}.js`,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    },
    {
      file: `${package_.module}/${file}.js`,
      format: 'es',
      sourcemap: true,
      exports: 'auto',
    },
  ],
  plugins: [
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript'],
      production: true,
      enableLegacyBabel5ModuleInterop: true,
    }),
    terser({
      ecma: '5',
      mangle: {
        properties: {
          reserved: ['useRef', 'useCallback', 'useEffect', 'current'],
        },
      },
    }), // minifies generated bundles
    commonjs(),
  ],
});

export default ['index', 'effect', 'fn'].map((file) => createConfig(file));
