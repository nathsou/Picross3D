const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './src/Main.ts',

    module: {
        rules: [{
                test: /\.(ts)$/,
                use: 'ts-loader',
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
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        filename: 'picross3d.js',
        path: dist
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Picross 3D',
            filename: 'index.html',
            meta: {
                viewport: 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0'
            },
        })
    ],
    devtool: 'eval-source-map'
};