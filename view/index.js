'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var gitconfig = require('git-config');
var glob = require('glob');
var _ = require('lodash');

module.exports = generators.Base.extend({
	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		// View name
		this.argument('name', {desc: 'the name of your view?', type: String, required: false});

		// View title
		this.argument('title', {desc: 'the page title of your view?', type: String, required: false});

		this.cfg = require(this.destinationPath('config.json'));
	},

	initializing: function () {
		this.pkg = require('../package.json');
	},

	prompting: function () {
		var done = this.async();

		this.log(yosay(
			'Let me help you to create your view…'
		));

		this.prompt([
			{
				name: 'name',
				message: 'What\'s the name of your view?',
				default: _.kebabCase(this.name), // eg. test-page
				validate: function validateString(value) {
					if (!_.isString(value) || _.isEmpty(value)) {
						return 'View name has to be a valid string';
					}
					return true;
				}
			},
			{
				name: 'title',
				message: 'What\'s the page title for your view?',
				default: this.title || _.capitalize(_.camelCase(this.name)) // eg. TestPage
			}
		], function (props) {
			this.name = _.kebabCase(props.name); // always force kebabCase for view name
			this.title = props.title;

			done();
		}.bind(this));
	},

	writing: {
		app: function () {
			var msg = 'Creating ' + chalk.cyan(this.name);

			this.log(msg);

			var view = this.cfg.nitro.views;
			var files = glob.sync('**/*', {cwd: this.destinationPath(view.template), nodir: true, dot: true});
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
				view: {
					name: this.name, // View name, eg. Index
					title: this.title // Page title, eg. "The Index Page"
				}
			};

			files.forEach(function (file) {
				// filename replacements
				var fileReplacements = {
					view: replacements.view.name
				};

				var filename = file;
				_.forOwn(fileReplacements, function (value, key) {
					filename = path.join(path.dirname(filename), path.basename(filename).replace(key, value));
				});

				this.fs.copyTpl(this.destinationPath(view.template + '/' + file), this.destinationPath(view.path + '/' + filename), replacements);
			}, this);
		}
	}
});
