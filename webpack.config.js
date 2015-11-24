var webpack = require('webpack'),
    path = require('path');

module.exports = {
    debug: true,
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
    module: {
        preLoaders: [
            {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
        ],
        loaders: [{
            test: /\.js$/,
            loader: "babel",
            exclude: /node_modules/,
            query: {
            cacheDirectory: true,
            presets: ['es2015']
            }
        }]
    }
};
