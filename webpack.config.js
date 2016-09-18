module.exports = {
    entry: './index.js',
    module: {
        loaders: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    output: {
        path: '.',
        filename: 'b_index.js'
    },
    devtool: 'source-map',
};
