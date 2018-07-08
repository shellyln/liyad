var path    = require('path');
var webpack = require('webpack');



module.exports = function (env) {
    return [{
        target: "node",
        entry: {
            liyad: [
                path.resolve(__dirname, 'src/index.ts')
            ]
        },
        node: {
            fs: false,
            console: false,
            process: false,
            global: false,
            __filename: false,
            __dirname: false,
            Buffer: false,
            setImmediate: false,
        },
        output: {
            library: 'liyad',

            libraryTarget: 'var',
            filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
            path: path.resolve(__dirname, 'dist'),
            // devtoolModuleFilenameTemplate: '../[resource-path]',
            devtoolModuleFilenameTemplate: void 0
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            'sourceMaps': true,
                            'presets': [
                                ["env", {
                                    "targets": {
                                        "browsers": [ ">0.25%", "not ie 11", "not op_mini all"]
                                    }
                                }]
                            ],
                            'ignore': [],
                        }
                    },
                    // 'babel-loader',
                    'ts-loader?' + JSON.stringify({
                        configFile: 'tsconfig.json'
                    }),
                ],
                exclude: /node_modules[\/\\](?!liyad).*$/
            }, {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules[\/\\](?!liyad).*$/
            }, {
                enforce: 'pre',
                test: /\.[tj]sx?$/,
                use: {
                    loader: 'source-map-loader',
                    options: {
                    }
                },
                exclude: /node_modules[\/\\](?!liyad).*$/
            }]
        },
        plugins: [],
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js']
        },
        devtool: 'source-map'
    },

]}