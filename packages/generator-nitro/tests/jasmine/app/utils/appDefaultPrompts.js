'use strict';

// to avoid mixing up properties with global '.yo-rc-global.json',  we have to pass in all prompt options for test cases
// (see bug: https://github.com/yeoman/yeoman-test/issues/45)

const appDefaultPrompts = {
	templateEngine: 'hbs',
	jsCompiler: 'ts',
	themes: false,
	clientTpl: false,
	exampleCode: false,
	exporter: false,
};

module.exports = appDefaultPrompts;
