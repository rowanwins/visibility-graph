import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import butternut from 'rollup-plugin-butternut'
import strip from 'rollup-plugin-strip'

export default {
  input: './src/main.js',
  output: {
    format: 'umd',
    name: 'visibilityGraph',
    file: 'dist/visibilityGraph.js'
  },
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    strip({
      functions: ['_renderSortedPoints', '_renderOpenEdges']
    }),
    butternut()
  ]

}
