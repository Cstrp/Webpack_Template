const { merge } = require('webpack-merge')
const config = require('./config/webpack.base')
const dev = require('./config/webpack.dev')
const prod = require('./config/webpack.prod')

module.exports = (_, argv) => {
  switch (argv.mode) {
    case 'production':
      return merge(config, dev)
    case 'development':
      return merge(config, prod)
    default:
      throw new Error('No matching config was found.')
  }
}
