const path = require('path')

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, '..', 'public'),
    },
    allowedHosts: 'all',
    open: true,
    hot: false,
  },
}

module.exports = devConfig
