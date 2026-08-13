module.exports = {
	presets: [[require.resolve('@babel/preset-env')]],
	plugins: [
		[
			require.resolve('babel-plugin-polyfill-corejs3'),
			{
				// method: 'usage-pure',
				method: 'usage-global',
			},
		],
		[require.resolve('@babel/plugin-proposal-decorators'), { version: 'legacy' }],
		require.resolve('@babel/plugin-transform-class-properties'),
	],
};
