/// <reference types="node" />
import * as fs from 'fs';
import * as Path from 'path';
import pick = require('1-liners/pick');

const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const readPkgUp = require('read-pkg-up');

const sourcePath = Path.join(__dirname, 'src');
const buildPath = Path.join(__dirname, 'dist');
const context = __dirname;

const watchOptions = {
    ignored: /node_modules/,
};

interface Options {
    libs?: boolean;
    test?: boolean;
    coverage?: boolean;
    prod?: boolean;
    dev?: boolean;
    hmr?: boolean;
    style?: boolean;
    minimize?: boolean;
    name?: string;
    devtool?: string;
}

const defaultOptions = {
    libs: process.argv.indexOf('--env.libs') !== -1,
    style: process.argv.indexOf('--env.style') !== -1,
    test: false,
    coverage: false,
    prod: process.argv.indexOf('-p') !== -1 || process.argv.indexOf('--env.prod') !== -1,
    get dev() {
        return !this.prod;
    },
    get hmr() {
        return this.dev;
    },
    get minimize() {
        return (process.argv.indexOf('--env.nomin') !== -1) ? false : this.prod;
    },
    get devtool() {
        return ('webpack_devtool' in process.env) ? process.env.webpack_devtool : 'cheap-source-map';
    },
};

const postPlugins = [
    // require('autoprefixer')({ browsers: 'last 3 versions' }),
];
const packageToTranspile = [
    // 'pupa',
];

const momentLocales = ['en-gb'];

const tsLoader = {
    loader: 'awesome-typescript-loader',
    options: {
        useTranspileModule: true,
        isolatedModules: true,
        transpileOnly: true,
    }
};

