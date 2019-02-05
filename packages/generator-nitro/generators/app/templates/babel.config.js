'use strict';

module.exports = {
	presets: [[require.resolve('@babel/preset-env'), { useBuiltIns: 'entry' }]],
	plugins: [
		[require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
		require.resolve('@babel/plugin-syntax-dynamic-import'),
	],
};
