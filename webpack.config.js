'use strict';

const nodeExternals = require('webpack-node-externals');

const path = 'dist';

const nodeOpts = {
  target: 'node',
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};

const cliConfig = Object.assign({}, nodeOpts, {
  entry: './src/cli.js',
  output: {
    path,
    filename: 'cli.js'
  }
});

const indexConfig = Object.assign({}, nodeOpts, {
  entry: './src/index.js',
  output: {
    path,
    filename: 'index.js'
  }
});

module.exports = [cliConfig, indexConfig];
