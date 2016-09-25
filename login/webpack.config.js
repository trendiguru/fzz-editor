const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ES_POLYFILLS = ['core-js', 'regenerator-runtime/runtime', 'whatwg-fetch'];

module.exports = {
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules\/(?!delux)/,
                loader: 'babel'
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract([
                    'css?sourceMap',
                    'postcss',
                    'sass?sourceMap'
                ])
            }
        ]
    },
    resolve: {
        root: [
            path.resolve('./')
        ]
    },
    plugins: [
        // This needs to be in index 0 to remain accessible
        // in webpack.production & webpack.test
        new webpack.DefinePlugin({
            'ENVIRONMENT': '"DEV"'
        }),
        //-------------------------------------------------
        new ExtractTextPlugin('[name]')
    ],
    postcss () {
        return [autoprefixer];
    },
    entry: {
        'b_index.js': ES_POLYFILLS.concat('index.js')
    },
    output: {
        path: '.',
        filename: '[name]'
    },
    externals: {
        'react': 'React'
    },
    devtool: 'source-map'
};
