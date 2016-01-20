'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');
var admzip = require('adm-zip');
var glob = require('glob');
var _ = require('lodash');

module.exports = generators.Base.extend({

	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		this.option('name', {desc: 'the name of your app', type: String});
		this.options.name = this.options.name || path.basename(process.cwd());
		this.options.name = _.kebabCase(this.options.name);

		this.preOptions = ['less', 'scss'];
		this.option('pre', {
			desc: 'your desired preprocessor [' + this.preOptions.join('|') + ']',
			type: String,
			defaults: this.preOptions[0]
		});

		this.jsOptions = ['JavaScript', 'TypeScript'];
		this.option('js', {
			desc: 'your desired js compiler [' + this.jsOptions.join('|') + ']',
			type: String,
			defaults: this.jsOptions[0]
		});

		this.viewExtOptions = ['html', 'hbs', 'mustache'];
		this.option('viewExt', {
			desc: 'your desired view file extension [' + this.viewExtOptions.join('|') + ']',
			type: String,
			defaults: this.viewExtOptions[0]
		});
	},

	initializing: function () {
		// namics frontend-defaults
		this.srcZip = 'http://github.com/namics/frontend-defaults/archive/master.zip';
		this.destZip = this.templatePath('frontend-defaults.zip');
	},

	prompting: function () {
		var done = this.async();

		this.log(yosay(
			'Welcome to the awe-inspiring ' + chalk.cyan('Nitro') + ' generator!'
		));

		// check whether there is already a nitro application in place and we only have to update the application
		var json = this.fs.readJSON(this.destinationPath('package.json'), {defaults: {"new": true}});

		if (!json.new && _.indexOf(json.keywords, 'nitro') !== -1) {
			// update existing application
			this.prompt([
				{
					name: 'update',
					type: 'confirm',
					message: 'There is already a ' + chalk.cyan('Nitro') + ' application in place! Should I serve you an update?',
					default: true
				}
			], function (props) {
				this.update = props.update;

				if (!this.update) {
					return;
				}

				var config = this.config.getAll();
				if (config) {
					this.options.name = config.name || this.options.name;
					this.options.pre = config.preprocessor || this.options.pre;
					this.options.js = config.jscompiler || this.options.js;
					this.options.viewExt = config.viewExtension || this.options.viewExt;
				}

				done();
			}.bind(this));
		}
		else {
			// create new application
			this.prompt([
				{
					name: 'name',
					message: 'What\'s the name of your app?',
					default: this.options.name
				},
				{
					name: 'pre',
					type: 'list',
					message: 'What\'s your desired preprocessor?',
					choices: this.preOptions,
					default: _.indexOf(this.preOptions, this.options.pre) || 0,
					store: true
				},
				{
					name: 'js',
					type: 'list',
					message: 'What\'s your desired javascript compiler?',
					choices: this.jsOptions,
					default: _.indexOf(this.jsOptions, this.options.js) || 0,
					store: true
				},
				{
					name: 'viewExt',
					type: 'list',
					message: 'What\'s your desired view file extension?',
					choices: this.viewExtOptions,
					default: _.indexOf(this.viewExtOptions, this.options.viewExt) || 0,
					store: true
				}
			], function (props) {
				this.options.name = props.name;
				this.options.pre = props.pre;
				this.options.js = props.js;
				this.options.viewExt = props.viewExt;

				this.config.set('name', this.options.name);
				this.config.set('preprocessor', this.options.pre);
				this.config.set('jscompiler', this.options.js);
				this.config.set('viewExtension', this.options.viewExt);

				this.config.save();

				done();
			}.bind(this));
		}
	},

	configuring: {
		download: function () {
			var self = this;
			var done = this.async();

			this.log('Download ' + chalk.cyan(this.srcZip));

			var dl = request
				.get(this.srcZip)
				.on('error', function (err) {
					self.log(chalk.red(err));
				})
				.pipe(fs.createWriteStream(this.destZip));

			dl.on('finish', function () {
				done();
			});
		},
		extract: function () {
			var done = this.async();

			this.log('Extracting frontend-defaults templates');
			var zip = new admzip(this.destZip);

			try {
				// extract entries
				zip.extractEntryTo('frontend-defaults-master/editorconfig/frontend.editorconfig', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/gitignore/nitro.gitignore', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/gitattributes/.gitattributes', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/jshintrc/.jshintrc', this.sourceRoot(), false, true);

				// rename files
				fs.renameSync(this.templatePath('frontend.editorconfig'), this.templatePath('.editorconfig'));
				fs.renameSync(this.templatePath('nitro.gitignore'), this.templatePath('.gitignore'));
			}
			catch (e) {
				this.log(chalk.red(e.message));
			}

			// remove zip
			fs.unlinkSync(this.destZip);

			done();
		}
	},

	writing: {
		app: function () {
			this.log('Scaffolding your app');

			var files = glob.sync('**/*', {cwd: this.sourceRoot(), nodir: true, dot: true});

			var tplFiles = [
				// files to process with copyTpl
				'package.json',
				'config.json',
				'gulpfile.js',
				'gulp/compile-css.js',
				'gulp/compile-js.js',
				'gulp/utils.js',
				'gulp/watch-assets.js',
				'app/core/config.js',
				'project/docs/nitro.md',
				'.jshintignore'
			];
			var ignores = [
				// files to ignore
				'.DS_Store',
				'.npmignore',
				'frontend-defaults.zip'
			];
			var typeScriptFiles = [
				// files only for this.options.js==='TypeScript'
				'tsd.json',
				'gulp/compile-ts.js'
			];
			var viewFiles = [
				// files that might change file extension
				'views/404.html',
				'views/index.html',
				'views/_partials/foot.html',
				'views/_partials/head.html',
				'components/molecules/Example/example.html',
				'project/blueprints/component/component.html'
			];

			var data = {
				name: this.options.name,
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

				// ignore everything under assets, components and views
				if (this.update) {
					if (_.startsWith(file, 'assets') ||
						_.startsWith(file, 'components') ||
						_.startsWith(file, 'views')) {
						return;
					}
				}

				var ext = path.extname(file).substring(1);

				// exclude unnecessary preprocessor files
				if (_.indexOf(this.preOptions, ext) !== -1 && this.options.pre !== ext) {
					return;
				}

				if ((_.startsWith(file, 'project') || _.startsWith(file, 'components')) && (ext === 'js' || ext === 'ts') && (this.options.js === 'JavaScript' && ext !== 'js' || this.options.js === 'TypeScript' && ext !== 'ts')) {
					return;
				}

				var sourcePath = this.templatePath(file),
					destinationPath = this.destinationPath(file);

				// adjust destination template file extension for view files
				if(_.indexOf(this.viewExtOptions, ext) !== -1 && _.indexOf(viewFiles, file) !== -1) {
					var targetExt = '.' + (this.options.viewExt !== 0 ? this.options.viewExt : this.viewExtOptions[0]);

					destinationPath = destinationPath.replace(path.extname(destinationPath), targetExt);
				}

				if (_.indexOf(tplFiles, file) !== -1) {
					this.fs.copyTpl(sourcePath, destinationPath, data);
					return;
				}

				this.fs.copy(sourcePath, destinationPath);
			}, this);

		}
	},

	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install']
		});

		if (this.options.js === 'TypeScript') {
			var that = this;
			this.spawnCommand('tsd', ['reinstall']).on('close', function () {
				that.spawnCommand('tsd', ['rebundle']);
			});
		}
	},

	end: function () {
		this.log(chalk.green('All done – have fun'));
	}
});
