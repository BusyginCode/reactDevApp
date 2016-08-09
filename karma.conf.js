"use strict";

const webpackConfig = require('./webpack.config.js');

module.exports = config => config.set({
  browsers: ['PhantomJS2'],
  singleRun: true,
  frameworks: ['jasmine'],
  exclude: [
    'src/ios/**',
    '*.native.*',
  ],
  files: [
    'tests.webpack.js',
  ],
  preprocessors: {
    'tests.webpack.js': ['webpack', /*'sourcemap'*/],
  },
  reporters: ['dots'],
  webpack: webpackConfig,
  webpackServer: {
    noInfo: true,
  },
});
