/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appDirectory = fs.realpathSync(process.cwd());
const includePath = path.join(appDirectory, 'src');

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
		devtool: 'source-map',
		context: appDirectory,
		entry: {
			ui: './src/ui.js',
			proto: './src/proto.js',
		},
		output: {
			path: path.resolve(appDirectory, 'public', 'assets'),
			filename: 'js/[name].min.js',
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
		],
		optimization: {
			// minimizer: [
			// 	new UglifyJsPlugin({
			// 		cache: true,
			// 		parallel: true,
			// 		sourceMap: true // set to true if you want JS source maps
			// 	}),
			// 	new OptimizeCSSAssetsPlugin({}),
			// ],
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /node_modules/,
						chunks: 'initial',
						name: 'vendor',
						priority: 10,
						enforce: true,
					}
				}
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

		// Prepend missing js file extensions
		const jsExtensions = ['.js', '.jsx', '.mjs'].filter(
			ext => !webpackConfig.resolve.extensions.includes(ext)
		);
		webpackConfig.resolve.extensions.unshift(...jsExtensions);

		// Add js rule
		webpackConfig.module.rules.push(
			{
				test: /\.(js|jsx|mjs)$/,
				include: includePath,
				exclude: /node_modules/,
				use: {
					loader: require.resolve('babel-loader'),
					options: {
						babelrc: false,
						cacheDirectory: true,
						presets: [
							[
								require.resolve('@babel/preset-env'),
								{
									useBuiltIns: 'entry',
								},
							],
						],
					},
				},
			},
		);
	}

	// typescript
	if (options.rules.ts) {

		// Prepend missing typescript file extensions
		const tsExtensions = ['.ts', '.tsx', '.d.ts', '.js'].filter(
			ext => !webpackConfig.resolve.extensions.includes(ext)
		);
		webpackConfig.resolve.extensions.unshift(...tsExtensions);

		// Add js rule
		webpackConfig.module.rules.push(
			// From https://github.com/TypeStrong/ts-loader/blob/master/examples/thread-loader/webpack.config.js
			{
				test: /\.(tsx?|d.ts)$/,
				include: includePath,
				use: [
					{
						loader: require.resolve('cache-loader'),
						options: {
							cacheDirectory: path.resolve('node_modules/.cache-loader'),
						},
					},
					{
						loader: require.resolve('thread-loader'),
						options: {
							// there should be 1 cpu for the fork-ts-checker-webpack-plugin
							workers: require('os').cpus().length - 1,
						},
					},
					{
						loader: require.resolve('ts-loader'),
						options: {
							// Increase build speed
							// by disabling typechecking for the main process
							// and is required to be used with thread-loader
							// see https://github.com/TypeStrong/ts-loader/blob/master/examples/thread-loader/webpack.config.js
							happyPackMode: true,
						},
					},
				],
			},
		);

		webpackConfig.plugins.push(
			new ForkTsCheckerWebpackPlugin({
				async: false,
				checkSyntacticErrors: true,
			}),
		);
	}

	// CSS & SCSS
	if (options.rules.scss) {
		webpackConfig.module.rules.push(
			{
				test: /\.?scss$/,
				include: includePath,
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
									require('autoprefixer'),
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
				chunkFilename: '[id].css',
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
				include: includePath,
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
		webpackConfig.module.rules.push(
			{
				test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
				include: includePath,
				loader: require.resolve('file-loader'),
				options: {
					name: 'media/fonts/[name]-[hash:7].[ext]',
				},
			},
		);
	}

	// image loader
	if (options.rules.image) {
		webpackConfig.module.rules.push(
			// image loader & minification
			{
				test: /\.(png|jpg|gif|svg|ico)$/,
				include: includePath,
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
				include: includePath,
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
