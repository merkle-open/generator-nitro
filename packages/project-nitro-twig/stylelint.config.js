const lintConfig = require('@merkle-open/stylelint-config');

lintConfig.rules['plugin/stylelint-bem-namics'] = {
	patternPrefixes: ['a', 'm', 'o', 'h'],
	helperPrefixes: ['state'],
};

lintConfig.rules['comment-empty-line-before'] = null;
lintConfig.rules['custom-property-empty-line-before'] = null;
lintConfig.rules['media-feature-range-notation'] = ['context', { severity: 'warning' }];

module.exports = lintConfig;
