/*eslint-disable*/
var webpack = require('webpack'),
    fs = require('fs');

var nodeModules = {};

fs.readdirSync('node_modules').filter(function(x) {
  return ['.bin'].indexOf(x) === -1;
}).forEach(function(mod) {
  return nodeModules[mod] = "commonjs " + mod;
});

module.exports = {
    entry: [
      'webpack/hot/poll?1000',
      './src/server/server.js'
    ],
    target: 'node',
    output: {
        path: './build',
        filename: 'server.js'
    },
    externals: nodeModules,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel?cacheDirectory=true&presets=es2015'],
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/\.s?css$/, 'node-noop'),
        new webpack.HotModuleReplacementPlugin({ quiet: false })
    ]
};
/*eslint-enable*/
