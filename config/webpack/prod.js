const paths = require('../paths');
const { merge } = require('webpack-merge');
const common = require('./common');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    index: {
      import: `${paths.src}/ts/index.ts`,
    },
  },
  devtool: false,
  output: {
    filename: 'js/[name].[contenthash].bundle.js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),

    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
