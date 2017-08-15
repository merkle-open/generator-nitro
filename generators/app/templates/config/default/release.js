'use strict';

/**
 * Release Config
 * https://github.com/namics/nitro-release
 */

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
