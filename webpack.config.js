const webpack = require('webpack')
const path = require('path')

const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SpritePlugin = require('svg-sprite-loader/plugin')
const autoprefixer = require('autoprefixer')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

const jsSourcePath = path.join(__dirname, './src/js')
const distPath = path.join(__dirname, './dist')
const imgPath = path.join(__dirname, './src/assets/images')
const iconPath = path.join(__dirname, './src/assets/icons')
const sourcePath = path.join(__dirname, './src')

const plugins = [
    new SpritePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor-[hash].js',
        minChunks (module) {
            const context = module.context
            return context && context.indexOf('node_modules') >= 0
        }
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(nodeEnv)
        }
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
        template: path.join(sourcePath, 'index.html'),
        path: distPath,
        filename: 'index.html'
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                autoprefixer({
                    browsers: [
                        'last 3 version',
                        'ie >= 10'
                    ]
                })
            ],
            context: sourcePath
        }
    })
]

const rules = [
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
            'babel-loader'
        ]
    },
    {
        test: /\.svg$/,
        use: [
            {
                loader: 'svg-sprite-loader',
                options: {
                    extract: true,
                    spriteFilename: 'icons-sprite.svg'
                }
            },
            'svgo-loader'
        ],
        include: iconPath
    },
    {
        test: /\.(png|gif|jpg|svg)$/,
        include: imgPath,
        use: 'url-loader?limit=100&name=assets/[name]-[hash].[ext]'
    },
    {
        test: /\.json$/,
        loader: 'json-loader'
    }
]

if (isProduction) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        new ExtractTextPlugin('style-[hash].css')
    )
    rules.push(
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!postcss-loader!sass-loader'
            })
        }
    )
}
else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin()
    )
    rules.push(
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader?sourceMap'
            ]
        }
    )
}

module.exports = {
    devtool: isProduction ? false : 'source-map',
    context: jsSourcePath,
    entry: {
        js: './index.js'
    },
    output: {
        path: distPath,
        publicPath: '/',
        filename: 'app-[hash].js'
    },
    module: {
        rules
    },
    resolve: {
        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            jsSourcePath
        ]
    },
    plugins,
    devServer: {
        contentBase: isProduction ? distPath : sourcePath,
        historyApiFallback: true,
        port: 3000,
        compress: isProduction,
        inline: !isProduction,
        hot: !isProduction,
        host: '0.0.0.0',
        disableHostCheck: true,
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m'
            }
        }
    }
}
