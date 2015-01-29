'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var admzip = require('adm-zip');
var lodash = require('lodash');

module.exports = generators.Base.extend({

	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		this.argument('name', {type: String, required: false});
		this.name = this.name || path.basename(process.cwd());
		this.name = lodash.kebabCase(this.name);
	},

	initializing: function () {
		this.pkg = require('../package.json');
		this.cfg = require('../config.json');

		this.srcZip = 'http://github.com/' + this.cfg.repository + '/archive/' + this.options.version + '.zip';
		this.destZip = this.templatePath('sentinel.zip');
		this.destTemplates = this.templatePath('sentinel');
	},

	prompting: function () {
		var done = this.async();

		this.log(yosay(
			'Welcome to the awe-inspiring ' + chalk.cyan('Sentinel') + ' generator!'
		));

		this.prompt([
			{
				name: 'appname',
				message: 'What\'s the name of your application?',
				default: this.name
			}
		], function (props) {
			this.name = props.name;

			done();
		}.bind(this));
	},

	writing: {
		/* clean: function () {
			var done = this.async();

			this.log('Cleaning templates');

			rimraf(this.destTemplates, function () {
				done();
			});
		},
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

			this.log('Extracting templates');
			var zip = new admzip(this.destZip);
			var zipEntries = zip.getEntries();

			zipEntries.forEach(function (entry) {
				try {
					zip.extractEntryTo(entry, this.destTemplates + entry.entryName.substring(entry.entryName.indexOf('/')), false, false);
				}
				catch (e) {
				}
			}, this);

			done();
		}, */
		app: function () {
			this.log('Scaffolding your app');

			var files = this.expandFiles('**/*', {cwd: this.sourceRoot(), dot: true});
			var ignores = [
				// files to ignore
				'.DS_Store'
			];

			files.forEach(function (file) {
				if (ignores.indexOf(file) !== -1) {
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

	end: function() {
		this.log(chalk.green('All done – have fun'));
	}
});
