/*jshint esversion: 6 */

const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const terserJSPlugin = require('terser-webpack-plugin');

module.exports = (env = {}, argv = {}) => {
    const cssFile = 'style-[hash:14].min.css';
    const assetNames = 'assets/[name]-[hash:14].[ext]';

    var config = {

        entry: {
            app: path.join(__dirname, "src/script", "index.tsx")
        },

        output: {
            path: path.resolve(__dirname, "www"),
            filename: "[name]-[chunkhash:14].min.js",
            chunkFilename: "[name]-[chunkhash:14].min.js"
        },
        
        target: "web",
        devtool: false,

        optimization: {
            minimizer: [new terserJSPlugin({}), new optimizeCssAssetsPlugin({})]
        },

        plugins: [
            new htmlWebpackPlugin({
                template: './src/index.html',
                inject: true,
                filename: 'index.html',
                title: 'webpack-starter-template-svelte',
                chunksSortMode: 'none'
            }),
            new miniCssExtractPlugin({
                filename: cssFile
            }),
            new webpack.HashedModuleIdsPlugin()
        ],

        performance: {
            hints: "warning", //"warning", // error / false
        },

        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    use: [{ loader: 'ts-loader' }],
                    include: [
                        path.join(__dirname, "src")
                    ]
                },  
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        {
                            loader: miniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: false
                            }
                        }, 
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: false,
                                plugins: [
                                    require('autoprefixer')({
                                        grid: 'autoplace',
                                        flexbox: true
                                    }),
                                    require('@fullhuman/postcss-purgecss')({
                                        content: ['**/*.tsx'],
                                        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
                                    })
                                ]
                            }
                        }, 
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false
                            }
                        }],
                        include: [path.join(__dirname, 'src/style')]
                },
                {
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    use: 'url-loader?limit=1000&mimetype=application/font-woff&name=' + assetNames
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    use: 'url-loader?limit=1000&mimetype=application/octet-stream&name=' + assetNames
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    use: 'file-loader?name=' + assetNames
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    use: 'url-loader?limit=1000&mimetype=image/svg+xml&name=' + assetNames
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: 'url-loader?limit=1000&name=' + assetNames
                }
            ]
        },

        resolve: {
            extensions: [".tsx", ".ts", ".js", ".sass"],
            modules: [ path.resolve(__dirname, 'src'), "node_modules" ],
            mainFields: ['browser', 'module', 'main']
        }
    };
    return config;
};
