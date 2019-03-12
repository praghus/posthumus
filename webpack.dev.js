const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            template: path.join(process.cwd(), 'src/index.html'),
            inject: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    optimization: {
        namedModules: true,
        splitChunks: {
            name: 'vendor',
            minChunks: 2
        },
        noEmitOnErrors: true,
        concatenateModules: true
    },
    devServer: {
        contentBase: path.join(process.cwd(), 'dist'),
        disableHostCheck: true,
        port: process.env.PORT || 3000,
        host: '0.0.0.0'
    }
})
