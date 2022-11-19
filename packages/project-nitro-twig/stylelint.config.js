const lintConfig = require('@namics/stylelint-config');

lintConfig.rules['plugin/stylelint-bem-namics'] = {
	patternPrefixes: ['a', 'm', 'o', 'h'],
	helperPrefixes: ['state'],
};

// node-sass can't handle modern color function notation
lintConfig.rules['color-function-notation'] = null;

module.exports = lintConfig;
