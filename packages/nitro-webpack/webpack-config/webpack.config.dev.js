/* eslint-disable */

const path = require('path');
const fs = require('fs');
const config = require('config');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const appDirectory = fs.realpathSync(process.cwd());

module.exports = (options = { rules: {}, features: {} }) => {

	const webpackConfig = {
		devtool: 'eval-source-map',
		context: appDirectory,
		entry: {
			ui: [
				'./src/ui.js',
				hotMiddlewareScript,
			],
			proto: [
				'./src/proto.js',
				hotMiddlewareScript,
			],
		},
		output: {
			path: path.resolve(appDirectory, 'public', 'assets'),
			filename: 'js/[name].js',
			publicPath: '/assets/',
		},
		resolve: {
			extensions: [],
			symlinks: false,
		},
		module: {
			rules: [],
		},
		plugins: [
			new CaseSensitivePathsPlugin({ debug: false }),
			new webpack.HotModuleReplacementPlugin(),
		],
		optimization: {
			noEmitOnErrors: true,
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
			warnings: false,
		},
	};

	// JS
	if (options.rules.js) {
		webpackConfig.resolve.extensions.push('.js', '.jsx', '.mjs');

		webpackConfig.module.rules.push(
			{
				test: /\.(js|jsx|mjs)$/,
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

		webpackConfig.resolve.extensions.push('.ts', '.tsx', '.d.ts');

		webpackConfig.module.rules.push(
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
			}
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
				test: /\.s?css$/,
				use: [
					// css-hot-loader removes the flash on unstyled content (FOUC) from style-loader
					// may be removed when MiniCssExtractPlugin supports HMR
					// related: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
					require.resolve('css-hot-loader'),
					MiniCssExtractPlugin.loader,
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
								require('autoprefixer'),
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
			// with MiniCSSExtractPlugin and css-hot-loader
			// related: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
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
			}
		);
	}

	// woff fonts (for example, in CSS files)
	if (options.rules.woff) {
		webpackConfig.module.rules.push(
			{
				test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
				use: require.resolve('file-loader'),
			}
		);
	}

	// image loader
	if (options.rules.image) {
		webpackConfig.module.rules.push(
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: require.resolve('file-loader'),
			}
		);
	}

	// stylelint live validation
	if (config.get('code.validation.stylelint.live')) {
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

	// eslint live validation
	if (config.get('code.validation.eslint.live')) {
		webpackConfig.module.rules.push(
			{
				enforce: 'pre',
				test: /\.(js|jsx|mjs)$/,
				// include: paths.srcPaths,
				exclude: [/[/\\\\]node_modules[/\\\\]/],
				use: {
					loader: require.resolve('eslint-loader'),
					options: {
						eslintPath: require.resolve('eslint'),
						cache: true,
						// formatter: require('eslint-friendly-formatter'),
					},
				},
			},
		);
	}

	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	return webpackConfig;
};

/* eslint-enable */
