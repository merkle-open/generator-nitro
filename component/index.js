'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');
var gitconfig = require('git-config');
var _ = require('lodash');

module.exports = generators.Base.extend({
	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		this.argument('name', {type: String, required: false, defaults: ''});
		this.name = this.name;
	},

	initializing: function () {
		this.pkg = require('../package.json');
		this.cfg = require(this.destinationPath('config.json'));

		// Get the component types
		this.types = _.map(this.cfg.sentinel.components, function (value, key) {
			return key;
		});
	},

	prompting: function () {
		var self = this;
		var done = this.async();

		this.log(yosay(
			'Let me help you to create your component…'
		));

		this.prompt([
			{
				name: 'name',
				message: 'What\'s the name of your component?',
				default: this.name,
				validate: function validateString(value) {
					return _.isString(value) && !_.isBlank(value);
				}
			},
			{
				name: 'type',
				type: 'list',
				message: 'And what\'s your desired type?',
				choices: this.types,
				default: 0
			}
		], function (props) {
			this.name = props.name;
			this.type= props.type;

			done();
		}.bind(this));
	},

	writing : {
		app: function () {
			this.log('Creating ' + chalk.cyan(this.name) + ' ' + this.type);

			var component = this.cfg.sentinel.components[this.type];

			var files = this.expandFiles('**/*', {cwd: this.destinationPath(component.template), dot: true});
			var ignores = [
				// files to ignore
				'.DS_Store'
			];

			var user = {
				name: '',
				email: ''
			};

			var gitConfig = gitconfig.sync();

			if(!_.isEmpty(gitConfig)) {
				user.name = gitConfig.user.name;
				user.email = gitConfig.user.email;
			}

			var replacements = {
				user: user,
				component : {
					name: _.humanize(this.name),					// Component name, eg. Main navigation
					js: _.capitalize(_.camelize(this.name)), 	// Component name for use in JS files, eg. MainNavigation
					css: _.kebabCase(this.name),					// Component name for use in CSS files, eg. main-navigation
					prefix: component.component_prefix || null 			// CSS class prefix, eg. mod
				},
				skin : {
					name: _.humanize(this.name),					// Skin name, eg. Highlight
					js: _.capitalize(_.camelize(this.name)), 	// Skin name for use in JS files, eg. Highlight
					css: _.kebabCase(this.name),					// Skin name for use in CSS files, eg. highlight
					prefix: component.component_prefix || null 			// CSS class prefix, eg. skin
				}
			};

			files.forEach(function (file) {
				if (ignores.indexOf(file) !== -1) {
					return;
				}

				// exclude skin files if skin prefix is not set
				if(!replacements.skin.prefix && file.indexOf('skin') > 0) {
					return;
				}

				// filename replacements
				var fileReplacements = {
					component :  _.kebabCase(this.name).replace('-', ''),
					skin:  _.kebabCase(this.name).replace('-', '')
				};

				var filename = file;
				_.forOwn(fileReplacements, function(value, key) {
					filename = filename.replace(key, value);
				});

				this.fs.copyTpl(this.destinationPath(component.template + '/' + file), this.destinationPath(component.path + '/' + this.name + '/' + filename), replacements);
			}, this);

			this.log(chalk.green(this.name + ' ' + this.type + ' successfully created'));
		}
	}
});