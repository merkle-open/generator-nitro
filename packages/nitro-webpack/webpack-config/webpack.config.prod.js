const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const utils = require('../lib/utils');
const webpackRules = require('../lib/webpack-rules');

const appDirectory = fs.realpathSync(process.cwd());

const bannerData = {
	date: new Date().toISOString().slice(0, 19),
	pkg: require(`${appDirectory}/package.json`),
};

const banner = `${bannerData.pkg.name}
@version v${bannerData.pkg.version}
@date ${bannerData.date}`;

module.exports = (options = { rules: {}, features: {} }) => {
	const imageMinimizerPlugins = [];
	const imageminMozjpeg = utils.getOptionalPackage('imagemin-mozjpeg');
	const imageminOptipng = utils.getOptionalPackage('imagemin-optipng');
	const imageminPngquant = utils.getOptionalPackage('imagemin-pngquant');
	const imageminSvgo = utils.getOptionalPackage('imagemin-svgo');

	if (imageminMozjpeg) {
		imageMinimizerPlugins.push(
			[
				'mozjpeg',
				{
					quality: 75,
					progressive: true,
				},
			]
		);
	}
	if (imageminOptipng) {
		imageMinimizerPlugins.push(
			[
				'optipng',
				{
					optimizationLevel: 7,
				},
			]
		);
	}
	if (imageminPngquant) {
		imageMinimizerPlugins.push('pngquant');
	}
	if (imageminSvgo) {
		imageMinimizerPlugins.push(
			[
				'svgo',
				{
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
				},
			]
		);
	}

	const minimizerPlugins = [new TerserPlugin({ extractComments: false })];
	if (!(options.features.imageMinimizer === false || imageMinimizerPlugins.length === 0)) {
		minimizerPlugins.push(
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: imageMinimizerPlugins,
					},
				},
			})
		);
	}

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
			chunkFilename: 'js/chunks/[name]-[contenthash:7].min.js',
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
			minimizer: minimizerPlugins,
		},
		stats: {
			preset: 'errors-warnings',
			assets: true,
			assetsSort: 'size',
			children: false,
			chunks: false,
			modules: false,
			colors: true,
			entrypoints: true,
			errors: true,
			errorDetails: true,
			hash: false,
			builtAt: false,
			timings: true,
			performance: true,
			warnings: true,
		},
		performance: {
			hints: 'warning',
			maxEntrypointSize: 380 * 1024,
			maxAssetSize: 380 * 1024,
		},
	};
	const theme = options.features.theme ? options.features.theme : false;
	if (theme) {
		webpackConfig.entry.ui = `./src/ui.${theme}`;
		webpackConfig.output.path = path.resolve(webpackConfig.output.path, theme);
		webpackConfig.output.publicPath = `${webpackConfig.output.publicPath}${theme}/`;
	}

	// scripts (js/ts via babel)
	if (options.rules.script) {
		const scriptOptions = typeof options.rules.script === 'object' ? options.rules.script : null;
		webpackRules.addJSConfig(webpackConfig, appDirectory, scriptOptions);
		if (scriptOptions && scriptOptions.typescript) {
			webpackRules.addTsConfig(webpackConfig, appDirectory, scriptOptions, { isProduction: true });
		}
	}

	// css & scss
	if (options.rules.style) {
		const scssMiniCSSExtractOptions = {
			...(options.rules.style.publicPath && { publicPath: options.rules.style.publicPath })
		};
		const scssLoaderOptions = {
			sourceMap: true,
			...(options.rules.style.sassOptions && { sassOptions: options.rules.style.sassOptions }),
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
									require('cssnano'),
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
				filename: 'css/[name].min.css',
				chunkFilename: 'css/chunks/[name]-[contenthash:7].min.css',
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
					maxSize: 1028,
				},
			},
			generator: {
				filename: 'media/[ext]/[name]-[hash:7].[ext]',
			},
		};

		webpackConfig.module.rules.push(utils.getEnrichedConfig(imageRule, options.rules.image));
	}

	// feature banner (enabled by default)
	if (!options.features.banner === false) {
		webpackConfig.plugins.push(new webpack.BannerPlugin({ banner, entryOnly: true }));
	}

	// feature bundle analyzer
	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	return webpackConfig;
};
module.exports.appDirectory = appDirectory;
