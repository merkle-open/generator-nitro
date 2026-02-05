const path = require('path');
const fs = require('fs-extra');
const helpers = require('yeoman-test').default;
const assert = require('yeoman-assert');

const projectPaths = [
	'config',
	'project/helpers',
	'project/locales',
	'project/routes',
	'project/server',
	'project/viewData',
	'public',
	'src/views',
	'src/patterns/',
	'.node-version',
];
// eslint-disable-next-line complexity
const projectCopyFilter = (src) => {
	return (
		src.indexOf('node_modules') === -1 &&
		src.indexOf('dist') === -1 &&
		src.indexOf('export') === -1 &&
		src.indexOf('tests') === -1 &&
		src.indexOf('tmp') === -1 &&
		src.indexOf('config') === -1 &&
		src.indexOf('reports') === -1 &&
		src.indexOf('.husky') === -1
	);
};

function runGenerator() {
	return helpers
		.run(path.join(__dirname, '../../../../generators/server'))
		.inTmpDir((dir) => {
			// we need a valid project as playground
			fs.copySync(path.join(__dirname, '../../../../../project-nitro'), dir, { filter: projectCopyFilter });
			fs.emptyDirSync(path.join(dir, 'config'));
			fs.writeJsonSync(path.join(dir, 'config', 'default.json'), { server: { projectPaths } });
		});
}

describe('nitro:server', function () {
	this.timeout(20000);

	describe('when using default options', () => {
		const folder = 'dist';

		before(() => runGenerator());

		// base files
		it('creates project files', () => {
			assert.file([
				`${folder}/config`,
				`${folder}/project`,
				`${folder}/public`,
				`${folder}/src/patterns`,
				`${folder}/src/views`,
				`${folder}/.node-version`,
				`${folder}/package.json`,
				`${folder}/readme.md`,
			]);
		});

		it('creates project files', () => {
			assert.noFile([
				`${folder}/gulpfile.js`,
				`${folder}/src/proto`,
				`${folder}/src/shared`,
				`${folder}/src/proto.ts`,
				`${folder}/src/ui.ts`,
			]);
		});

		it('does not include project config files', () => {
			assert.noFile([
				`${folder}/.editorconfig`,
				`${folder}/.eslintignore`,
				`${folder}/.eslintrc.js`,
				`${folder}/.gitattributes`,
				`${folder}/.gitignore`,
				`${folder}/.prettierignore`,
			]);
		});

	});
});
