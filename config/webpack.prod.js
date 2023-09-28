const { EsbuildPlugin } = require('esbuild-loader')

const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [],
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        target: 'es2015',
        css: true,
        color: true,
      }),
    ],
  },
}

module.exports = prodConfig
