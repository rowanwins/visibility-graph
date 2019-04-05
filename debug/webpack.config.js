const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = function (env, argv) {
  // const pp = argv.mode === 'development' ? '/debug/' : 'https://rowanwins.github.io/visibility-graph/debug/'
  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'build.js',
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: 'json-loader'
        },
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        },
        {
          test: /\.(png|jpg|ttf|gif|woff|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ],
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true,
      openPage: 'debug/index.html'
    },
    performance: {
      hints: false
    },
    devtool: '#eval-source-map'
  }
}
