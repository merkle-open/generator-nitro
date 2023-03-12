const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
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

// hack: OpenSSL 3 does not support md4 anymore, but legacy webpack 4 hardcoded it: https://github.com/webpack/webpack/issues/13572
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm);

const appDirectory = fs.realpathSync(process.cwd());

const bannerData = {
	date: new Date().toISOString().slice(0, 19),
	pkg: require(`${appDirectory}/package.json`),
};

const banner = `${bannerData.pkg.name}
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
		plugins: [new CaseSensitivePathsPlugin({ debug: false }), new WebpackBar()],
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
						test: /[\\/]node_modules[\\/].*\.(js|jsx|mjs|ts|tsx)$/,
						// use fix filename for usage in view
						filename: 'js/vendors.min.js',
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
		webpackConfig.plugins.push(new JsConfigWebpackPlugin({ babelConfigFile: './babel.config.js' }));
	}

	// typescript
	if (options.rules.ts) {
		webpackConfig.plugins.push(new TsConfigWebpackPlugin());
	}

	// css & scss
	if (options.rules.scss) {
		const scssMiniCSSExtractOptions = {
			...(options.rules.scss.publicPath && { publicPath: options.rules.scss.publicPath })
		};
		const scssLoaderOptions = {
			...(options.rules.scss.implementation && { implementation: options.rules.scss.implementation })
		};
		webpackConfig.module.rules.push({
			test: /\.s?css$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: scssMiniCSSExtractOptions,
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
						postcssOptions: (loader) => {
							return {
								plugins: [
									require('iconfont-webpack-plugin')({
										resolve: loader.resolve,
									}),
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
				filename: 'css/[name].min.css',
				chunkFilename: 'css/[name]-[contenthash:7].min.css',
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
					},
				},
			})
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

		const imageminMozjpeg = utils.getOptionalPackage('imagemin-mozjpeg');
		const imageminOptipng = utils.getOptionalPackage('imagemin-optipng');
		const imageminPngquant = utils.getOptionalPackage('imagemin-pngquant');
		const imageminSvgo = utils.getOptionalPackage('imagemin-svgo');

		// console.log('imagemin-mozjpeg: ', imageminMozjpeg ? 'installed' : 'NOT');
		// console.log('imagemin-optipng: ', imageminOptipng ? 'installed' : 'NOT');
		// console.log('imagemin-pngquant: ', imageminPngquant ? 'installed' : 'NOT');
		// console.log('imagemin-svgo: ', imageminSvgo ? 'installed' : 'NOT');

		// image loader & minification
		const imageMinificationRule = {
			test: /\.(png|jpg|svg)$/,
			// Specify enforce: 'pre' to apply the loader before url-loader
			enforce: 'pre',
			use: {
				loader: require.resolve('img-loader'),
				options: {
					plugins: [],
				},
			},
		};

		if (imageminMozjpeg) {
			imageMinificationRule.use.options.plugins.push(
				imageminMozjpeg({
					quality: 75,
					progressive: true,
				})
			);
		}
		if (imageminOptipng) {
			imageMinificationRule.use.options.plugins.push(
				imageminOptipng({
					optimizationLevel: 7,
				})
			);
		}
		if (imageminPngquant) {
			imageMinificationRule.use.options.plugins.push(
				imageminPngquant({
					// floyd: 0.5,
					// speed: 2
				})
			);
		}
		if (imageminSvgo) {
			imageMinificationRule.use.options.plugins.push(
				imageminSvgo({
					plugins: [
						{
							name: 'preset-default',
							params: {
								overrides: {
									removeViewBox: false,
								},
							},
						},
					],
				})
			);
		}

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

		webpackConfig.module.rules.push(imageMinificationRule, utils.getEnrichedConfig(imageRule, options.rules.image));
	}

	// feature banner (enabled by default)
	if (!options.features.banner === false) {
		webpackConfig.plugins.push(new webpack.BannerPlugin({ banner }));
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
module.exports.appDirectory = appDirectory;
