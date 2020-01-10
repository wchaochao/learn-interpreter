const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV === 'development'
console.log(process.env.NODE_ENV)
const otherPlugins = isDev ? [new BundleAnalyzerPlugin()] : []

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'learn-webpack',
      filename: 'index.html',
      template: 'index.html'
    }),
    ...otherPlugins
  ],
  devServer: {
    contentBase: './dist',
    open: true
  }
}
