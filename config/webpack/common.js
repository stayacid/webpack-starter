const paths = require('../paths');
const path = require('path');
const fs = require('fs')
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      templateParameters: {
        analytics: 'Google Analytics ID',
        author: 'author',
        publishedDate: '2021-07-02',
        description: 'description',
        keywords: 'keywords',
        title: 'Project',
        url: 'https://example.com',
      },
    })
  })
}

const htmlPlugins = generateHtmlPlugins(`${paths.src}/html/views`);

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-runtime',
    ],
  },
};

module.exports = {
  entry: `${paths.src}/ts/index.ts`,
  output: {
    path: paths.dist,
    filename: 'js/[name].bundle.js',
    publicPath: '/',
    clean: true,
    crossOriginLoading: 'anonymous',
    module: true,
    environment: {
      arrowFunction: true,
      bigIntLiteral: false,
      const: true,
      destructuring: true,
      dynamicImport: false,
      forOf: true,
    },
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, `${paths.src}/html/includes`),
        use: ['raw-loader']
      },
      // TypeScript
      {
        test: /.tsx?$/i,
        exclude: /node_modules/,
        use: [babelLoader, 'ts-loader'],
      },
      // CSS, SASS
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'sass-loader',
        ],
      },
      // static files
      {
        test: /\.(jpe?g|png|gif|eot|ttf|woff2?)$/i,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),

    new CopyPlugin({
      patterns: [
        {
          from: `${paths.src}/assets/static`,
          to: `${paths.dist}`,
        },
        {
          from: `${paths.src}/assets/img`,
          to: `${paths.dist}/img`,
        },
        {
          from: `${paths.src}/assets/svg/sprite`,
          to: `${paths.dist}/img/svg`,
        },
      ],
    }),
  ].concat(htmlPlugins)
};
