const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  // {
  //   mode: 'development',
  //   entry: {
  //     index: './src/TreeGraph.ts'
  //   },
  //   devtool: false,
  //   resolve: {
  //     extensions: ['.tsx', '.ts', '.js']
  //   },
  //   output: {
  //     path: path.resolve(__dirname, 'lib'),
  //     filename: '[name].js',
  //     library: 'tree-graph',
  //     // libraryTarget: 'umd',
  //     // libraryExport: 'default'
  //   },
  //   // optimization: {
  //   //   splitChunks: {
  //   //     chunks: 'all'
  //   //   }
  //   // },
  //   module: {
  //     rules: [
  //       // ts-loader
  //       { test: /\.tsx?$/, loader: "ts-loader" }]
  //   },
  //   plugins: [
  //     new CleanWebpackPlugin()
  //   ]
  // },
  {
    mode: 'production',
    entry: {
      index: './src/TreeGraph.ts'
    },
    devtool: false,
    module: {
      rules: [
        // ts-loader
        { test: /\.tsx?$/, loader: "ts-loader" }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: '[name].js',
      library: 'tree-graph',
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    optimization: {
      splitChunks: {
        name: "commons",
        chunks: 'all'
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'common' // 指定公共 bundle 的名称。
      // })
    ]
  }];
