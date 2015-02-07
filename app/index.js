'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

module.exports = generators.Base.extend({

	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		this.argument('name', {desc: 'the name of your app', type: String, required: false});
		this.name = this.name || path.basename(process.cwd());
		this.name = _.kebabCase(this.name);

		this.preOptions = ['less', 'scss'];
		this.option('pre', {desc: 'your desired preprocessor [' + this.preOptions.join('|') + ']', type: String, defaults: this.preOptions[0]});
	},

	initializing: function () {
		this.pkg = require('../package.json');
		this.cfg = require('../config.json');
	},

	prompting: function () {
		var done = this.async();

		this.log(yosay(
			'Welcome to the awe-inspiring ' + chalk.cyan('Sentinel') + ' generator!'
		));

		this.prompt([
			{
				name: 'name',
				message: 'What\'s the name of your app?',
				default: this.name
			},
			{
				name: 'pre',
				type: 'list',
				message: 'What\'s your desired preprocessor?',
				choices: this.preOptions,
				default: _.indexOf(this.preOptions, this.options.pre) || 0
			}
		], function (props) {
			this.name = props.name;
			this.options.pre = props.pre;

			done();
		}.bind(this));
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
				'.DS_Store'
			];

			var data = {
				name: this.name,
				options: this.options
			};

			files.forEach(function (file) {
				// exclude ignores
				if (_.indexOf(ignores, file) !== -1) {
					return;
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
