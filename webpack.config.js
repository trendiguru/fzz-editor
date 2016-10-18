const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.json/,
                exclude: /node_modules/,
                loader: 'json'
            },
            {
                test: /\.scss/,
                include: /css/,
                loader: ExtractTextPlugin.extract([
                    'css?sourceMap',
                    'sass?sourceMap'
                ])
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name]')
    ],
    entry: {
        'b_index.js': ['core-js', 'web-core', './index.js'],
        './css/main.css': './css/main.scss'
    },
    output: {
        path: '.',
        filename: '[name]'
    },
    devtool: 'source-map',
};
