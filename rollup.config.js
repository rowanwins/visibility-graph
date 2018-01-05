import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/main.js',
  format: 'cjs',
  moduleName: 'hydology',
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs(),
    babel(babelrc())
    // uglify()
  ],
  sourceMap: true,
  dest: 'dist/hydrology.js'
}
