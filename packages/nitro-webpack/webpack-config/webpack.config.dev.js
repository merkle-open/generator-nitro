const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const utils = require('../lib/utils');
const webpackRules = require('../lib/webpack-rules');

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const appDirectory = fs.realpathSync(process.cwd());

module.exports = (options = { rules: {}, features: {} }) => {
	const webpackConfig = {
		mode: 'development',
		devtool: 'eval-source-map',
		context: appDirectory,
		entry: {
			ui: ['./src/ui', hotMiddlewareScript],
			proto: ['./src/proto', hotMiddlewareScript],
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
		plugins: [new CaseSensitivePathsPlugin({ debug: false }), new webpack.HotModuleReplacementPlugin()],
		watchOptions: {
			ignored: [
				'**/*.hbs',
				'!**/template/**/*.hbs',
				'**/*.json',
				'**/*.md',
				'**/*.png',
				'**/*.svg',
				'**/node_modules/**',
			],
		},
		optimization: {
			emitOnErrors: false,
			moduleIds: 'deterministic',
			chunkIds: 'deterministic',
			runtimeChunk: false,
			splitChunks: {
				chunks: 'all',
				minSize: 3000,
				cacheGroups: {
					default: false,
					defaultVendors: false,
					vendors: {
						test: /[\\/]node_modules[\\/].*\.(js|jsx|mjs|ts|tsx)$/,
						chunks: (chunk) => chunk.canBeInitial() && chunk.name && chunk.name !== 'proto',
						name: 'vendors',
						enforce: true,
					},
				},
			},
		},
		stats: {
			preset: 'errors-warnings',
			assets: false,
			children: false,
			chunks: false,
			modules: false,
			colors: true,
			entrypoints: false,
			errors: true,
			errorDetails: false,
			hash: false,
			builtAt: false,
			timings: false,
			performance: true,
			warnings: true,
		},
		performance: {
			hints: 'warning',
			maxEntrypointSize: 380 * 1024,
			maxAssetSize: 380 * 1024,
		},
		infrastructureLogging: {
			level: 'warn',
		}
	};
	const theme = options.features.theme ? options.features.theme : false;

	if (theme) {
		webpackConfig.entry.ui = [`./src/ui.${theme}`, hotMiddlewareScript];
		webpackConfig.output.path = path.resolve(webpackConfig.output.path, theme);
		webpackConfig.output.publicPath = `${webpackConfig.output.publicPath}${theme}/`;
	}

	// scripts (js/ts via babel)
	if (options.rules.script) {
		const scriptOptions = typeof options.rules.script === 'object' ? options.rules.script : null;
		webpackRules.addJSConfig(webpackConfig, appDirectory, scriptOptions);
		if (scriptOptions && scriptOptions.typescript) {
			webpackRules.addTsConfig(webpackConfig, appDirectory, scriptOptions, { isProduction: false });
		}
	}

	// css & scss
	if (options.rules.style) {
		const scssLoaderOptions = {
			sourceMap: true,
			...(options.rules.style.sassOptions && { sassOptions: options.rules.style.sassOptions }),
		};
		webpackConfig.module.rules.push({
			test: /\.s?css$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
				},
				{
					loader: require.resolve('css-loader'),
					options: {
						importLoaders: 2,
						sourceMap: true,
					},
				},
				{
					loader: require.resolve('postcss-loader'),
					options: {
						sourceMap: true,
						postcssOptions: () => {
							return {
								plugins: [
									require('autoprefixer')({
										// @see autoprefixer options: https://github.com/postcss/autoprefixer#options
										// flexbox: 'no-2009' will add prefixes only for final and IE versions of specification.
										flexbox: 'no-2009',
										// grid: 'autoplace': enable autoprefixer grid translations and include autoplacement support.
										// not enabled - use `/* autoprefixer grid: autoplace */` in your css file
									}),
								],
							};
						},
					},
				},
				{
					loader: require.resolve('resolve-url-loader'),
					options: {
						sourceMap: true,
					},
				},
				{
					loader: require.resolve('sass-loader'),
					options: scssLoaderOptions,
				},
			],
		});

		webpackConfig.plugins.push(
			new MiniCssExtractPlugin({
				filename: 'css/[name].css',
			}),
			// we need SourceMapDevToolPlugin to make sourcemaps work
			// with MiniCSSExtractPlugin hmr mode
			// related: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
			})
		);
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
		webpackConfig.module.rules.push(utils.getEnrichedConfig(hbsRule, options.rules.hbs));
	}

	// woff fonts (for example, in CSS files)
	if (options.rules.woff) {
		const woffRule = {
			test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
			type: 'asset/resource',
			generator: {
				filename: 'media/fonts/[name]-[hash:7].[ext]',
			},
		};
		webpackConfig.module.rules.push(utils.getEnrichedConfig(woffRule, options.rules.woff));
	}

	// different font types (legacy - eg. used in older library css)
	if (options.rules.font) {
		const fontRule = {
			test: /\.(eot|svg|ttf|woff|woff2)([?#]+[A-Za-z0-9-_]*)*$/,
			type: 'asset',
			parser: {
				dataUrlCondition: {
					maxSize: 2 * 1028,
				},
			},
			generator: {
				filename: 'media/font/[name]-[hash:7].[ext]',
			},
		};
		webpackConfig.module.rules.push(utils.getEnrichedConfig(fontRule, options.rules.font));
	}

	// images
	if (options.rules.image) {
		const imageRule = {
			test: /\.(png|jpg|gif|svg)$/,
			type: 'asset',
			parser: {
				dataUrlCondition: {
					maxSize: 3 * 1028,
				},
			},
			generator: {
				filename: 'media/[ext]/[name]-[hash:7].[ext]',
			},
		};
		webpackConfig.module.rules.push(utils.getEnrichedConfig(imageRule, options.rules.image));
	}

	// feature bundle analyzer
	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	return webpackConfig;
};
module.exports.hotMiddlewareScript = hotMiddlewareScript;
module.exports.appDirectory = appDirectory;
