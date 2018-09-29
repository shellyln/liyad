var path    = require('path');
var webpack = require('webpack');


const babelOptions = {
    loader: 'babel-loader',
    options: {
        'sourceMaps': true,
        'presets': [
            ['@babel/preset-env', {
                'targets': {
                    'chrome': 68
                }
            }]
        ],
        'ignore': [],
    }
};


module.exports = function (env) {
    return [{
        target: "web",
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

            libraryTarget: 'umd',
            filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
            path: path.resolve(__dirname, 'dist'),
            devtoolModuleFilenameTemplate: void 0
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [
                    babelOptions,
                    'ts-loader?' + JSON.stringify({
                        configFile: 'tsconfig.json'
                    }),
                ],
                exclude: /node_modules[\/\\](?!liyad).*$/
            }, {
                test: /\.jsx?$/,
                use: [
                    babelOptions,
                ],
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