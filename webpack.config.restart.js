/*eslint-disable*/
var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer');

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './src/client.restart.js'
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
                test: /\.s?css$/,
                loaders: ['style', 'css', 'postcss', 'sass']
            },
            {
                test: /\.js$/,
                loaders: ['babel?cacheDirectory=true&presets=es2015'],
                exclude: /node_modules/,
            }
        ]
    },
    postcss: function () {
        return [autoprefixer];
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
/*eslint-enable*/
