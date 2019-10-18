'use strict';

/* eslint-disable max-len, complexity, no-else-return, require-jsdoc */

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const request = require('request');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');

module.exports = class extends Generator {

	constructor(args, opts) {
		// Calling the super constructor
		super(args, opts);

		this._pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));

		this._passedInOptions = {
			name: this.options.name,
			viewExt: this.options.viewExt,
			templateEngine: this.options.templateEngine,
			jsCompiler: this.options.jsCompiler,
			clientTpl: this.options.clientTpl,
			exampleCode: this.options.exampleCode,
			exporter: this.options.exporter,
		};

		this.option('name', {
			desc: 'the name of your app',
			type: String,
			defaults: this._passedInOptions.name || path.basename(process.cwd()),
		});
		this.options.name = _.kebabCase(this.options.name);

		this._templateEngineOptions = ['hbs', 'twig'];
		this.option('templateEngine', {
			desc: `your desired template engine [${this._templateEngineOptions.join('|')}]`,
			type: String,
			defaults: this._passedInOptions.templateEngine || this._templateEngineOptions[0],
		});

		this._jsCompilerOptions = ['ts', 'js'];
		this.option('jsCompiler', {
			desc: `your desired javascript js compiler [${this._jsCompilerOptions.join('|')}]`,
			type: String,
			defaults: this._passedInOptions.jsCompiler || this._jsCompilerOptions[1],
		});

		this._viewExtOptions = ['hbs', 'twig'];
		this.option('viewExt', {
			desc: `your desired view file extension [${this._viewExtOptions.join('|')}]`,
			type: String,
			defaults: this._passedInOptions.viewExt || this._viewExtOptions[0],
		});

		this.option('clientTpl', {
			desc: 'do you need client side templates',
			type: Boolean,
			defaults: this._passedInOptions.clientTpl || false,
		});

		this.option('exampleCode', {
			desc: 'do you want to include the example code',
			type: Boolean,
			defaults: this._passedInOptions.exampleCode || false,
		});

		this.option('exporter', {
			desc: 'do you need static exporting functionalities',
			type: Boolean,
			defaults: this._passedInOptions.exporter || false,
		});

		this.option('skipQuestions', {
			desc: 'use default for not specified options and skip questions',
			type: Boolean,
			defaults: false,
		});

		this._skipQuestions = this.options.skipQuestions;
	}

	initializing() {}

	prompting() {

		this.log(yosay(
			`Welcome to the awe-inspiring ${chalk.cyan('Nitro')} generator!`
		));

		// check whether there is already a nitro application in place and we only have to update the application
		const json = this.fs.readJSON(this.destinationPath('.yo-rc.json'), { 'new': true });

		if (!json.new) {
			// update existing application
			return this.prompt([
				{
					name: 'update',
					type: 'confirm',
					message: `There is already a ${chalk.cyan('Nitro')} application in place! Should I serve you an update?`,
					default: true,
				},
			]).then((answers) => {
				this._update = answers.update;
				this.options.skipInstall = true;

				if (!this._update) {
					return;
				}

				const config = this.config.getAll();
				if (config) {
					this.options.name = config.name || this.options.name;
					this.options.viewExt = config.viewExtension || config.templateEngine ? config.templateEngine : this.options.viewExt;
					this.options.templateEngine = config.templateEngine || this.options.templateEngine;
					this.options.jsCompiler = config.jsCompiler || this.options.jsCompiler;
					this.options.clientTpl = typeof config.clientTemplates === 'boolean' ? config.clientTemplates : this.options.clientTpl;
					this.options.exampleCode = typeof config.exampleCode === 'boolean' ? config.exampleCode : this.options.exampleCode;
					this.options.exporter = typeof config.exporter === 'boolean' ? config.exporter : this.options.exporter;

					this.options.name = _.kebabCase(this.options.name);
				}
			});
		} else {
			// create new application
			return this.prompt([
				{
					name: 'name',
					message: 'What\'s the name of your app?',
					default: this.options.name,
					when: () => !this._skipQuestions && !this._passedInOptions.name,
				},
				{
					name: 'templateEngine',
					type: 'list',
					message: 'What\'s your desired template engine?',
					choices: this._templateEngineOptions,
					default: this.options.templateEngine,
					store: true,
					when: () => !this._skipQuestions && !this._passedInOptions.templateEngine,
				},
				{
					name: 'jsCompiler',
					type: 'list',
					message: 'What\'s your desired javascript js compiler?',
					choices: this._jsCompilerOptions,
					default: this.options.jsCompiler,
					store: true,
					when: () => !this._skipQuestions && !this._passedInOptions.jsCompiler,
				},
				{
					name: 'clientTpl',
					type: 'confirm',
					message: 'Would you like to include client side templates?',
					default: this.options.clientTpl,
					store: true,
					when: () => !this._skipQuestions && typeof this._passedInOptions.clientTpl !== 'boolean',
				},
				{
					name: 'exampleCode',
					type: 'confirm',
					message: 'Would you like to include the example code?',
					default: this.options.exampleCode,
					store: true,
					when: () => !this._skipQuestions && typeof this._passedInOptions.exampleCode !== 'boolean',
				},
				{
					name: 'exporter',
					type: 'confirm',
					message: 'Would you like to include static exporting functionalities?',
					default: this.options.exporter,
					store: true,
					when: () => !this._skipQuestions && typeof this._passedInOptions.exporter !== 'boolean',
				},
			]).then((answers) => {
				this.options.name = answers.name || this.options.name;
				this.options.templateEngine = answers.templateEngine || this.options.templateEngine;
				this.options.jsCompiler = answers.jsCompiler || this.options.jsCompiler;
				this.options.viewExt = this.options.templateEngine;
				this.options.clientTpl = answers.clientTpl !== undefined ? answers.clientTpl : this.options.clientTpl;
				this.options.exampleCode = answers.exampleCode !== undefined ? answers.exampleCode : this.options.exampleCode;
				this.options.exporter = answers.exporter !== undefined ? answers.exporter : this.options.exporter;

				this.options.name = _.kebabCase(this.options.name);

				this.config.set('name', this.options.name);
				this.config.set('templateEngine', this.options.templateEngine);
				this.config.set('jsCompiler', this.options.jsCompiler);
				this.config.set('clientTemplates', this.options.clientTpl);
				this.config.set('exampleCode', this.options.exampleCode);
				this.config.set('exporter', this.options.exporter);

				this.config.save();
			});
		}
	}

	writing() {

		this.log('Scaffolding your app');

		const files = glob.sync('**/*', { cwd: this.sourceRoot(), nodir: true, dot: true });

		const tplFiles = [
			// files to process with copyTpl
			'config/default.js',
			'config/default/exporter.js',
			'config/webpack/options.js',
			'project/docs/nitro.md',
			'project/docs/client-templates.md',
			'project/helpers/readme.md',
			'src/patterns/molecules/example/example.hbs',
			'src/patterns/molecules/example/example.twig',
			'src/patterns/molecules/example/readme.md',
			'src/patterns/molecules/example/schema.json',
			'src/patterns/molecules/example/index.js',
			'src/patterns/molecules/example/index.ts',
			'src/patterns/molecules/example/js/example.js',
			'src/patterns/molecules/example/js/example.ts',
			'src/proto/js/prototype.js',
			'src/proto/js/prototype.ts',
			'src/views/index.hbs',
			'src/views/index.twig',
			'src/views/_partials/head.hbs',
			'src/views/_partials/head.twig',
			'src/ui.js',
			'src/ui.ts',
			'src/proto.js',
			'src/proto.ts',
			'tests/backstop/backstop.config.js',
			'.eslintrc.js',
			'docker-compose.yml',
			'docker-compose-dev.yml',
			'gulpfile.js',
			'package.json',
		];
		const ignores = [
			// files to ignore
			'.DS_Store',
			'.npmignore',
		];
		const ignoresOnUpdate = [
			// files and directories to ignore on updating projects
			'config/local.js',
			'project/blueprints/',
			'project/routes/',
			'public/',
			'src/patterns/',
			'src/proto/css/',
			'src/shared/',
			'src/views/',
		];
		const clientTplFiles = [
			// files only for this.options.clientTpl===true
			'src/patterns/molecules/example/_data/example-template.json',
			'src/patterns/molecules/example/template/example.hbs',
			'src/patterns/molecules/example/template/example.links.hbs',
			'src/patterns/molecules/example/template/partial/example.link.hbs',
			'project/docs/client-templates.md',
			'project/blueprints/pattern/template/$pattern$.hbs',
		];
		const jsCompilerTsFiles = [
			// files only for this.options.jsCompiler==='ts'
			'tsconfig.json',
		];
		const jsCompilerJsFiles = [
			// files only for this.options.jsCompiler==='js'
			'babel.config.js',
		];
		const viewFiles = [
			// all view files exists in different templateEngine variants
			'src/views/404',
			'src/views/index',
			'src/views/example/patterns',
			'src/views/_layouts/default',
			'src/views/_partials/foot',
			'src/views/_partials/head',
			'src/patterns/atoms/box/box',
			'src/patterns/atoms/button/button',
			'src/patterns/atoms/checkbox/checkbox',
			'src/patterns/atoms/cta/cta',
			'src/patterns/atoms/datepicker/datepicker',
			'src/patterns/atoms/gondel/gondel',
			'src/patterns/atoms/heading/heading',
			'src/patterns/atoms/icon/icon',
			'src/patterns/atoms/image/image',
			'src/patterns/atoms/list/list',
			'src/patterns/atoms/loader/loader',
			'src/patterns/atoms/lottie/lottie',
			'src/patterns/atoms/stage/stage',
			'src/patterns/molecules/example/example',
			'project/blueprints/pattern/$pattern$',
		];
		const examplePaths = [
			// paths only for this.options.exampleCode===true
			'project/routes/',
			'public/content/',
			'src/views/example/',
			'src/patterns/',
			'src/proto/utils/',
			'src/shared/',
			'tests/cypress/cypress/integration/examples/'
		];
		const exampleIncludeAnyway = [
			// example file "parts" included for this.options.exampleCode===false
			'project/routes/readme.md',
			'src/patterns/readme.md',
			'src/shared/readme.md',
			'.gitkeep',
		];
		const exporterFiles = [
			// files for this.options.exporter===true
			'config/default/exporter.js',
		];

		const templateData = {
			name: this.options.name,
			version: this._pkg.version,
			options: this.options,
		};

		files.forEach((file) => {

			// exclude ignores
			if (_.indexOf(ignores, file) !== -1) {
				return;
			}

			// exclude update ignores
			if (this._update) {
				if (ignoresOnUpdate.some((v) => file.indexOf(v) >= 0)	) {
					return;
				}
			}

			// Client side templates only Files
			if (!this.options.clientTpl) {
				if (_.indexOf(clientTplFiles, file) !== -1) {
					return;
				}
			}

			// Example only Files
			if (!this.options.exampleCode) {
				if (
					examplePaths.some((v) => file.indexOf(v) >= 0) &&
					exampleIncludeAnyway.every((v) => { return file.indexOf(v) === -1; })
				) {
					return;
				}
			}

			// Exporter only Files
			if (!this.options.exporter) {
				if (_.indexOf(exporterFiles, file) !== -1) {
					return;
				}
			}

			const ext = path.extname(file).substring(1);
			const fileWithoutExt = file.substring(0, (file.length - ext.length - 1));
			const sourcePath = this.templatePath(file);
			let destinationPath = this.destinationPath(file);

			// check if it's a view file
			if (_.indexOf(viewFiles, fileWithoutExt) !== -1) {
				if (ext !== this.options.templateEngine) {
					// return view files with ext not matching the current templateEngine
					return;
				}
				if (this.options.viewExt !== this.options.templateEngine) {
					// sanity check for update case of old generated app's having viewExt other than hbs
					const targetExt = `.${this.options.viewExt !== 0 ? this.options.viewExt : this._viewExtOptions[0]}`;
					destinationPath = destinationPath.replace(path.extname(destinationPath), targetExt);
				}
			}

			// check if it's a src file or a blueprints file
			if (fileWithoutExt.indexOf('src/') !== -1 || fileWithoutExt.indexOf('project/blueprints/') !== -1) {
				// check if it's a ts / js file
				if (ext === 'ts' || ext === 'js') {
					// return for ts / js files with ext not matching the current jsCompiler
					if (ext !== this.options.jsCompiler) {
						return;
					}
				}
			}

			if (_.indexOf(jsCompilerJsFiles, file) !== -1 && this.options.jsCompiler === 'ts') {
				// return files only used with jsCompiler option js
				return;
			}

			if (_.indexOf(jsCompilerTsFiles, file) !== -1 && this.options.jsCompiler === 'js') {
				// return files only used with jsCompiler option ts
				return;
			}

			if (_.indexOf(tplFiles, file) !== -1) {
				this.fs.copyTpl(sourcePath, destinationPath, templateData);
				return;
			}

			// rename CUTAWAY.gitignore to .gitignore
			if (destinationPath.indexOf('CUTAWAY') !== -1) {
				destinationPath = destinationPath.replace(/CUTAWAY/g, '');
			}

			this.fs.copy(sourcePath, destinationPath);
		}, this);
	}

	install() {
		this.installDependencies({
			npm: true,
			bower: false,
			yarn: false,
			skipInstall: this.options.skipInstall,
		});
	}

	end() {
		const filesToCopy = [
			{
				do: this.options.exporter,
				src: 'node_modules/@nitro/exporter/readme.md',
				srcWeb: 'https://raw.githubusercontent.com/namics/generator-nitro/master/packages/nitro-exporter/readme.md',
				dest: 'project/docs/nitro-exporter.md',
			},
			{
				do: true,
				src: 'node_modules/@nitro/webpack/readme.md',
				srcWeb: 'https://raw.githubusercontent.com/namics/generator-nitro/master/packages/nitro-webpack/readme.md',
				dest: 'project/docs/nitro-webpack.md',
			},
		];
		try {
			filesToCopy.forEach((file) => {
				if (file.do) {
					if (!this.options.skipInstall) {
						// get readme from current package version
						this.fs.copy(this.destinationPath(file.src), this.destinationPath(file.dest));
					} else {
						// get readme from github master branch
						request
							.get(file.srcWeb)
							.pipe(fs.createWriteStream(this.destinationPath(file.dest)));
					}
				}
			});
		} catch (e) {
			this.log(chalk.red(e.message));
		}

		if (this._update) {
			this.log(yosay(
				`All done – Check local changes and then\nrun \`npm install\` to update your project.`
			));
		} else {
			this.log(yosay(
				`All done –\nrun \`npm start\` to start ${chalk.cyan('Nitro')} in development mode.`
			));
		}
	}
};
