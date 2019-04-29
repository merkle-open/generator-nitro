module.exports = {
	extends: [
		'@namics/eslint-config/configurations/typescript-browser.js',
		'@namics/eslint-config/configurations/typescript-browser-disable-styles.js',
	].map(require.resolve),
	rules: {},
};
