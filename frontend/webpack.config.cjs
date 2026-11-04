const path = require('node:path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = (_environment, arguments_) => {
  const isProduction = arguments_.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src/main.jsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'assets/[name].[contenthash:8].js',
      publicPath: '/',
      clean: true,
    },
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          resolve: {
            fullySpecified: false,
          },
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(
          process.env.REACT_APP_API_BASE_URL || '/api/v1',
        ),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        scriptLoading: 'defer',
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'assets/[name].[contenthash:8].css',
            }),
          ]
        : []),
    ],
    devServer: {
      host: 'localhost',
      port: 3000,
      open: false,
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'public'),
        publicPath: '/',
        serveIndex: false,
      },
      proxy: [
        {
          context: ['/api', '/uploads'],
          target: process.env.REACT_APP_API_PROXY_TARGET || 'http://localhost:5000',
          changeOrigin: true,
        },
      ],
    },
  };
};
