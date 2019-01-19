/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const appDirectory = fs.realpathSync(process.cwd());
const includePath = path.join(appDirectory, 'src');

module.exports = (options = { rules: {}, features: {} }) => {

	const webpackConfig = {
		mode: 'development',
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
			chunkFilename: 'js/[name]-[hash:7].js',
			publicPath: '/assets/',
			pathinfo: false,
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
		watchOptions: {
			ignored: /node_modules/,
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
						test: /[\\/]node_modules[\\/].*\.(js|jsx|mjs|ts|tsx)/,
						// use fix filename for usage in view
						filename: 'js/vendors.js',
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
						plugins: [
							[ require.resolve('@babel/plugin-proposal-decorators'), { 'legacy': true } ],
							require.resolve('@babel/plugin-syntax-dynamic-import'),
						],
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

		// eslint live validation
		if (options.rules.js.eslint) {
			webpackConfig.module.rules.push(
				{
					enforce: 'pre',
					test: /\.(js|jsx|mjs)$/,
					include: includePath,
					exclude: /node_modules/,
					use: {
						loader: require.resolve('eslint-loader'),
						options: {
							eslintPath: require.resolve('eslint'),
							cache: true,
						},
					},
				},
			);
		}
	}

	// typescript
	if (options.rules.ts) {

		// Prepend missing typescript file extensions
		const tsExtensions = ['.ts', '.tsx', '.js'].filter(
			ext => !webpackConfig.resolve.extensions.includes(ext)
		);
		webpackConfig.resolve.extensions.unshift(...tsExtensions);

		// Add ts rule
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
				include: includePath,
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

		// stylelint live validation
		if (options.rules.scss.stylelint) {
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
			}
		);
	}

	// woff fonts (for example, in CSS files)
	if (options.rules.woff) {
		webpackConfig.module.rules.push(
			{
				test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
				include: includePath,
				use: require.resolve('file-loader'),
			}
		);
	}

	// image loader
	if (options.rules.image) {
		webpackConfig.module.rules.push(
			{
				test: /\.(png|jpg|gif|svg)$/,
				include: includePath,
				use: require.resolve('file-loader'),
			}
		);
	}

	if (options.features.bundleAnalyzer) {
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	return webpackConfig;
};

/* eslint-enable */
