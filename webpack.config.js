const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './src/Main.tsx',

    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: [
                    /node_modules/,
                ]
            },
            {
                test: /\.(png|jpg|bmp|obj)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[ext]",
                    },
                },
                include: path.join(__dirname, 'res')
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    output: {
        filename: 'picross3d.js',
        path: dist
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    // devtool: 'eval-source-map'
};