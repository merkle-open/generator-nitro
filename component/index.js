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

		// Component name
		this.argument('name', {desc: 'the name of your component?', type: String, required: false, defaults: ''});
		this.name = this.name;

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

		// Component skin
		this.option('skin', {desc: 'the name of your skin', type: String});
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
			}
		], function (props) {
			this.name = props.name;
			this.options.type = props.type;

			// Check whether the choosen type support skins (skin_prefix in config)
			this.supportSkin = _.has(this.cfg.nitro.components[this.options.type], 'skin_prefix');

			done();
		}.bind(this));
	},

	configuring: {
		skin: function () {
			if(this.supportSkin) {
				var done = this.async();

				this.prompt([
					{
						name: 'skin',
						message: 'Would you like to create a skin? Type your desired name or leave empty.',
						default: this.options.skin || ''
					}
				], function (props) {
					this.options.skin = props.skin;

					done();
				}.bind(this));
			}
		}
	},

	writing: {
		app: function () {
			var msg = 'Creating ' + chalk.cyan(this.name) + ' ' + this.options.type;
			if(!_.isEmpty(this.options.skin)) {
				msg += ' with skin ' + chalk.cyan(this.options.skin);
			}
			this.log(msg);

			var component = this.cfg.nitro.components[this.options.type];

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

			if (!_.isEmpty(gitConfig)) {
				user.name = gitConfig.user.name;
				user.email = gitConfig.user.email;
			}

			var replacements = {
				user: user,
				component: {
					name: this.name, // Component name, eg. Main navigation
					js: _.capitalize(_.camelCase(this.name)), // Component name for use in JS files, eg. MainNavigation
					css: _.kebabCase(this.name), // Component name for use in CSS files, eg. main-navigation
					prefix: component.component_prefix || null // CSS class prefix, eg. mod
				},
				skin: {
					name: this.options.skin, // Skin name, eg. Highlight
					js: _.capitalize(_.camelCase(this.options.skin)), // Skin name for use in JS files, eg. Highlight
					css: _.kebabCase(this.options.skin), // Skin name for use in CSS files, eg. highlight
					prefix: component.skin_prefix || null // CSS class prefix, eg. skin
				}
			};

			files.forEach(function (file) {
				if (_.indexOf(ignores, file) !== -1) {
					return;
				}

				// exclude skin files if skin is not set or not supported
				if (file.indexOf('skin') !== -1) {
					if(!this.supportSkin) {
						return;
					}
					if(_.isEmpty(this.options.skin)) {
						return;
					}
				}

				// filename replacements
				var fileReplacements = {
					component: _.kebabCase(this.name).replace('-', ''),
					skin: _.kebabCase(this.options.skin).replace('-', '')
				};

				var filename = file;
				_.forOwn(fileReplacements, function (value, key) {
					filename = path.join(path.dirname(filename), path.basename(filename).replace(key, value))
				});

				this.fs.copyTpl(this.destinationPath(component.template + '/' + file), this.destinationPath(component.path + '/' + this.name + '/' + filename), replacements);
			}, this);
		}
	}
});
