'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: {
    app: './app.js',
  },

  output: {
    path: path.join(__dirname, '/'),
    filename: "bundle.js",
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      components: __dirname + '/components',
      stores: __dirname + '/stores',
    },
  },

  watch: true,

  module: {
    loaders: [
      {
        test: [/\.jsx$/, /\.js$/],
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          plugins: ['babel-plugin-add-module-exports', 'babel-plugin-transform-decorators-legacy'],
          // https://github.com/babel/babel-loader#options  'transform-decorators-legacy', "syntax-class-properties" npm i babel-plugin-transform-decorators-legacy
          presets: ['es2015', 'stage-0', 'react']
        }
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
    }),
  ],

  devtool: 'source-map'

}