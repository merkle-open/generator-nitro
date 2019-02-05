/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FontConfigWebpackPlugin = require('font-config-webpack-plugin');
const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');

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
		webpackConfig.plugins.push(
			new JsConfigWebpackPlugin({ babelConfigFile: './babel.config.js' }),
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
		webpackConfig.plugins.push(new TsConfigWebpackPlugin());
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
								require('autoprefixer')({
									// @see autopreficer options: https://github.com/postcss/autoprefixer#options
									// flexbox: 'no-2009' will add prefixes only for final and IE versions of specification.
									flexbox: 'no-2009',
									// grid: 'autoplace': enable autoprefixer grid translations and include autoplacement support.
									// not enabled - use `/* autoprefixer grid: autoplace */` in your css file
								}),
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
		webpackConfig.plugins.push(
			new FontConfigWebpackPlugin({ name: 'media/fonts/[name]-[hash:7].[ext]' }),
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
