const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const config = require('config');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const appDirectory = fs.realpathSync(process.cwd());

module.exports = () => {
	const webpackConfig = {
		// devtool: 'eval',
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
		module: {
			rules: [
				// styles
				{
					test: /\.?scss$/,
					use: [
						{
							loader: require.resolve('style-loader'),
							options: {
								sourceMap: true,
							},
						},
						{
							loader: require.resolve('css-loader'),
							options: {
								sourceMap: true,
								importLoaders: 3,
							},
						},
						{
							loader: require.resolve('postcss-loader'),
							options: {
								plugins: (loader) => [
									require('autoprefixer'),
									require('iconfont-webpack-plugin')({
										resolve: loader.resolve,
									}),
									// new IconfontWebpackPlugin(loader),
									// new IconfontWebpackPlugin({
									// 	resolve: loader.resolve,
									// }),
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
				// styles (MiniCSSExtract Plugin)
				// {
				// 	test: /\.s?css$/,
				// 	use: [
				// 		MiniCssExtractPlugin.loader,
				// 		{
				// 			loader: require.resolve('css-loader'),
				// 			options: {
				// 				importLoaders: 2,
				// 				sourceMap: true,
				// 			}
				// 		},
				// 		{
				// 			loader: require.resolve('postcss-loader'),
				// 			options: {
				// 				plugins: () => [
				// 					require('autoprefixer'),
				// 				],
				// 				sourceMap: true,
				// 			}
				// 		},
				// 		{
				// 			loader: require.resolve('sass-loader'),
				// 			options: {
				// 				sourceMap: true,
				// 			},
				// 		},
				// 	],
				// },
				// js
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
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
					use: require.resolve('file-loader'),
				},
				// image loader
				{
					test: /\.(png|jpg|gif|svg)$/,
					use: require.resolve('file-loader'),
				},
			],
		},
		plugins: [
			// new MiniCssExtractPlugin({
			// 	filename: 'css/[name].css',
			// 	// chunkFilename: '[id].css',
			// }),
			new webpack.HotModuleReplacementPlugin(),
			// new BundleAnalyzerPlugin(),
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
		// stats: 'minimal',
	};

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

	if (config.get('code.validation.eslint.live')) {
		webpackConfig.module.rules.push(
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: require.resolve('eslint-loader'),
					options: {
						cache: true,
						// formatter: require('eslint-friendly-formatter'),
					},
				},
			},
		);
	}

	return webpackConfig;
};
