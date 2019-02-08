/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FontConfigWebpackPlugin = require('font-config-webpack-plugin');
const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const WebpackBar = require('webpackbar');

const appDirectory = fs.realpathSync(process.cwd());

const bannerData = {
	date: new Date().toISOString().slice(0, 19),
	pkg: require(`${appDirectory}/package.json`),
};

let banner = `${bannerData.pkg.name}
@version v${bannerData.pkg.version}
@date ${bannerData.date}`;

module.exports = (options = { rules: {}, features: {} }) => {

	if (options.features.gitInfo) {
		const GitRevisionPlugin = require('git-revision-webpack-plugin');
		const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });
		bannerData.git = {
			branch: gitRevisionPlugin.branch(),
			version: gitRevisionPlugin.version(),
		};

		banner += `
@source ${bannerData.git.branch}|${bannerData.git.version}`;
	}

	const webpackConfig = {
		mode: 'production',
		devtool: 'source-map',
		context: appDirectory,
		entry: {
			ui: './src/ui.js',
			proto: './src/proto.js',
		},
		output: {
			path: path.resolve(appDirectory, 'public', 'assets'),
			filename: 'js/[name].min.js',
			chunkFilename: 'js/[name]-[hash:7].min.js',
			publicPath: '/assets/',
		},
		resolve: {
			extensions: ['.mjs', '.js'],
			symlinks: false,
		},
		module: {
			rules: [],
		},
		plugins: [
			new webpack.BannerPlugin({ banner }),
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

	// JS
	if (options.rules.js) {
		webpackConfig.plugins.push(
			new JsConfigWebpackPlugin({ babelConfigFile: './babel.config.js' }),
		);
	}

	// typescript
	if (options.rules.ts) {
		webpackConfig.plugins.push(new TsConfigWebpackPlugin());
	}

	// CSS & SCSS
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
							sourceMap: true,
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
				// cssProcessorOptions: {
				// 	sourceMap: true,
				// },
			}),
		);
	}

	// handlebars precompiled templates
	if (options.rules.hbs) {
		webpackConfig.module.rules.push(
			{
				test: /\.hbs$/,
				exclude: [
					/node_modules/,
					path.resolve(appDirectory, 'src/views'),
				],
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
			},

		);
	}

	// woff fonts (for example, in CSS files)
	if (options.rules.woff) {
		webpackConfig.plugins.push(
			new FontConfigWebpackPlugin({ name: 'media/fonts/[name]-[hash:7].[ext]' }),
		);
	}

	// image loader
	if (options.rules.image) {
		webpackConfig.module.rules.push(
			// image loader & minification
			{
				test: /\.(png|jpg|gif|svg|ico)$/,
				loader: require.resolve('img-loader'),
				// Specify enforce: 'pre' to apply the loader before url-loader
				enforce: 'pre',
				options: {
					plugins: [
						require('imagemin-gifsicle')({
							interlaced: false
						}),
						require('imagemin-jpegtran')({
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
						})
					]
				}
			},
			// url loader for images (for example, in CSS files)
			// inlines assets below a limit
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: require.resolve('url-loader'),
				options: {
					limit: 3 * 1028,
					name: 'media/[ext]/[name]-[hash:7].[ext]',
				},
			},
		);
	}

	// feature bundle analyzer
	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	return webpackConfig;
};

/* eslint-enable */
