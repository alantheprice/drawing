const path = require('path')
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "app.min.js"
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['env']
                }
              }
            }
          ]
    },
    devtool: 'inline-source-map',
    plugins: [
        // new webpack.optimize.UglifyJsPlugin()
    ]
};