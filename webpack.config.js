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
                test: /\.s?css/,
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
        './css/main.css': ['react-select/dist/react-select.css', './storybook.scss']
    },
    output: {
        path: '.',
        filename: '[name]'
    },
    devtool: 'source-map',
};
