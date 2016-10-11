'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: {
    app: './index.js',
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
      classes: __dirname + '/classes'
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
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      TestUtils: 'react-addons-test-utils'
    }),
  ],

  devtool: 'source-map'

}