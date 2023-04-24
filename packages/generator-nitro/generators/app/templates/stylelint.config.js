const lintConfig = require('@merkle-open/stylelint-config');

lintConfig.rules['plugin/stylelint-bem-namics'] = {
	patternPrefixes: ['a', 'm', 'o', 'h'],
	helperPrefixes: ['state'],
};

// remove deprecated checks - handled by prettier
lintConfig.rules['at-rule-name-case'] = null;
lintConfig.rules['color-hex-case'] = null;
lintConfig.rules['declaration-block-semicolon-newline-after'] = null;
lintConfig.rules['declaration-block-trailing-semicolon'] = null;
lintConfig.rules['declaration-colon-space-after'] = null;
lintConfig.rules['max-empty-lines'] = null;
lintConfig.rules['media-feature-name-case'] = null;
lintConfig.rules['no-missing-end-of-source-newline'] = null;
lintConfig.rules['number-leading-zero'] = null;
lintConfig.rules['property-case'] = null;
lintConfig.rules['selector-list-comma-newline-after'] = null;
lintConfig.rules['selector-pseudo-class-case'] = null;
lintConfig.rules['selector-pseudo-element-case'] = null;
lintConfig.rules['string-quotes'] = null;
lintConfig.rules['unit-case'] = null;
lintConfig.rules['indentation'] = null;

// node-sass can't handle modern color function notation
lintConfig.rules['color-function-notation'] = null;

module.exports = lintConfig;
