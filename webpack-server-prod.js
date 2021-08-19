const path = require('path')
const nodeExternals = require('webpack-node-externals')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const ServerMessage = require('./plugins/server-message')
// const TerserPlugin = require('terser-webpack-plugin')
// const webpack = require('webpack')

console.log('WEBPACK APP ENVIRONMENT : SERVER >>>>>>>',process.env.INFRA_PATH)

module.exports = {
  mode: 'production',
  name: 'server',
  entry: {
    index: './src/index.js',
  },
  externals: [nodeExternals(), 'express'],
  target: 'node',
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs'
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        resolve: { extensions: [".js"] },
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  },
}