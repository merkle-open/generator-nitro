'use strict';

const fs = require('fs');
const path = require('path');
const gitHook = {
	directory: path.resolve(__dirname, '..', '.git', 'hooks'),
	comment: '# This git hook was installed with `gulp install-githooks`',
	hooks: [
		'applypatch-msg',
		'commit-msg',
		'post-applypatch',
		'post-checkout',
		'post-commit',
		'post-merge',
		'post-receive',
		'pre-applypatch',
		'pre-auto-gc',
		'pre-commit',
		'pre-push',
		'pre-rebase',
		'pre-receive',
		'prepare-commit-msg',
		'update',
	],
	isInstalledHook(filename) {
		const data = fs.readFileSync(filename, 'utf-8');
		return data.indexOf(gitHook.comment) !== -1;
	},
	write(hook, filenameSource, filenameTarget) {
		const content = `${fs.readFileSync(filenameSource, 'utf-8')}\n\n${gitHook.comment}`;
		try {
			fs.writeFileSync(filenameTarget, content, { mode: '755' });
			console.log(`Git hook "${hook}" installed successfully.`);
		} catch (error) {
			console.log(`Installing hook "${hook}" failed: `, error);
		}
	},
	remove(hook, filenameTarget) {
		try {
			fs.unlinkSync(filenameTarget);
			console.log(`Git hook "${hook}" removed`);
		} catch (error) {
			console.log(`Removing hook "${hook}" failed: `, error);
		}
	},
};

module.exports = (gulp, plugins) => {
	return () => {
		if (fs.existsSync(gitHook.directory)) {
			gitHook.hooks.forEach((hook) => {
				const hookSource = path.resolve(__dirname, '..', 'project', '.githooks', hook);
				const hookTarget = path.resolve(gitHook.directory, hook);
				if (fs.existsSync(hookSource)) {
					if (!fs.existsSync(hookTarget) || gitHook.isInstalledHook(hookTarget)) {
						gitHook.write(hook, hookSource, hookTarget);
					} else {
						console.log(`Skipping git hook "${hook}". There ist an existing user hook.`);
					}
				} else if (fs.existsSync(hookTarget) && gitHook.isInstalledHook(hookTarget)) {
					gitHook.remove(hook, hookTarget);
				}
			});
		} else {
			console.error('Unable to install git hooks. Maybe this is not the root of a git repository.');
		}
	};
};
