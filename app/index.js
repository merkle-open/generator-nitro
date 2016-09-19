'use strict';

/* eslint-disable max-len, complexity, no-else-return */

const generators = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const request = require('request');
const path = require('path');
const fs = require('fs');
const Admzip = require('adm-zip');
const glob = require('glob');
const _ = require('lodash');

module.exports = generators.Base.extend({
	// eslint-disable-next-line object-shorthand
	constructor: function () {
		// Calling the super constructor
		// eslint-disable-next-line prefer-rest-params
		generators.Base.apply(this, arguments);

		this.pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

		this.passedInOptions = {
			name: this.options.name,
			pre: this.options.pre,
			js: this.options.js,
			viewExt: this.options.viewExt,
			clientTpl: this.options.clientTpl,
			exporter: this.options.exporter,
			release: this.options.release
		};

		this.option('name', {
			desc: 'the name of your app',
			type: String,
			defaults: this.passedInOptions.name || path.basename(process.cwd())
		});
		this.options.name = _.kebabCase(this.options.name);

		this.preOptions = ['less', 'scss'];
		this.option('pre', {
			desc: `your desired preprocessor [${this.preOptions.join('|')}]`,
			type: String,
			defaults: this.passedInOptions.pre || this.preOptions[1]
		});

		this.jsOptions = ['JavaScript', 'TypeScript'];
		this.option('js', {
			desc: `your desired js compiler [${this.jsOptions.join('|')}]`,
			type: String,
			defaults: this.passedInOptions.js || this.jsOptions[0]
		});

		this.viewExtOptions = ['html', 'hbs', 'mustache'];
		this.option('viewExt', {
			desc: `your desired view file extension [${this.viewExtOptions.join('|')}]`,
			type: String,
			defaults: this.passedInOptions.viewExt || this.viewExtOptions[0]
		});

		this.option('clientTpl', {
			desc: 'do you need client side templates',
			type: Boolean,
			defaults: this.passedInOptions.clientTpl || false
		});

		this.option('exporter', {
			desc: 'do you need static exporting functionalities',
			type: Boolean,
			defaults: this.passedInOptions.exporter || false
		});

		this.option('release', {
			desc: 'do you need release management',
			type: Boolean,
			defaults: this.passedInOptions.release || false
		});
	},

	initializing() {
		// namics frontend-defaults
		this.srcZip = 'http://github.com/namics/frontend-defaults/archive/master.zip';
		this.destZip = this.templatePath('frontend-defaults.zip');
	},

	prompting() {

		this.log(yosay(
			`Welcome to the awe-inspiring ${chalk.cyan('Nitro')} generator!`
		));

		// check whether there is already a nitro application in place and we only have to update the application
		const json = this.fs.readJSON(this.destinationPath('package.json'), { defaults: { 'new': true } });

		if (!json.new && _.indexOf(json.keywords, 'nitro') !== -1) {
			// update existing application
			return this.prompt([
				{
					name: 'update',
					type: 'confirm',
					message: `There is already a ${chalk.cyan('Nitro')} application in place! Should I serve you an update?`,
					default: true
				}
			]).then((answers) => {
				this.update = answers.update;

				if (!this.update) {
					return;
				}

				const config = this.config.getAll();
				if (config) {
					this.options.name = config.name || this.options.name;
					this.options.pre = config.preprocessor || this.options.pre;
					this.options.js = config.jscompiler || this.options.js;
					this.options.viewExt = config.viewExtension || this.options.viewExt;
					this.options.clientTpl = config.clientTemplates || this.options.clientTpl;
					this.options.exporter = config.exporter || this.options.exporter;
					this.options.release = config.release || this.options.release;
				}
			});
		} else {
			// create new application
			return this.prompt([
				{
					name: 'name',
					message: 'What\'s the name of your app?',
					default: this.options.name,
					when: function () {
						return !this.passedInOptions.name;
					}.bind(this)
				},
				{
					name: 'pre',
					type: 'list',
					message: 'What\'s your desired preprocessor?',
					choices: this.preOptions,
					default: this.options.pre,
					store: true,
					when: function () {
						return !this.passedInOptions.pre;
					}.bind(this)
				},
				{
					name: 'js',
					type: 'list',
					message: 'What\'s your desired javascript compiler?',
					choices: this.jsOptions,
					default: this.options.js,
					store: true,
					when: function () {
						return !this.passedInOptions.js;
					}.bind(this)
				},
				{
					name: 'viewExt',
					type: 'list',
					message: 'What\'s your desired view file extension?',
					choices: this.viewExtOptions,
					default: this.options.viewExt,
					store: true,
					when: function () {
						return !this.passedInOptions.viewExt;
					}.bind(this)
				},
				{
					name: 'clientTpl',
					type: 'confirm',
					message: 'Would you like to include client side templates?',
					default: this.options.clientTpl,
					store: true,
					when: function () {
						return typeof this.passedInOptions.clientTpl !== 'boolean';
					}.bind(this)
				},
				{
					name: 'exporter',
					type: 'confirm',
					message: 'Would you like to include static exporting functionalities?',
					default: this.options.exporter,
					store: true,
					when: function () {
						return typeof this.passedInOptions.exporter !== 'boolean';
					}.bind(this)
				},
				{
					name: 'release',
					type: 'confirm',
					message: 'Would you like to include release management?',
					default: this.options.release,
					store: true,
					when: function () {
						return typeof this.passedInOptions.release !== 'boolean';
					}.bind(this)
				}
			]).then((answers) => {
				this.options.name = answers.name || this.options.name;
				this.options.pre = answers.pre || this.options.pre;
				this.options.js = answers.js || this.options.js;
				this.options.viewExt = answers.viewExt || this.options.viewExt;
				this.options.clientTpl = answers.clientTpl !== undefined ? answers.clientTpl : this.options.clientTpl;
				this.options.exporter = answers.exporter !== undefined ? answers.exporter : this.options.exporter;
				this.options.release = answers.release !== undefined ? answers.release : this.options.release;

				this.config.set('name', this.options.name);
				this.config.set('preprocessor', this.options.pre);
				this.config.set('jscompiler', this.options.js);
				this.config.set('viewExtension', this.options.viewExt);
				this.config.set('clientTemplates', this.options.clientTpl);
				this.config.set('exporter', this.options.exporter);
				this.config.set('release', this.options.release);

				this.config.save();
			});
		}
	},

	configuring: {
		download() {
			const done = this.async();

			this.log(`Download ${chalk.cyan(this.srcZip)}`);

			const dl = request
				.get(this.srcZip)
				.on('error', (err) => {
					this.log(chalk.red(err));
				})
				.pipe(fs.createWriteStream(this.destZip));

			dl.on('finish', () => {
				done();
			});
		},
		extract() {
			const done = this.async();
			const zip = new Admzip(this.destZip);

			this.log('Extracting frontend-defaults templates');

			try {
				// extract entries
				zip.extractEntryTo('frontend-defaults-master/codequality/eslint/.eslintrc.js', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/codequality/eslint/nitro.eslintignore', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/codequality/stylelint/.stylelintrc', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/codequality/stylelint/nitro.stylelintignore', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/editorconfig/.editorconfig', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/repo/gitignore/nitro.gitignore', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/repo/gitattributes/.gitattributes', this.sourceRoot(), false, true);

				// rename files
				fs.renameSync(this.templatePath('nitro.eslintignore'), this.templatePath('.eslintignore'));
				fs.renameSync(this.templatePath('nitro.gitignore'), this.templatePath('.gitignore'));
				fs.renameSync(this.templatePath('nitro.stylelintignore'), this.templatePath('.stylelintignore'));
			} catch (e) {
				this.log(chalk.red(e.message));
			}

			// remove zip
			fs.unlinkSync(this.destZip);

			done();
		}
	},

	writing: {
		app() {
			this.log('Scaffolding your app');

			const files = glob.sync('**/*', { cwd: this.sourceRoot(), nodir: true, dot: true });

			const tplFiles = [
				// files to process with copyTpl
				'config.json',
				'gulpfile.js',
				'package.json',
				'app/core/config.js',
				'patterns/molecules/example/example.html',
				'gulp/compile-css.js',
				'gulp/compile-js.js',
				'gulp/utils.js',
				'gulp/watch-assets.js',
				'project/docs/nitro.md',
				'spec/templating/patternSpec.js',
				'views/index.html'
			];
			const ignores = [
				// files to ignore
				'.DS_Store',
				'.npmignore',
				'frontend-defaults.zip'
			];
			const typeScriptFiles = [
				// files only for this.options.js==='TypeScript'
				'tsd.json',
				'gulp/compile-ts.js'
			];
			const clientTplFiles = [
				// files only for this.options.clientTpl===true
				'patterns/molecules/example/_data/example-template.json',
				'patterns/molecules/example/js/decorator/example-template.js',
				'patterns/molecules/example/template/example.hbs',
				'patterns/molecules/example/template/example.links.hbs',
				'patterns/molecules/example/template/partial/example.link.hbs',
				'project/docs/client-templates.md',
				'project/blueprints/pattern/template/pattern.hbs',
				'gulp/compile-templates.js'
			];
			const viewFiles = [
				// files that might change file extension
				'views/404.html',
				'views/index.html',
				'views/_layouts/default.html',
				'views/_partials/foot.html',
				'views/_partials/head.html',
				'patterns/molecules/example/example.html',
				'project/blueprints/pattern/pattern.html'
			];
			const exporterFiles = [
				// files for this.options.exporter===true
			];
			const releaseFiles = [
				// files for this.options.release===true
			];

			const templateData = {
				name: this.options.name,
				version: this.pkg.version,
				options: this.options
			};

			files.forEach(function (file) {
				// exclude ignores
				if (_.indexOf(ignores, file) !== -1) {
					return;
				}

				// TypeScript only Files
				if (this.options.js !== 'TypeScript') {
					if (_.indexOf(typeScriptFiles, file) !== -1) {
						return;
					}
				}

				// Client side templates only Files
				if (!this.options.clientTpl) {
					if (_.indexOf(clientTplFiles, file) !== -1) {
						return;
					}
				}

				// Exporter only Files
				if (!this.options.exporter) {
					if (_.indexOf(exporterFiles, file) !== -1) {
						return;
					}
				}

				// Release only Files
				if (!this.options.release) {
					if (_.indexOf(releaseFiles, file) !== -1) {
						return;
					}
				}

				// ignore everything under assets, patterns and views on updating project
				if (this.update) {
					if (_.startsWith(file, 'assets') ||
						_.startsWith(file, 'patterns') ||
						_.startsWith(file, 'views')) {
						return;
					}
				}

				const ext = path.extname(file).substring(1);

				// exclude unnecessary preprocessor files
				if (_.indexOf(this.preOptions, ext) !== -1 && this.options.pre !== ext) {
					return;
				}

				if ((_.startsWith(file, 'project') || _.startsWith(file, 'patterns')) && (ext === 'js' || ext === 'ts') && (this.options.js === 'JavaScript' && ext !== 'js' || this.options.js === 'TypeScript' && ext !== 'ts')) {
					return;
				}

				const sourcePath = this.templatePath(file);
				let destinationPath = this.destinationPath(file);

				// adjust destination template file extension for view files
				if (_.indexOf(this.viewExtOptions, ext) !== -1 && _.indexOf(viewFiles, file) !== -1) {
					const targetExt = `.${this.options.viewExt !== 0 ? this.options.viewExt : this.viewExtOptions[0]}`;

					destinationPath = destinationPath.replace(path.extname(destinationPath), targetExt);
				}

				if (_.indexOf(tplFiles, file) !== -1) {
					this.fs.copyTpl(sourcePath, destinationPath, templateData);
					return;
				}

				this.fs.copy(sourcePath, destinationPath);
			}, this);

		}
	},

	install() {
		this.installDependencies({
			bower: false,
			skipInstall: this.options['skip-install']
		});

		if (this.options.js === 'TypeScript') {
			this.spawnCommand('tsd', ['reinstall']).on('close', () => {
				this.spawnCommand('tsd', ['rebundle']);
			});
		}
	},

	end() {
		const filesToCopy = [
			{ do: this.options.exporter, src: 'node_modules/nitro-exporter/README.md', dest: 'project/docs/nitro-exporter.md' },
			{ do: this.options.release, src: 'node_modules/nitro-release/README.md', dest: 'project/docs/nitro-release.md' }
		];
		try {
			filesToCopy.forEach((file) => {
				if (file.do) {
					this.fs.copy(this.destinationPath(file.src), this.destinationPath(file.dest));
				}
			});
		} catch (e) {
			this.log(chalk.red(e.message));
		}

		this.log(chalk.green('All done – have fun'));
	}
});
