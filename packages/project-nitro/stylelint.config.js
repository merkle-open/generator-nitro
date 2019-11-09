const lintConfig = require('@namics/stylelint-config');

lintConfig.rules['plugin/stylelint-bem-namics'] = {
	patternPrefixes: ['a', 'm', 'o', 'h', 't'],
	helperPrefixes: ['state'],
};

module.exports = lintConfig;
