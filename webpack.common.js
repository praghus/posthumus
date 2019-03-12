// webpack v4
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const sourcePath = path.join(process.cwd(), 'src')
const imgPath = path.join(sourcePath, 'assets/images')
const audioPath = path.join(sourcePath, 'assets/sounds')

const inArray = (haystack) => (needle) => haystack.some((item) => needle.includes(item))
// const dependencyPath = (...folders) => path.join('node_modules', ...folders)
const localLink = (...folders) => path.join(process.cwd(), '..', ...folders)

const jsEs6Source = inArray([
    path.join(sourcePath, 'js'),
    localLink('tmx-platformer-lib', 'lib')
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
                include: imgPath,
                use: 'url-loader?limit=100&name=[name]-[hash].[ext]'
            },
            {
                test: /\.(mp3|wav)$/,
                include: audioPath,
                loader: 'file-loader?name=[name]-[hash].[ext]'
            },
            {
                test: /\.tmx$/,
                loader: 'xml-loader?explicitChildren=true&preserveChildrenOrder=true'
            }
        ]
    }
}
