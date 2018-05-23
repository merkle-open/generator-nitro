const path = require('path');
const webpack = require('webpack');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const bannerData = {
	date: new Date().toISOString().slice(0, 19),
	pkg: require('../../package.json'),
	git: {
		branch: gitRevisionPlugin.branch(),
		version: gitRevisionPlugin.version(),
	},
};
const banner = `${bannerData.pkg.name}
	@version v${bannerData.pkg.version}
	@date ${bannerData.date}
	@source ${bannerData.git.branch}|${bannerData.git.version}`;

module.exports = {
	devtool: 'source-map',
	context: path.resolve(__dirname, '../../'),
	entry: {
		ui: './src/ui.js',
		proto: './src/proto.js',
	},
	output: {
		path: path.resolve(__dirname, '../../public/assets'),
		filename: 'js/[name].min.js',
		publicPath: '/assets/',
	},
	module: {
		rules: [
			// styles
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 2,
						}
					},
					{
						loader: 'postcss-loader',
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
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			// js
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									useBuiltIns: 'entry',
								},
							],
						],
					},
				},
			},
			// handlebars precompiled templates
			{
				test: /\.hbs$/,
				exclude: /node_modules/,
				use: {
					loader: 'handlebars-loader',
					options: {
						// helperDirs: [
						// 	path.resolve(__dirname, '../../app/templating/hbs/helpers'),
						// ],
						// knownHelpers: [],
						// runtime: '',
						// partialDirs: ''
					}
				}
			},
			// woff fonts (for example, in CSS files)
			{
				test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader',
				options: {
					name: 'media/fonts/[name]-[hash:7].[ext]',
				},
			},
			// image loader & minification
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'img-loader',
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
				loader: 'url-loader',
				options: {
					limit: 3 * 1028,
					name: 'media/[ext]/[name]-[hash:7].[ext]',
				},
			},
		],
	},
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
		// new BundleAnalyzerPlugin(),
	],
};
