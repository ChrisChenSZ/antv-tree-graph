const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './examples/index.js',
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  // ts
  // resolve: {
  //   // Add '.ts' and '.tsx' as a resolvable extension.
  //   extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  // },
  module: {
    rules: [
      // ts-loader
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: ['file-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 10, modules: false },
          },

          'sass-loader', // 将 Sass 编译成 CSS
          'postcss-loader',
        ],
      },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: [
      //     'file-loader'
      //   ]
      // },

      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         // publicPath:path.resolve(__dirname, 'dist'),
      //         name:'[name]_[hash].[ext]',
      //         outputPath:'image/'
      //       }
      //     },
      //   ],
      // },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            // options: {
            //   limit: 100000
            // }
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new CleanWebpackPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: 'static',
        ignore: ['.*'],
      },
    ]),
    // 热模块更新
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    watchContentBase: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8002,
    open: true,
    hot: true,
    // hotOnly: true,
  },
};
