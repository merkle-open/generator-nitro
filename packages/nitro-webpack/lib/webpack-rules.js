'use strict';

const fs = require('fs');
const path = require('path');
const typescript = require('typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const utils = require('./utils');

function resolveBabelConfigFile(context, ruleOptions) {
	if (ruleOptions && ruleOptions.babelConfigFile) {
		return path.resolve(context, ruleOptions.babelConfigFile);
	}

	const candidates = ['babel.config.js', '.babelrc', '.babelrc.js', '.babelrc.json'];
	for (const candidate of candidates) {
		const candidatePath = path.resolve(context, candidate);
		if (fs.existsSync(candidatePath)) {
			return candidatePath;
		}
	}

	return null;
}

function resolveTsConfigFile(context, ruleOptions) {
	if (ruleOptions && ruleOptions.tsConfigFile) {
		return path.resolve(context, ruleOptions.tsConfigFile);
	}

	return typescript.findConfigFile(context, fs.existsSync);
}

function getRuleOptions(ruleOptions) {
	return ruleOptions && typeof ruleOptions === 'object' ? ruleOptions : null;
}

function ensureResolveExtensions(webpackConfig, extensions, { prepend }) {
	if (!webpackConfig.resolve) {
		webpackConfig.resolve = {};
	}
	if (!Array.isArray(webpackConfig.resolve.extensions)) {
		webpackConfig.resolve.extensions = ['.js', '.json'];
	}
	const target = webpackConfig.resolve.extensions;
	const missing = extensions.filter((ext) => !target.includes(ext));
	if (missing.length === 0) {
		return;
	}
	if (prepend) {
		target.unshift(...missing);
	} else {
		target.push(...missing);
	}
}

function getBabelLoaderOptions(context, ruleOptions) {
	const babelConfigFile = resolveBabelConfigFile(context, ruleOptions);
	const babelLoaderOptions = {
		cacheDirectory: true,
		compact: true,
	};
	if (babelConfigFile) {
		babelLoaderOptions.configFile = babelConfigFile;
	}
	return babelLoaderOptions;
}

function addJSConfig(webpackConfig, context, ruleOptions) {
	const babelLoaderOptions = getBabelLoaderOptions(context, ruleOptions);
	const scriptRuleJs = {
		test: /\.[cm]?jsx?$/,
		exclude: [/[/\\\\]node_modules[/\\\\]/],
		use: [
			{
				loader: require.resolve('babel-loader'),
				options: babelLoaderOptions,
			},
		],
	};
	webpackConfig.module.rules.push(utils.getEnrichedConfig(scriptRuleJs, getRuleOptions(ruleOptions)));
	ensureResolveExtensions(webpackConfig, ['.js', '.jsx', '.mjs', '.cjs'], { prepend: true });
}

function addTsConfig(webpackConfig, context, ruleOptions, { isProduction }) {
	const babelLoaderOptions = getBabelLoaderOptions(context, ruleOptions);
	const scriptRuleTs = {
		test: /\.[cm]?tsx?$/,
		exclude: [/[/\\\\]node_modules[/\\\\]/],
		use: [
			{
				loader: require.resolve('babel-loader'),
				options: babelLoaderOptions,
			},
			{
				loader: require.resolve('ts-loader'),
				options: {
					transpileOnly: true,
				},
			},
		],
	};
	webpackConfig.module.rules.push(utils.getEnrichedConfig(scriptRuleTs, getRuleOptions(ruleOptions)));
	ensureResolveExtensions(webpackConfig, ['.ts', '.tsx', '.mts', '.cts'], { prepend: true });

	const tsConfigFile = resolveTsConfigFile(context, ruleOptions);
	if (tsConfigFile) {
		const forkCheckerOptions = {
			async: !isProduction,
			typescript: {
				diagnosticOptions: {
					semantic: true,
					syntactic: true,
				},
				configFile: tsConfigFile,
			},
		};
		webpackConfig.plugins.push(new ForkTsCheckerWebpackPlugin(forkCheckerOptions));
	}
}

module.exports = {
	addJSConfig,
	addTsConfig,
};
