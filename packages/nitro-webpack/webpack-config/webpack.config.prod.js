/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const WebpackBar = require('webpackbar');
const DynamicAliasResolverPlugin = require('../plugins/dynamicAliasResolver');
const utils = require('../lib/utils');

const appDirectory = fs.realpathSync(process.cwd());

const bannerData = {
	date: new Date().toISOString().slice(0, 19),
	pkg: require(`${appDirectory}/package.json`),
};

let banner = `${bannerData.pkg.name}
@version v${bannerData.pkg.version}
@date ${bannerData.date}`;

module.exports = (options = { rules: {}, features: {} }) => {

	const webpackConfig = {
		mode: 'production',
		devtool: 'hidden-source-map',
		context: appDirectory,
		entry: {
			ui: './src/ui',
			proto: './src/proto',
		},
		output: {
			path: path.resolve(appDirectory, 'public', 'assets'),
			filename: 'js/[name].min.js',
			chunkFilename: 'js/[name]-[contenthash:7].min.js',
			publicPath: '/assets/',
		},
		resolve: {
			symlinks: false,
		},
		module: {
			rules: [],
		},
		plugins: [
			new CaseSensitivePathsPlugin({ debug: false }),
			new WebpackBar(),
		],
		optimization: {
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
						filename: 'js/vendors.min.js',
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
			assets: true,
			children: false,
			chunks: false,
			modules: false,
			colors: true,
			depth: false,
			entrypoints: false,
			errors: true,
			errorDetails: true,
			hash: false,
			performance: true,
			warnings: false,
		},
	};
	const theme = options.features.theme ? options.features.theme : false;
	if (theme) {
		webpackConfig.entry.ui = `./src/ui.${theme}`;
		webpackConfig.output.path = path.resolve(webpackConfig.output.path, theme);
		webpackConfig.output.publicPath = `${webpackConfig.output.publicPath}${theme}/`;
	}

	// js
	if (options.rules.js) {
		webpackConfig.plugins.push(
			new JsConfigWebpackPlugin({ babelConfigFile: './babel.config.js' }),
		);
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
					MiniCssExtractPlugin.loader,
					{
						loader: require.resolve('css-loader'),
						options: {
							sourceMap: true,
							importLoaders: 2,
						}
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							plugins: (loader) => {
								return [
									require('iconfont-webpack-plugin')({
										resolve: loader.resolve,
									}),
									require('autoprefixer')({
										// @see autopreficer options: https://github.com/postcss/autoprefixer#options
										// flexbox: 'no-2009' will add prefixes only for final and IE versions of specification.
										flexbox: 'no-2009',
									}),
								];
							},
							sourceMap: true,
						}
					},
					{
						loader: require.resolve('resolve-url-loader'),
					},
					{
						loader: require.resolve('sass-loader'),
						options: {
							implementation: require('node-sass'),
						},
					},
				],
			},
		);

		webpackConfig.plugins.push(
			new MiniCssExtractPlugin({
				filename: 'css/[name].min.css',
				chunkFilename: 'css/[name]-[id].min.css',
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
					},
				},
			}),
		);
	}

	// handlebars precompiled templates
	if (options.rules.hbs) {
		const hbsRule = {
			test: /\.hbs$/,
			use: {
				loader: require.resolve('handlebars-loader'),
				// options: {
				// 	helperDirs: [
				// 		path.resolve(__dirname, '../../app/templating/hbs/helpers'),
				// 	],
				// 	knownHelpers: [],
				// 	runtime: '',
				// 	partialDirs: ''
				// },
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
		// image loader & minification
		const imageMinificationRule = {
			test: /\.(png|jpg|gif|svg|ico)$/,
			// Specify enforce: 'pre' to apply the loader before url-loader
			enforce: 'pre',
			use: {
				loader: require.resolve('img-loader'),
				options: {
					plugins: [
						require('imagemin-gifsicle')({
							interlaced: false
						}),
						require('imagemin-mozjpeg')({
							quality: 75,
							progressive: true
						}),
						require('imagemin-optipng')({
							optimizationLevel: 7
						}),
						require('imagemin-pngquant')({
							// floyd: 0.5,
							// speed: 2
						}),
						require('imagemin-svgo')({
							plugins: [
								{collapseGroups: false},
								{cleanupIDs: false},
								{removeUnknownsAndDefaults: false},
								{removeViewBox: false}
							]
						}),
					],
				},
			},
		};

		// url loader for images (for example, in CSS files)
		// inlines assets below a limit
		const imageRule = {
			test: /\.(png|jpg|gif|svg)$/,
			use: {
				loader: require.resolve('url-loader'),
				options: {
					limit: 3 * 1028,
					name: 'media/[ext]/[name]-[hash:7].[ext]',
				},
			},
		};

		webpackConfig.module.rules.push(
			imageMinificationRule,
			utils.getEnrichedConfig(imageRule, options.rules.image),
		);
	}

	// feature banner (enabled by default)
	if (!options.features.banner === false) {
		webpackConfig.plugins.push(
			new webpack.BannerPlugin({ banner }),
		);
	}

	// feature bundle analyzer
	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	// feature dynamic alias
	if (options.features.dynamicAlias && options.features.dynamicAlias.search && options.features.dynamicAlias.replace) {
		webpackConfig.resolve.plugins = [
			new DynamicAliasResolverPlugin(options.features.dynamicAlias),
		];
	}

	return webpackConfig;
};
module.exports.appDirectory = appDirectory;

/* eslint-enable */
