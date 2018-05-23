const path = require('path');
const webpack = require('webpack');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const config = require('config');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	devtool: 'inline-source-map',
	context: path.resolve(__dirname, '../../'),
	entry : {
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
		path: path.resolve(__dirname, '../../public/assets'),
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
						loader: 'style-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 2,
						},
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
			// styles (MiniCSSExtract Plugin)
			// {
			// 	test: /\.s?css$/,
			// 	use: [
			// 		MiniCssExtractPlugin.loader,
			// 		{
			// 			loader: 'css-loader',
			// 			options: {
			// 				importLoaders: 2,
			// 				sourceMap: true,
			// 			}
			// 		},
			// 		{
			// 			loader: 'postcss-loader',
			// 			options: {
			// 				plugins: () => [
			// 					require('autoprefixer'),
			// 				],
			// 				sourceMap: true,
			// 			}
			// 		},
			// 		{
			// 			loader: 'sass-loader',
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
					loader: 'babel-loader',
					options: {
						babelrc: false,
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
					},
				},
			},
			// woff fonts (for example, in CSS files)
			{
				test: /.(woff(2)?)(\?[a-z0-9]+)?$/,
				use: 'file-loader',
			},
			// image loader
			{
				test: /\.(png|jpg|gif|svg|ico)$/,
				use: 'file-loader',
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
	module.exports.plugins.push(
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
	module.exports.module.rules.push(
		{
			enforce: 'pre',
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'eslint-loader',
				options: {
					cache: true,
					// formatter: require('eslint-friendly-formatter'),
				},
			},
		},
	);
}
