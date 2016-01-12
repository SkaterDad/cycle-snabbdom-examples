/*eslint-disable*/
var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
        ],
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'autoprefixer', 'sass']
                //loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!sass-loader")
                //TODO:  Replace autoprefixer-loader & sass with PostCSS plugin
                //TODO:  Use ExtractTextPlugin version in production
            },
            {
                test: /\.js$/,
                //loaders: ['monkey-hot', 'babel?cacheDirectory=true&presets=es2015'],
                loaders: ['babel?cacheDirectory=true&presets=es2015'],
                exclude: /node_modules/,
                // query: {
                //     cacheDirectory: true,
                //     presets: ['es2015']
                // }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("app.css"),
        //new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
/*eslint-enable*/
