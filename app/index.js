'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');
var admzip = require('adm-zip');
var _ = require('lodash');

module.exports = generators.Base.extend({

	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		this.option('name', {desc: 'the name of your app', type: String });
		this.options.name = this.options.name || path.basename(process.cwd());
		this.options.name = _.kebabCase(this.options.name);

		this.preOptions = ['less', 'scss'];
		this.option('pre', {desc: 'your desired preprocessor [' + this.preOptions.join('|') + ']', type: String, defaults: this.preOptions[0]});
		this.update = false;
	},

	initializing: function () {
		this.pkg = require('../package.json');

		// namics frontend-defaults
		this.srcZip = 'http://github.com/namics/frontend-defaults/archive/master.zip';
		this.destZip = this.templatePath('frontend-defaults.zip');
	},

	prompting: function () {
		var done = this.async();

		this.log(yosay(
			'Welcome to the awe-inspiring ' + chalk.cyan('Splendid') + ' generator!'
		));

		// check whether there is already a splendid application in place and we only have to update the application
		var json = this.fs.readJSON(this.destinationPath('package.json'), { defaults : { "new" : true } });

		if(!json.new && _.indexOf(json.keywords, 'splendid') !== -1) {
			// update existing application
			this.log(yosay(
				'There is already a ' + chalk.cyan('Splendid') + ' application in place! I\'m going to serve you an update…'
			));

			this.update = true;
			done();
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
					default: _.indexOf(this.preOptions, this.options.pre) || 0
				}
			], function (props) {
				this.options.name = props.name;
				this.options.pre = props.pre;

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
				// extract entrys
				zip.extractEntryTo('frontend-defaults-master/editorconfig/frontend.editorconfig', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/gitignore/splendid.gitignore', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/gitattributes/.gitattributes', this.sourceRoot(), false, true);
				zip.extractEntryTo('frontend-defaults-master/jshintrc/.jshintrc', this.sourceRoot(), false, true);

				// rename files
				fs.renameSync(this.templatePath('frontend.editorconfig'), this.templatePath('.editorconfig'));
				fs.renameSync(this.templatePath('splendid.gitignore'), this.templatePath('.gitignore'));
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

			var files = this.expandFiles('**/*', {cwd: this.sourceRoot(), dot: true});
			var tplFiles = [
				// files to process with copyTpl
				'package.json'
			];
			var ignores = [
				// files to ignore
				'.DS_Store',
				'frontend-defaults.zip'
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

				// ignore everything under assets, components, project and views
				if(this.update) {
					if(_.startsWith(file, 'assets')
						|| _.startsWith(file, 'components')
						|| _.startsWith(file, 'project')
						|| _.startsWith(file, 'views')) {
						return;
					}
				}

				// exclude unecessary preprocessor files
				var ext = path.extname(file).substring(1);
				if(_.indexOf(this.preOptions, ext) !== -1 && this.options.pre !== ext) {
					return;
				}

				if (_.indexOf(tplFiles, file) !== -1) {
					this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), data);
					return;
				}

				this.fs.copy(this.templatePath(file), this.destinationPath(file));
			}, this);
		}
	},

	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install']
		});
	},

	end: function () {
		this.log(chalk.green('All done – have fun'));
	}
});
