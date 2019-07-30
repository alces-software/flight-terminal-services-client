const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const webpack = require('webpack');

const paths = require('./paths');

const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

const babelLoader = {
  test: /\.(js|jsx|ts|tsx|mjs)$/,
  exclude: /node_modules/,
  loader: require.resolve('babel-loader'),
  options: {
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
            },
          },
        },
      ],
    ],
    presets: ["@babel/preset-env", "@babel/preset-react", "react-app"],
    cacheDirectory: true,
    cacheCompression: process.env.NODE_ENV === 'production',
    compact: process.env.NODE_ENV === 'production',
  },
};


const cssModuleLoader = {
  test: cssModuleRegex,
  use: [
    {
      loader: require.resolve('css-loader'),
      options: {
        exportOnlyLocals: true,
        camelCase: true,
        importLoaders: 1,
        modules: true,
        // localIdentName: '[name]__[local]--[hash:base64:5]',
        getLocalIdent: getCSSModuleLocalIdent,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
};

const cssLoader = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
};

const urlLoader = {
  test: /\.(png|jpe?g|gif|svg)$/,
  loader: require.resolve('url-loader'),
  options: {
    limit: 10000,
    name: 'media/[name].[hash:8].[ext]',
    emitFile: false,
  },
};

const fileLoader = {
  exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: require.resolve('file-loader'),
      options: {
        name: 'assets/[name].[hash:8].[ext]',
        emitFile: false,
      },
    },
  ],
};


const plugins = [
  new MiniCssExtractPlugin({
    filename:
    process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[contenthash].css',
    chunkFilename:
    process.env.NODE_ENV === 'development' ? '[id].css' : '[id].[contenthash].css',
  }),
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __BROWSER__: 'false',
  }),
];

module.exports = {
  name: 'server',
  target: 'node',
  entry: {
    server: [
      path.resolve(paths.srcServer, 'index.js'),
    ],
  },
  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      whitelist: [
        /\.css$/,
        'flight-reactware',
      ],
    }),
  ],
  output: {
    path: paths.serverBuild,
    filename: 'server.js',
    publicPath: paths.publicPath,
    // libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.mjs', '.json', '.jsx', '.ts', '.tsx', '.css'],
    modules: paths.resolveModules,
  },
  module: {
    rules: [
      {
        oneOf: [
          babelLoader,
          cssModuleLoader,
          cssLoader,
          urlLoader,
          fileLoader,
        ],
      },
    ],
  },
  plugins: plugins,
  stats: {
    colors: true,
  },
  mode: 'production',
};
