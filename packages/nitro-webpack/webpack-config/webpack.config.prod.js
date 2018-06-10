/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appDirectory = fs.realpathSync(process.cwd());

const bannerData = {
	date: new Date().toISOString().slice(0, 19),
	pkg: require(`${appDirectory}/package.json`),
	git: {
		branch: gitRevisionPlugin.branch(),
		version: gitRevisionPlugin.version(),
	},
};
const banner = `${bannerData.pkg.name}
	@version v${bannerData.pkg.version}
	@date ${bannerData.date}
	@source ${bannerData.git.branch}|${bannerData.git.version}`;

module.exports = () => {
	return {
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
			extensions: ['.ts', '.tsx', '.mjs', '.js', '.d.ts'],
		},
		module: {
			rules: [
				// CSS & SCSS
				{
					test: /\.?scss$/,
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

				// JS
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						// loader: require.resolve('babel-loader'),
						loader: require.resolve('babel-loader'),
						options: {
							babelrc: false,
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

				// TS
				// From https://github.com/TypeStrong/ts-loader/blob/master/examples/thread-loader/webpack.config.js
				{
					test: /\.(tsx?|d.ts)$/,
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

				// handlebars precompiled templates
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
				// woff fonts (for example, in CSS files)
				{
					test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
					loader: require.resolve('file-loader'),
					options: {
						name: 'media/fonts/[name]-[hash:7].[ext]',
					},
				},
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
									{ collapseGroups: false },
									{ cleanupIDs: false },
									{ removeUnknownsAndDefaults: false },
									{ removeViewBox: false }
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
			],
		},
		plugins: [
			new webpack.BannerPlugin({ banner }),
			new MiniCssExtractPlugin({
				filename: 'css/[name].min.css',
				chunkFilename: '[id].css',
			}),
			new OptimizeCSSAssetsPlugin({
				// cssProcessorOptions: {
				// 	sourceMap: true,
				// },
			}),
			new CaseSensitivePathsPlugin({ debug: false }),
			new ForkTsCheckerWebpackPlugin({
				async: false,
				checkSyntacticErrors: true,
			}),
			// new BundleAnalyzerPlugin(),
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
			errorDetails: false,
			hash: false,
			warnings: false,
		},
	};
};
