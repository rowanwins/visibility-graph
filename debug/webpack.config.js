const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: './debug/src/main.js',
    output: {
        path: __dirname,
        publicPath: process.env.NODE_ENV === 'development' ? '/debug/' : 'https://rowanwins.github.io/visibility-graph/debug/',
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
                        options: {},
                    },
                ],
            },
            {
                  test: /\.ttf/,
                  use: [
                    {
                      loader: 'ttf-loader',
                      options: {
                        name: './font/[hash].[ext]',
                      },
                    },
                  ]
              },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }, {
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

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ])
}
