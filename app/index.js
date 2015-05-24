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

		this.jsOptions = ['JavaScript', 'TypeScript'];
		this.option('js', {desc: 'your desired js compiler [' + this.jsOptions.join('|') + ']', type: String, defaults: this.preOptions[0]});
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
		var json = this.fs.readJSON(this.destinationPath('package.json'), { defaults : { "new" : true } });

		if(!json.new && _.indexOf(json.keywords, 'nitro') !== -1) {
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

				if(!this.update) {
					return;
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
					default: _.indexOf(this.preOptions, this.options.pre) || 0
				},
				{
					name: 'js',
					type: 'list',
					message: 'What\'s your desired javascript compiler?',
					choices: this.jsOptions,
					default: _.indexOf(this.jsOptions, this.options.js) || 0
				}
			], function (props) {
				this.options.name = props.name;
				this.options.pre = props.pre;
				this.options.js = props.js;

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

			var files = this.expandFiles('**/*', {cwd: this.sourceRoot(), dot: true});
			var tplFiles = [
				// files to process with copyTpl
				'package.json',
				'config.json',
				'gulpfile.js'
			];
			var ignores = [
				// files to ignore
				'.DS_Store',
				'frontend-defaults.zip'
			];
			var typeScriptFiles = [
				// files only for this.options.js==='TypeScript'
				'tsd.json'
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

				if((_.startsWith(file, 'project') || _.startsWith(file, 'components')) && (ext === 'js' || ext === 'ts') && (this.options.js === 'JavaScript' && ext !== 'js' || this.options.js === 'TypeScript' && ext !== 'ts')){
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

		if(this.options.js === 'TypeScript'){
			var that = this;
			this.spawnCommand('tsd', ['reinstall']).on('close', function(){
				that.spawnCommand('tsd', ['rebundle']);
			});
		}
	},

	end: function () {
		this.log(chalk.green('All done – have fun'));
	}
});
