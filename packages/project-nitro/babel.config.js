'use strict';

module.exports = {
	presets: [[require.resolve('@babel/preset-env'), { useBuiltIns: 'entry', corejs: 2 }]],
	plugins: [
		[require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
		require.resolve('@babel/plugin-syntax-dynamic-import'),
	],
};
