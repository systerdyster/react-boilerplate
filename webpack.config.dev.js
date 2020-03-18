/*jshint esversion: 6 */

const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}, argv = {}) => {

    const assetNames = 'assets/[name].[ext]';

    var config = {
        entry: {
            app: path.join(__dirname, "src/script", "index.tsx")
        },

        output: {
            path: path.resolve(__dirname, "www"),
            filename: "[name].js",
            chunkFilename: "[name].js"
        },

        watch: true,
        target: "web",
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'www'),
            port: 8000,
            hot: true,
            open: true
        },

        plugins: [
            new htmlWebpackPlugin({
                template: './src/index.html',
                inject: true,
                filename: 'index.html',
                title: 'webpack-starter-react',
                chunksSortMode: 'none'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.WatchIgnorePlugin(['www', 'node_modules']),
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'development',
                DEBUG: true
            })
        ],

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
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true
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
                                sourceMap: true
                            }
                        }],
                        include: [path.join(__dirname, 'src/style')],
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
            extensions: [".tsx", ".ts", ".js", ".sass", ".scss"],
            modules: [ path.resolve(__dirname, 'src'), "node_modules" ],
            mainFields: ['browser', 'module', 'main']
        }
    };

    return config;
};
