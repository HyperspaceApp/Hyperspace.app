import path from 'path'
import webpack from 'webpack'
const version = require('../../package.json').version
console.log('webpacking')
console.log(path.join(process.cwd(), 'js', 'rendererjs'))
export default {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      }
    ]
  },

  output: {
    path: path.resolve('./dist'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      'node_modules',
      path.join(process.cwd(), 'js'),
      path.join(process.cwd(), 'js', 'rendererjs')
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version),
      __DEV__: process.env.NODE_ENV !== 'production'
    }),

    new webpack.NamedModulesPlugin()
  ]
}
