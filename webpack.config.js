const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(nodeEnv)
        }
    }),
    new HtmlWebpackPlugin({
        title: 'POSTHUMUS',
        template: '!!ejs-loader!src/index.html'
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
            tslint: {
                emitErrors: true,
                failOnHint: true
            }
        }
    })
]

const config = {
    devtool: isProd ? 'hidden-source-map' : 'source-map',
    context: path.resolve('./src'),
    entry: {
        app: './index.ts'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                exclude: [/\/node_modules\//],
                use: ['awesome-typescript-loader', 'source-map-loader']
            },
            !isProd
                ? {
                      test: /\.(js|ts)$/,
                      loader: 'istanbul-instrumenter-loader',
                      exclude: [/\/node_modules\//],
                      query: {
                          esModules: true
                      }
                  }
                : null,
            { test: /\.html$/, loader: 'html-loader' },
            {
                test: /\.(png|gif|jpg|svg)$/,
                include: path.join(process.cwd(), 'src/assets/images'),
                use: 'url-loader?limit=100&name=[name]-[hash].[ext]'
            },
            {
                test: /\.tmx$/,
                include: path.join(process.cwd(), 'src/assets/map'),
                use: 'url-loader'
            },
            {
                test: /\.mp3$/,
                include: path.join(process.cwd(), 'src/assets/sounds'),
                loader: 'file-loader?name=[name]-[hash].mp3'
            },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] }
        ].filter(Boolean)
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: plugins,
    devServer: {
        contentBase: path.join(__dirname, 'dist/'),
        compress: true,
        port: 3000,
        hot: true
    }
}

module.exports = config
