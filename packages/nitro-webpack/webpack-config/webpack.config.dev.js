/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const utils = require('../lib/utils');

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const appDirectory = fs.realpathSync(process.cwd());

module.exports = (options = { rules: {}, features: {} }) => {

	const webpackConfig = {
		mode: 'development',
		devtool: 'eval-source-map',
		context: appDirectory,
		entry: {
			ui: [
				'./src/ui',
				hotMiddlewareScript,
			],
			proto: [
				'./src/proto',
				hotMiddlewareScript,
			],
		},
		output: {
			path: path.resolve(appDirectory, 'public', 'assets'),
			filename: 'js/[name].js',
			chunkFilename: 'js/[name]-[hash:7].js',
			publicPath: '/assets/',
			pathinfo: false,
		},
		resolve: {
			symlinks: false,
		},
		module: {
			rules: [],
		},
		plugins: [
			new CaseSensitivePathsPlugin({ debug: false }),
			new webpack.HotModuleReplacementPlugin(),
		],
		watchOptions: {
			ignored: /node_modules/,
		},
		optimization: {
			noEmitOnErrors: true,
			splitChunks: {
				name: true,
				automaticNameDelimiter: '/',
				cacheGroups: {
					// allow dynamic imports for node_modules also
					dynamic: {
						minSize: 3000,
						chunks: 'async',
						priority: 0,
					},
					// extract js node_modules to vendors file
					vendors: {
						test: /[\\/]node_modules[\\/].*\.(js|jsx|mjs|ts|tsx)/,
						// use fix filename for usage in view
						filename: 'js/vendors.js',
						// Exclude proto dependencies going into vendors
						chunks: chunk => chunk.name !== 'proto',
						priority: -10,
						enforce: true,
					},
				},
			},
		},
		stats: {
			all: undefined,
			assets: false,
			children: false,
			chunks: false,
			modules: false,
			colors: true,
			depth: false,
			entrypoints: false,
			errors: true,
			errorDetails: false,
			hash: false,
			performance: true,
			warnings: true,
		},
	};

	// js
	if (options.rules.js) {
		webpackConfig.plugins.push(
			new JsConfigWebpackPlugin({ babelConfigFile: './babel.config.js' }),
		);

		// eslint live validation
		if (options.rules.js.eslint) {
			webpackConfig.module.rules.push(
				{
					enforce: 'pre',
					test: /\.(js|jsx|mjs)$/,
					exclude: /node_modules/,
					use: {
						loader: require.resolve('eslint-loader'),
						options: {
							eslintPath: require.resolve('eslint'),
							cache: true,
						},
					},
				},
			);
		}
	}

	// typescript
	if (options.rules.ts) {
		webpackConfig.plugins.push(new TsConfigWebpackPlugin());
	}

	// css & scss
	if (options.rules.scss) {
		webpackConfig.module.rules.push(
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: true,
						}
					},
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 2,
							sourceMap: true,
						}
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							plugins: (loader) => [
								require('autoprefixer')({
									// @see autopreficer options: https://github.com/postcss/autoprefixer#options
									// flexbox: 'no-2009' will add prefixes only for final and IE versions of specification.
									flexbox: 'no-2009',
									// grid: 'autoplace': enable autoprefixer grid translations and include autoplacement support.
									// not enabled - use `/* autoprefixer grid: autoplace */` in your css file
								}),
								require('iconfont-webpack-plugin')({
									resolve: loader.resolve,
								}),
							],
							sourceMap: true,
						}
					},
					{
						loader: require.resolve('resolve-url-loader'),
					},
					{
						loader: require.resolve('sass-loader'),
						options: {
							sourceMap: true,
						},
					},
				],
			},
		);

		webpackConfig.plugins.push(
			new MiniCssExtractPlugin({
				filename: 'css/[name].css',
			}),
			// we need SourceMapDevToolPlugin to make sourcemaps work
			// with MiniCSSExtractPlugin hmr mode
			// related: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
			}),
		);

		// stylelint live validation
		if (options.rules.scss.stylelint) {
			webpackConfig.plugins.push(
				new StyleLintPlugin({
					files: ['src/**/*.?(s)css'],
					// lintDirtyModulesOnly: true,
					syntax: 'scss',
					quiet: false,
					failOnError: false,
					emitErrors: true,
				})
			);
		}
	}

	// handlebars precompiled templates
	if (options.rules.hbs) {
		const hbsRule = {
			test: /\.hbs$/,
			use: {
				loader: require.resolve('handlebars-loader'),
				options: {
					// helperDirs: [
					// 	path.resolve(__dirname, '../../app/templating/hbs/helpers'),
					// ],
					// knownHelpers: [],
					// runtime: '',
					// partialDirs: ''
				},
			},
		};
		webpackConfig.module.rules.push(
			utils.getEnrichedConfig(hbsRule, options.rules.hbs),
		);
	}

	// woff fonts (for example, in CSS files)
	if (options.rules.woff) {
		const woffRule = {
			test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
			use: {
				loader: require.resolve('file-loader'),
				options: {
					name: 'media/fonts/[name]-[hash:7].[ext]',
				},
			}
		};
		webpackConfig.module.rules.push(
			utils.getEnrichedConfig(woffRule, options.rules.woff),
		);
	}

	// different font types (legacy - eg. used in older library css)
	if (options.rules.font) {
		const fontRule = {
			test: /\.(eot|svg|ttf|woff|woff2)([?#]+[A-Za-z0-9-_]*)*$/,
			use: {
				loader: require.resolve('url-loader'),
				options: {
					limit: 2 * 1028,
					name: 'media/font/[name]-[hash:7].[ext]',
				}
			}
		};
		webpackConfig.module.rules.push(
			utils.getEnrichedConfig(fontRule, options.rules.font),
		);
	}

	// images
	if (options.rules.image) {
		const imageRule = {
			test: /\.(png|jpg|gif|svg)$/,
			use: {
				loader: require.resolve('file-loader'),
			},
		};
		webpackConfig.module.rules.push(
			utils.getEnrichedConfig(imageRule, options.rules.image),
		);
	}

	// feature bundle analyzer
	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	return webpackConfig;
};
module.exports.hotMiddlewareScript = hotMiddlewareScript;
module.exports.appDirectory = appDirectory;

/* eslint-enable */
