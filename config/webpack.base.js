const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBarPlugin = require('webpackbar')

const isProduction = process.env.NODE_ENV === 'production'

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : 'style-loader'

const fileNames = ['index']

const config = {
  context: path.resolve(__dirname, '..'),
  entry: fileNames.reduce((config, file) => {
    config[file] = `./src/${file}`
    return config
  }, {}),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]_[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    cache: true,
  },
  plugins: [].concat(
    fileNames.map((fileName) => {
      return new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, `../${fileName}.html`),
        filename: `${fileName}.html`,
        chunks: [fileName],
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
        cache: true,
        chunksSortMode: 'auto',
      })
    }),
    [
      new WebpackBarPlugin({
        name: 'webpack',
      }),
    ].filter(Boolean)
  ),
  module: {
    rules: [
      {
        test: /\.(html)$/i,
        use: ['html-loader'],
      },
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2016',
              tsconfig: path.resolve(__dirname, '../tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          stylesHandler,
          'css-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'esbuild-loader',
            options: { minify: true },
          },
        ],
      },
      {
        test: /\.(png|svg|jpe?g|webp|avif|gif|ico)$/i,
        type: 'asset',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.(mp3?4|ogg|wav|flac|aac|mp4|webm)$/i,
        type: 'asset',
        generator: {
          filename: 'audio/[name][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        styles: {
          name: 'styles',
          test: /\.(s[ac]|c)ss$/i,
          enforce: true,
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/webpack'),
    hashAlgorithm: 'sha1',
    buildDependencies: {
      config: [path.join(__dirname, '../webpack.config.js')],
    },
  },
  experiments: {
    asyncWebAssembly: true,
    lazyCompilation: true,
    topLevelAwait: false,
  },
}

module.exports = config
