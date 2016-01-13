/*eslint-disable*/
var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
        ],
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!sass-loader")
                //TODO:  Replace autoprefixer-loader & sass with PostCSS plugin
            },
            {
                test: /\.js$/,
                loaders: ['babel?cacheDirectory=true&presets=es2015'],
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("app.css"),
        new webpack.optimize.OccurenceOrderPlugin(),
    ]
};
/*eslint-enable*/
