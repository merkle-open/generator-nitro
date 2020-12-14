'use strict';

/* eslint-disable max-len, complexity, no-else-return, require-jsdoc */

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');

module.exports = class extends Generator {
	constructor(args, opts) {
		// Calling the super constructor
		super(args, opts);

		this._passedInOptions = {
			name: this.options.folder,
		};

		this.option('folder', {
			desc: 'the folder for your distribution',
			type: String,
			defaults: this._passedInOptions.folder || 'dist',
		});
	}

	initializing() {
		this._pkgGenerator = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
		this._pkgProject = JSON.parse(fs.readFileSync(this.destinationPath('package.json'), 'utf8'));
		this._tplRoot = this.sourceRoot();

		// use project blueprint if available
		if (fs.existsSync(this.destinationPath('project/blueprints/server/package.json'))) {
			this._tplRoot = this.destinationPath('project/blueprints/server');
		}
	}

	prompting() {}

	writing() {
		this.log('Scaffolding your light server');

		// eslint-disable-next-line global-require
		const config = require('config');
		const files = glob.sync('**/*', { cwd: this._tplRoot, nodir: true, dot: true });

		const tplFiles = [
			// files to process with copyTpl
			'package.json',
		];

		const projectPaths = config.has('server.projectPaths') ? config.get('server.projectPaths') : [];

		const tplData = {
			projectName: this._pkgProject.name || 'nitro-project',
			projectVersion: this._pkgProject.version || '1.0.0',
			nodeVersion:
				this._pkgProject.engines && this._pkgProject.engines.node
					? this._pkgProject.engines.node
					: this._pkgGenerator.engines.node,
			npmVersion:
				this._pkgProject.engines && this._pkgProject.engines.npm
					? this._pkgProject.engines.npm
					: this._pkgGenerator.engines.npm,
			nitroAppVersion: this._pkgProject.devDependencies['@nitro/app'] || this._pkgGenerator.version,
		};

		files.forEach((file) => {
			const sourcePath = path.join(this._tplRoot, file);
			const destinationPath = this.destinationPath(`${this.options.folder}/${file}`);

			if (_.indexOf(tplFiles, file) !== -1) {
				this.fs.copyTpl(sourcePath, destinationPath, tplData);
				return;
			}

			this.fs.copy(sourcePath, destinationPath);
		}, this);

		projectPaths.forEach((file) => {
			const sourcePath = this.destinationPath(file);
			const destinationPath = this.destinationPath(`${this.options.folder}/${file}`);

			this.fs.copy(sourcePath, destinationPath);
		}, this);
	}

	end() {
		this.log(yosay(`All done - your light server is ready`));
	}
};
