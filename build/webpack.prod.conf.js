const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(base, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin('style.css')
  ]
})
