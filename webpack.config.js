const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssentPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const devMode = process.env.NODE_ENV !== "production"
const isProd = !devMode

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssentPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => devMode ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoader = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {},
        },
        "css-loader", 
    ]

    if(extra) {
        loaders.push(extra)
    }

    return loaders
}

const babelOptions = preset => {
    const opts =  {
        presets: [
          ['@babel/preset-env', { targets: "defaults" }],],
    }

    if(preset) {
        opts.presets.push(preset)
    }

    return opts
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]
    
    // if(devMode) {
    //     loaders.push('eslint-loader')
    // }
    return loaders
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new ESLintPlugin(myEslintOptions),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
              { from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist') },
            ],
          }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        })
    ]
    if (isProd) {
        base.push(new BundleAnalyzerPlugin())
    }
    return base
}

 const myEslintOptions = {
     extensions: [`js`, `jsx`, `ts`],
     exclude: [`node_modules`],
   };

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts' // чанки
    },
    output: {
        filename: filename('js'), // если при сборки мы оставляем файл со старым названием, то у пользоватьеля может быть кэширование по названию и он не увидит изменений  / бандл
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
    },
    // devtool: devMode ? 'source-map' : '',
    plugins: plugins(),
    module: {
        rules: [ // loaders
            {
                test: /\.css$/,
                use: cssLoader(), // 'style-loader' ,css помогает сделать импорт, а style помогает записать в секцию head, html
            },
            {
                test: /\.less$/,
                use: cssLoader('less-loader'),
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoader('sass-loader'),
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                // use: ['file-loader']
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource'
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions(["@babel/preset-typescript"])
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions(["@babel/preset-react"])
                }
            },
        ]
    }
}

// eval - компелирует строки в js

// for eslintrc

// {
//     "parser": "@babel/eslint-parser",
//     "rules": {
//         "no-unused-vars": "warn"
//     },
//     "plugins": [
//       "react",
//       "@typescript-eslint"
//     ],
//     "settings": {
//       "html/indent": "0",
//       "es6": true,
//       "react": {
//         "version": "16.5"
//       },
//       "propWrapperFunctions": "['forbidExtraProps']",
//       "import/resolver": {
//         "node": {
//           "extensions": "['.js', '.jsx', '.json', '.ts', '.tsx']"
//         },
//         "alias": {
//           "extensions": "['.js', '.jsx', '.json']"
//         }
//       }
//     },
//     "parserOptions": {
//         "requireConfigFile": false,
//         "ecmaVersion": "latest",
//         "sourceType": "module",
//         "ecmaFeatures": {
//             "jsx": true,
//             "experimentalObjectRestSpread": true
//         },
//         "babelOptions": {
//             "presets": ["@babel/preset-react"]
//         }
//     },
//     "env": {
//         "es6": true,
//         "browser": true
//     },
//     "extends": ["eslint:recommended"],
//     "overrides": [
//         {
//           "files": ["*.{ts,tsx}"],
//           "parser": "@typescript-eslint/parser",
//           "plugins": ["@typescript-eslint"],
//           "extends": ["plugin:@typescript-eslint/recommended"]
//         }
//       ]
// }