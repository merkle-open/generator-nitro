const lintConfig = require('@namics/stylelint-config');

lintConfig.rules['plugin/stylelint-bem-namics'] = {
	patternPrefixes: ['a', 'm', 'o', 'h', 't'],
	helperPrefixes: ['state'],
};

// lintConfig.rules['scss/selector-nest-combinators'] = false;

module.exports = lintConfig;
