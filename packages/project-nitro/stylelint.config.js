const lintConfig = require('@merkle-open/stylelint-config');

lintConfig.rules['plugin/stylelint-bem-namics'] = {
	patternPrefixes: ['a', 'm', 'o', 'h', 't'],
	helperPrefixes: ['state'],
};

// node-sass can't handle modern color function notation
lintConfig.rules['color-function-notation'] = null;

module.exports = lintConfig;
