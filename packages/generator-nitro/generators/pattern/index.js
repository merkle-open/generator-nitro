'use strict';

/**
 * this generator is used as subgenerator nitro:pattern (and nitro:component)
 */

/* eslint-disable no-inline-comments, max-len, complexity, global-require, require-jsdoc */

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const fs = require('fs');
const gitconfig = require('git-config');
const glob = require('glob');
const _ = require('lodash');

module.exports = class extends Generator {

	constructor(args, opts) {
		// Calling the super constructor
		// eslint-disable-next-line prefer-rest-params
		super(args, opts);

		// Pattern name
		this.argument('name', { desc: 'the name of your pattern?', type: String, required: false, defaults: '' });

		this.passedInOptions = {
			name: this.options.name,
			type: this.options.type,
			modifier: this.options.modifier,
			decorator: this.options.decorator,
		};

		// get project config
		let projectConfig = {};
		if (fs.existsSync(this.destinationPath('config/default.js'))) {
			// use config from 2.x
			process.env.NODE_CONFIG_DIR = this.destinationPath('config');
			projectConfig = require('config');
		} else if (fs.existsSync(this.destinationPath('config.json'))) {
			// use config.json from 1.x
			projectConfig = require(this.destinationPath('config.json'));
		}

		// Compatibility with older config and subgeneartor nitro:component
		const _patternName = this.options.namespace.split(':')[1];
		this._pattern = {
			name: _patternName,
			Name: _.upperFirst(_patternName),
			node: projectConfig.nitro.patterns || projectConfig.nitro.components,
		};

		this.types = _.map(this._pattern.node, (value, key) => {
			return key;
		});

		this.option('name', {
			desc: `the name of your ${this._pattern.Name}`,
			type: String,
			defaults: this.passedInOptions.name || '',
		});

		this.option('type', {
			desc: `your desired type [${this.types.join('|')}]`,
			type: String,
			defaults: this.passedInOptions.type || this.types[0],
		});

		// Pattern modifier
		this.option('modifier', {
			desc: 'the name of your modifier',
			type: String,
			defaults: this.passedInOptions.modifier || '',
		});

		// Pattern decorator
		this.option('decorator', {
			desc: 'the name of your decorator',
			type: String,
			defaults: this.passedInOptions.decorator || '',
		});
	}

	initializing() {
		this.pkg = require('../../package.json');
	}

	prompting() {

		this.log(yosay(
			`Let me help you to create your ${this._pattern.name}…`
		));

		return this.prompt([
			{
				name: 'name',
				message: `What's the name of your ${this._pattern.name}?`,
				default: this.options.name,
				validate: (value) => {
					if (!_.isString(value) || _.isEmpty(value)) {
						return `${this._pattern.Name} name has to be a valid string`;
					}
					if (/^[0-9]/.test(value)) {
						return `${this._pattern.Name} name must not start with a Number`;
					}
					if (/(component|pattern|modifier|decorator)/i.test(value)) {
						return `Avoid 'pattern', 'component', 'modifier' and 'decorator' in ${this._pattern.Name} names. These have a special meaning`;
					}
					return true;
				},
			},
			{
				name: 'type',
				type: 'list',
				message: 'And what\'s your desired type?',
				choices: this.types,
				default: _.indexOf(this.types, this.options.type) || 0,
			},
			{
				name: 'modifier',
				message: 'Would you like to create a CSS modifier? Type your desired name or leave empty.',
				default: this.options.modifier || '',
				validate: (value) => {
					if (/(component|pattern|modifier|decorator)/i.test(value)) {
						return `Avoid 'pattern', 'component', 'modifier' and 'decorator' in ${this._pattern.Name} modifier names. These have a special meaning`;
					}
					return true;
				},
			},
			{
				name: 'decorator',
				message: 'Would you like to create a JS decorator? Type your desired name or leave empty.',
				default: this.options.decorator || '',
				validate: (value) => {
					if (_.isString(value) && (/^[0-9]/).test(value)) {
						return `${this._pattern.Name} decorator must not start with a Number`;
					}
					if (/(component|pattern|modifier|decorator)/i.test(value)) {
						return `Avoid 'pattern', 'component', 'modifier' and 'decorator' in ${this._pattern.Name} decorator names. These have a special meaning`;
					}
					return true;
				},
			},
		]).then((answers) => {
			this.name = answers.name;
			this.options.type = answers.type;
			this.options.modifier = answers.modifier;
			this.options.decorator = answers.decorator;
		});
	}

	writing() {

		const hasModifier = !_.isEmpty(this.options.modifier);
		const hasDecorator = !_.isEmpty(this.options.decorator);
		let msg = `Creating ${chalk.cyan(this.name)} ${this.options.type}`;

		if (hasModifier || hasDecorator) {
			msg += ' with ';
		}

		if (hasModifier) {
			msg += `CSS modifier ${chalk.cyan(this.options.modifier)}`;

			if (hasDecorator) {
				msg += ' and ';
			}
		}

		if (hasDecorator) {
			msg += `JS decorator ${chalk.cyan(this.options.decorator)}`;
		}

		this.log(msg);

		const pattern = this._pattern.node[this.options.type];
		const folder = this.name.replace(/[^A-Za-z0-9-]/g, '');
		const files = glob.sync('**/*', { cwd: this.destinationPath(pattern.template), nodir: true, dot: true });
		const ignores = [
			// files to ignore
			'.DS_Store',
		];
		const user = {
			name: '',
			email: '',
		};
		const gitConfig = gitconfig.sync();

		if (!_.isEmpty(gitConfig) && !_.isEmpty(gitConfig.user)) {
			user.name = gitConfig.user.name;
			user.email = gitConfig.user.email;
		}

		const patternReplacements = {
			name: this.name, // Pattern name, eg. Main Navigation
			folder, // Pattern folder, eg. MainNavigation
			js: _.upperFirst(_.camelCase(this.name.replace(/^[0-9]+/, ''))), // Pattern name for use in JS files, eg. MainNavigation
			css: _.kebabCase(this.name), // Pattern name for use in CSS files, eg. main-navigation
			prefix: pattern.patternPrefix || pattern.componentPrefix || null, // CSS class prefix, eg. m
			type: this.options.type, // Pattern type, eg. atom, molecule etc.
			file: this.name.replace(/[^A-Za-z0-9-]/g, '').toLowerCase(), // Pattern filename, eg. mainnavigation
		};
		const replacements = {
			user,
			pattern: patternReplacements,
			component: patternReplacements,
			modifier: {
				name: this.options.modifier, // Modifier name, eg. Highlight
				css: _.kebabCase(this.options.modifier), // Modifier name for use in CSS files, eg. highlight
				file: this.options.modifier.replace(/[^A-Za-z0-9-]/g, '').toLowerCase(), // Modifier filename, eg.highlight
			},
			decorator: {
				name: this.options.decorator, // Decorator name, eg. Highlight
				js: _.upperFirst(_.camelCase(this.options.decorator.replace(/^[0-9]+/, ''))), // Decorator name for use in JS files, eg. Highlight
				file: this.options.decorator.replace(/[^A-Za-z0-9-]/g, '').toLowerCase(), // Decorator filename, eg.highlight
			},
		};

		files.forEach((file) => {
			if (_.indexOf(ignores, file) !== -1) {
				return;
			}

			// exclude modifier files if modifier is not set
			if (file.indexOf('modifier') !== -1) {
				if (_.isEmpty(this.options.modifier)) {
					return;
				}
			}

			// exclude decorator files if decorator is not set
			if (file.indexOf('decorator') !== -1) {
				if (_.isEmpty(this.options.decorator)) {
					return;
				}
			}

			// filename replacements
			const fileReplacements = {
				'$pattern$': replacements.pattern.file,
				'$component$': replacements.pattern.file,
				'$modifier$': replacements.modifier.file,
				'$decorator$': replacements.decorator.file,
			};

			let filename = file;
			_.forOwn(fileReplacements, (value, key) => {
				filename = path.join(path.dirname(filename), path.basename(filename).split(key).join(value));
			});

			this.fs.copyTpl(
				this.destinationPath(`${pattern.template}/${file}`),
				this.destinationPath(`${pattern.path}/${folder}/${filename}`),
				replacements);
		}, this);
	}
};
