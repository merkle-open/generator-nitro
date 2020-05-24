'use strict';

module.exports = {
	presets: [[require.resolve('@babel/preset-env'), { useBuiltIns: 'usage', corejs: 3 }]],
	plugins: [
		[require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
		require.resolve('@babel/plugin-proposal-class-properties'),
		require.resolve('@babel/plugin-syntax-dynamic-import'),
	],
};
