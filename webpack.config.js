const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV === 'development'
const otherPlugins = isDev ? [new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: 'static' })] : []

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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'learn-webpack',
      filename: 'index.html',
      template: 'index.html'
    }),
    ...otherPlugins
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    open: false
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
