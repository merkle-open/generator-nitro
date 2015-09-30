'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');
var gitconfig = require('git-config');
var glob = require('glob');
var _ = require('lodash');

module.exports = generators.Base.extend({
	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		// Component name
		this.argument('name', {desc: 'the name of your component?', type: String, required: false, defaults: ''});

		// Component type
		this.cfg = require(this.destinationPath('config.json'));

		this.types = _.map(this.cfg.nitro.components, function (value, key) {
			return key;
		});

		this.option('type', {
			desc: 'your desired type [' + this.types.join('|') + ']',
			type: String,
			defaults: this.types[0]
		});

		// Component modifier
		this.option('modifier', {desc: 'the name of your modifier', type: String});

		// Component decorator
		this.option('decorator', {desc: 'the name of your decorator', type: String});
	},

	initializing: function () {
		this.pkg = require('../package.json');
	},

	prompting: function () {
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
					return _.isString(value) && !_.isEmpty(value);
				}
			},
			{
				name: 'type',
				type: 'list',
				message: 'And what\'s your desired type?',
				choices: this.types,
				default: _.indexOf(this.types, this.options.type) || 0
			},
			{
				name: 'modifier',
				message: 'Would you like to create a CSS modifier? Type your desired name or leave empty.',
				default: this.options.modifier || ''
			},
			{
				name: 'decorator',
				message: 'Would you like to create a JS decorator? Type your desired name or leave empty.',
				default: this.options.decorator || ''
			}
		], function (props) {
			this.name = props.name;
			this.options.type = props.type;
			this.options.modifier = props.modifier;
			this.options.decorator = props.decorator;

			done();
		}.bind(this));
	},

	writing: {
		app: function () {
			var hasModifier = !_.isEmpty(this.options.modifier);
			var hasDecorator = !_.isEmpty(this.options.decorator);
			var msg = 'Creating ' + chalk.cyan(this.name) + ' ' + this.options.type;

			if(hasModifier || hasDecorator) {
				msg += ' with ';
			}

			if(hasModifier) {
				msg += 'CSS modifier ' + chalk.cyan(this.options.modifier);

				if(hasDecorator) {
					msg += ' and ';
				}
			}

			if(hasDecorator) {
				msg += 'JS decorator ' + chalk.cyan(this.options.decorator);
			}

			this.log(msg);

			var component = this.cfg.nitro.components[this.options.type];

			var files = glob.sync('**/*', {cwd: this.destinationPath(component.template), nodir: true, dot: true});
			var ignores = [
				// files to ignore
				'.DS_Store'
			];

			var user = {
				name: '',
				email: ''
			};

			var gitConfig = gitconfig.sync();

			if (!_.isEmpty(gitConfig) && !_.isEmpty(gitConfig.user)) {
				user.name = gitConfig.user.name;
				user.email = gitConfig.user.email;
			}

			var replacements = {
				user: user,
				component: {
					name: this.name, // Component name, eg. Main navigation
					js: _.capitalize(_.camelCase(this.name)), // Component name for use in JS files, eg. MainNavigation
					css: _.kebabCase(this.name), // Component name for use in CSS files, eg. main-navigation
					prefix: component.component_prefix || null, // CSS class prefix, eg. mod
					type: this.options.type, // Component type, eg. atom, molecule etc.
					file: _.kebabCase(this.name).replace(/-/g, '') // Component filename, eg. mainnavigation
				},
				modifier: {
					name: this.options.modifier, // Modifier name, eg. Highlight
					css: _.kebabCase(this.options.modifier), // Modifier name for use in CSS files, eg. highlight
					file: _.kebabCase(this.options.modifier).replace(/-/g, '')  // Modifier filename, eg.highlight
				},
				decorator: {
					name: this.options.decorator, // Decorator name, eg. Highlight
					js: _.capitalize(_.camelCase(this.options.decorator)), // Decorator name for use in JS files, eg. Highlight
					file: _.kebabCase(this.options.decorator).replace(/-/g, '')  // Modifier filename, eg.highlight
				}
			};

			files.forEach(function (file) {
				if (_.indexOf(ignores, file) !== -1) {
					return;
				}

				// exclude modifier files if modifier is not set
				if (file.indexOf('modifier') !== -1) {
					if(_.isEmpty(this.options.modifier)) {
						return;
					}
				}

				// exclude decorator files if decorator is not set
				if (file.indexOf('decorator') !== -1) {
					if(_.isEmpty(this.options.decorator)) {
						return;
					}
				}

				// filename replacements
				var fileReplacements = {
					component: replacements.component.file,
					modifier: replacements.modifier.file,
					decorator: replacements.decorator.file
				};

				var filename = file;
				_.forOwn(fileReplacements, function (value, key) {
					filename = path.join(path.dirname(filename), path.basename(filename).replace(key, value));
				});

				this.fs.copyTpl(this.destinationPath(component.template + '/' + file), this.destinationPath(component.path + '/' + this.name + '/' + filename), replacements);
			}, this);
		}
	}
});