export = (options: Options = {}) => {
    options = { ...defaultOptions, ...options };
    Object.keys(options).forEach(key => {
        const value = options[key];
        (value === true) ? process.stdout.write(`${key} `) : (value ? process.stdout.write(`${key}:${value} `) : null);
    });
    let stats: any = {
        version: false,
        maxModules: 0,
        children: false,
    };
    let cssLoaderOptions: any = {
        sourceMap: true,
        minimize: options.minimize,
    };
    let config: any = {
        context: context,
        entry: {
            app: './example/main.tsx',
            libs: (() => {
                let dependencies = Object.keys(readPkgUp.sync().pkg.dependencies);
                return [
                    'react',
                    'react-dom',
                    ...dependencies,
                    'webpack-dev-server/client',
                    'webpack/hot/emitter',
                    'webpack/hot/log-apply-result',
                    'react-hot-api',
                    // 'webpack/hot/dev-server', // DONT! It will break HMR
                    // react-hot-loader // BANNED
                ];
            })(),
            // style: ['./src/style.scss'],
        },
        output: {
            path: buildPath,
            publicPath: '',
            chunkFilename: (() => {
                if (options.prod) return '[name]-[hash:6].js';
                return '[name].js';
            })(),
            filename: (() => {
                if (options.prod) return '[name]-[hash:6].js';
                return '[name].js';
            })(),
        },
        devtool: (() => {
            if (options.test) return 'inline-source-map';
            if (options.prod) return 'source-map';
            return ('webpack_devtool' in process.env) ? process.env.webpack_devtool : 'cheap-source-map';
        })(),
        devServer: {
            https: false,
            overlay: true,
            noInfo: false,
            contentBase: [sourcePath, buildPath],
            port: 8099,
            historyApiFallback: true,
            hot: true,
            inline: true,
            disableHostCheck: true,
            stats: stats,
            // stats: { reasons: true, maxModules: 10000 },
            watchOptions: watchOptions,
        },
        stats: stats,
        node: {
            // workaround for webpack-dev-server issue
            // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
            fs: 'empty',
            net: 'empty',
            buffer: 'empty',
            Buffer: false,
            setimmediate: false,
        },
        target: 'web',
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            modules: ['node_modules'],
        },
        watchOptions: watchOptions,
        module: {
            exprContextCritical: false,
            rules: [
                {
                    test: /\.tsx?$/,
                    use: (() => {
                        return [
                            ...(options.hmr ? [{ loader: 'react-hot-loader/webpack' }] : []),
                            tsLoader,
                        ]
                    })(),
                },
                {
                    test: /index\.ejs$/,
                    use: [
                        { loader: 'ejs-loader' },
                    ]
                },
            ],
        },
        plugins: (() => {
            const WatchIgnorePlugin = require('webpack/lib/WatchIgnorePlugin');
            const result: any[] = [
                new WatchIgnorePlugin([
                    /node_modules/
                ]),
                // new ContextReplacementPlugin(/moment.locale$/, new RegExp(momentLocales.join('|'))),
            ];
            if (options.hmr) {
                const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
                result.push(new NamedModulesPlugin());
            }
            if (!options.test) {
                const HtmlWebpackPlugin = require('html-webpack-plugin');
                result.push(new HtmlWebpackPlugin({
                    template: './example/index.ejs',
                    minify: false,
                    excludeChunks: [],
                    config: options,
                }));
            }
            if (options.minimize) {
                const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
                result.push(new UglifyJsPlugin({ sourceMap: true, comments: false }));
            }
            if (options.prod) {
                const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
                const CopyWebpackPlugin = require('copy-webpack-plugin');
                const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
                const DefinePlugin = require('webpack/lib/DefinePlugin');
                result.push(
                    new DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify('production'),
                    }),
                    new ModuleConcatenationPlugin(),
                    new LoaderOptionsPlugin({
                        minimize: options.minimize,
                        debug: false,
                        options: { context }
                    }),
                );
            }

            const envName = ('env_name' in process.env) ? process.env.env_name : undefined;
            const environmentFile = `src/environment.${envName}.ts`;
            if (options.dev && !options.test && envName && fs.existsSync(environmentFile)) {
                process.stdout.write(`environment: ${envName} `);
                const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
                result.push(
                    new NormalModuleReplacementPlugin(
                        /src.environment\.ts$/,
                        result => {
                            result.resource = Path.resolve(environmentFile);
                        }
                    )
                );
            }

            return result;
        })()
    };

    if (options.libs) {
        const DllPlugin = require('webpack/lib/DllPlugin');
        config = {
            ...config,
            ... {
                entry: pick(['libs'], config.entry), // check name near DllReferencePlugin
                devtool: 'source-map',
                output: {
                    path: buildPath,
                    filename: '[name].js',
                    library: '[name]',
                },
                plugins: [
                    new DllPlugin({
                        name: '[name]',
                        path: `${buildPath}/[name].json`
                    }),
                    // new ContextReplacementPlugin(/moment.locale$/, new RegExp(momentLocales.join('|')))
                ]
            }
        };
        // For libs, pick only necessary rules.
        config.module.rules = config.module.rules
            .filter(rule => {
                if (rule.test && rule.test.name === 'transpilePackage') return true;
                return false;
            });
    } else {
        config.entry = pick(['app'], config.entry);
        if (options.hmr) {
            config.entry = ['react-hot-loader/patch', config.entry.app];
        }
        if (options.test) {
            config.entry = false;
        }
        if (options.dev && !options.coverage) {
            const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
            const libs = `${buildPath}/libs.json`; // check name in src/index.ejs
            if (!fs.existsSync(libs)) {
                throw new Error(`Cannot link '${libs}', file do not exists.`);
            }
            config.plugins.push(
                new DllReferencePlugin({
                    context: context,
                    manifest: require(libs)
                })
            );
        }
        if (!options.test) {
            const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
            if (options.dev) {
                config.plugins.push(new AddAssetHtmlPlugin({ filepath: Path.resolve(buildPath, 'libs.js'), typeOfAsset: 'js' }));
            }
        }
    }

    return config;
};
