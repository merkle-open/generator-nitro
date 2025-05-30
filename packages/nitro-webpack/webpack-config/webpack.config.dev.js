const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const DynamicAliasResolverPlugin = require('../plugins/dynamicAliasResolver');
const utils = require('../lib/utils');

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const appDirectory = fs.realpathSync(process.cwd());

// hack: OpenSSL 3 does not support md4 anymore, but legacy webpack 4 hardcoded it: https://github.com/webpack/webpack/issues/13572
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm);

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
						test: /[\\/]node_modules[\\/].*\.(js|jsx|mjs|ts|tsx)$/,
						// use fix filename for usage in view
						filename: 'js/vendors.js',
						// Exclude proto dependencies going into vendors
						chunks: (chunk) => chunk.name !== 'proto',
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
		infrastructureLogging: {
			level: 'warn'
		}
	};
	const theme = options.features.theme ? options.features.theme : false;

	if (theme) {
		webpackConfig.entry.ui = [`./src/ui.${theme}`, hotMiddlewareScript];
		webpackConfig.output.path = path.resolve(webpackConfig.output.path, theme);
		webpackConfig.output.publicPath = `${webpackConfig.output.publicPath}${theme}/`;
	}

	// js
	if (options.rules.js) {
		webpackConfig.plugins.push(new JsConfigWebpackPlugin({ babelConfigFile: './babel.config.js' }));
	}

	// typescript
	if (options.rules.ts) {
		webpackConfig.plugins.push(new TsConfigWebpackPlugin());
	}

	// css & scss
	if (options.rules.scss) {
		const scssLoaderOptions = {
			...(options.rules.scss.implementation && { implementation: options.rules.scss.implementation }),
			...(options.rules.scss.sassOptions && { sassOptions: options.rules.scss.sassOptions }),
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
					},
				},
				{
					loader: require.resolve('postcss-loader'),
					options: {
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
			use: {
				loader: require.resolve('file-loader'),
				options: {
					name: 'media/fonts/[name]-[hash:7].[ext]',
				},
			},
		};
		webpackConfig.module.rules.push(utils.getEnrichedConfig(woffRule, options.rules.woff));
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
				},
			},
		};
		webpackConfig.module.rules.push(utils.getEnrichedConfig(fontRule, options.rules.font));
	}

	// images
	if (options.rules.image) {
		const imageRule = {
			test: /\.(png|jpg|gif|svg)$/,
			use: {
				loader: require.resolve('file-loader'),
			},
		};
		webpackConfig.module.rules.push(utils.getEnrichedConfig(imageRule, options.rules.image));
	}

	// feature bundle analyzer
	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	// feature dynamic alias
	if (
		options.features.dynamicAlias &&
		options.features.dynamicAlias.search &&
		options.features.dynamicAlias.replace
	) {
		webpackConfig.resolve.plugins = [new DynamicAliasResolverPlugin(options.features.dynamicAlias)];
	}

	return webpackConfig;
};
module.exports.hotMiddlewareScript = hotMiddlewareScript;
module.exports.appDirectory = appDirectory;
