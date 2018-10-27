const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
  entry: ['./src/client/index.jsx'],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=1000',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin(['./public']),
    new Webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || ''),
    }),
    new CleanWebpackPlugin(['./dist']),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
    }),
    new FaviconsWebpackPlugin({
      logo: './src/images/favicon-source-votify.png',
      statsFilename: './dist/site.webmanifest',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new WorkboxPlugin.GenerateSW({
      exclude: [/bundle\.js$/],
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://api.spotify.com/'),
          handler: 'cacheFirst',
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: new RegExp('/api/'),
          handler: 'cacheFirst',
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    }),
  ],
};
