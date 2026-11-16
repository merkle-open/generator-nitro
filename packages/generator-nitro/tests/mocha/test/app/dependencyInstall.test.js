const nodeAssert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const helpers = require('yeoman-test').default;
const utils = require('../../helpers/utils');

describe('nitro:app dependency installation', function () {
	this.timeout(20000);

	for (const update of [false, true]) {
		it(`does not install dependencies when ${update ? 'updating' : 'creating'} a project`, async () => {
			const messages = [];
			const originalExecSync = childProcess.execSync;
			childProcess.execSync = () => {
				throw new Error('The generator must not execute npm commands');
			};

			try {
				const result = await helpers
					.run(path.join(__dirname, '../../../../generators/app'))
					.inTmpDir((dir) => {
						if (update) {
							fs.writeFileSync(path.join(dir, '.yo-rc.json'), JSON.stringify({
								'generator-nitro': { name: 'test-project' },
							}));
							fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
								name: 'test-project',
								devDependencies: { husky: '4.3.8' },
							}));
						}
					})
					.withEnvironment((env) => {
						env.options.skipInstall = false;
						env.options.nodePackageManager = 'nitro-test-no-install';
						const originalLog = env.adapter.log;
						env.adapter.log = Object.assign((...args) => {
							messages.push(args.join(' '));
							return originalLog(...args);
						}, originalLog);
					})
					.withOptions({ skipInstall: false })
					.withPrompts({ ...utils.defaultPrompts, name: 'test-project', update: true });

				nodeAssert.strictEqual(result.env.options.skipInstall, false);
				nodeAssert.strictEqual(result.env.composedStore.customInstallTask, true);
				result.assertFile('package.json');
				nodeAssert.ok(result.memFs.get(path.join(result.cwd, 'package.json')).committed);
				result.assertNoFile(['node_modules', 'package-lock.json']);
				nodeAssert.ok(!messages.some((message) => message.includes('not a supported package manager')));
				if (update) {
					const pkg = JSON.parse(fs.readFileSync(path.join(result.cwd, 'package.json'), 'utf8'));
					nodeAssert.strictEqual(pkg.devDependencies.husky, '9.1.7');
					nodeAssert.ok(messages.some((message) => message.includes('Husky 4 git hooks may remain')));
				}
			} finally {
				childProcess.execSync = originalExecSync;
			}
		});
	}
});
