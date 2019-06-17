// webpack v4
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const PATH = {
    SOURCE: path.join(process.cwd(), 'src'),
    IMAGES: path.join(process.cwd(), 'src/assets/images'),
    LEVELS: path.join(process.cwd(), 'src/assets/levels'),
    AUDIO: path.join(process.cwd(), 'src/assets/sounds')
}

const inArray = (haystack) => (needle) => haystack.some((item) => needle.includes(item))
// const dependencyPath = (...folders) => path.join('node_modules', ...folders)
const localLink = (...folders) => path.join(process.cwd(), '..', ...folders)

const jsEs6Source = inArray([
    path.join(PATH.SOURCE, 'js'),
    localLink('tiled-platformer-lib', 'lib')
])

module.exports = {
    target: 'web',
    entry: [
        path.join(process.cwd(), 'src/js/index.js')
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: jsEs6Source,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|gif|jpg|svg)$/,
                include: PATH.IMAGES,
                use: 'url-loader?limit=100&name=[name]-[hash].[ext]'
            },
            {
                test: /\.tmx$/,
                include: PATH.LEVELS,
                use: 'url-loader'
            },
            {
                test: /\.(mp3|wav)$/,
                include: PATH.AUDIO,
                loader: 'file-loader?name=[name]-[hash].[ext]'
            }
        ]
    }
}
