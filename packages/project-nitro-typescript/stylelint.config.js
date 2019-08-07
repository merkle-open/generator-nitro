const lintConfig = require('@namics/stylelint-config');

lintConfig.rules['plugin/stylelint-bem-namics'] = {
	patternPrefixes: ['a', 'm', 'o', 'h'],
	helperPrefixes: ['state'],
};

lintConfig.rules['property-case'] = 'lower';
lintConfig.rules['selector-type-case'] = 'lower';
lintConfig.rules['string-quotes'] = 'single';
lintConfig.rules['unit-case'] = 'lower';

module.exports = lintConfig;
