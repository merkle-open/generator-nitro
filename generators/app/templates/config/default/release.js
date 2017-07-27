// Release Config
// https://github.com/namics/nitro-release

'use strict';

const config = {
	release: {
		bumpFiles: ['package.json'],
		commit: false,
		commitMessage: 'Release %VERSION%',
		push: false,
		pushBranch: 'master',
		pushTo: 'origin',
		tag: false,
		tagName: 'v%VERSION%',
	},
};

module.exports = config.release;
