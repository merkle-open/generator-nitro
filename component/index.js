'use strict';

/* eslint-disable no-inline-comments, max-len, complexity */

const generators = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const gitconfig = require('git-config');
const glob = require('glob');
const _ = require('lodash');

module.exports = generators.Base.extend({
  constructor: function () {
    // Calling the super constructor
    generators.Base.apply(this, arguments);

    // Component name
    this.argument('name', { desc: 'the name of your component?', type: String, required: false, defaults: '' });

    // Component type
    this.cfg = require(this.destinationPath('config.json'));

    this.types = _.map(this.cfg.nitro.components, function (value, key) {
      return key;
    });

    this.option('type', {
      desc: `your desired type [${this.types.join('|')}]`,
      type: String,
      defaults: this.types[0]
    });

    // Component modifier
    this.option('modifier', { desc: 'the name of your modifier', type: String });

    // Component decorator
    this.option('decorator', { desc: 'the name of your decorator', type: String });
  },

  initializing() {
    this.pkg = require('../package.json');
  },

  prompting() {

    this.log(yosay(
      'Let me help you to create your component…'
    ));

    return this.prompt([
      {
        name: 'name',
        message: 'What\'s the name of your component?',
        default: this.name,
        validate: function validateString(value) {
          if (!_.isString(value) || _.isEmpty(value)) {
            return 'Component name has to be a valid string';
          }
          if (/^[0-9]/.test(value)) {
            return 'Component name must not start with a Number';
          }
          return true;
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
        default: this.options.decorator || '',
        validate: function validateString(value) {
          if (_.isString(value) && /^[0-9]/.test(value)) {
            return 'Component decorator must not start with a Number';
          }
          return true;
        }
      }
    ]).then(function (answers) {
      this.name = answers.name;
      this.options.type = answers.type;
      this.options.modifier = answers.modifier;
      this.options.decorator = answers.decorator;
    }.bind(this));
  },

  writing: {
    app() {
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

      const component = this.cfg.nitro.components[this.options.type];
      const folder = this.name.replace(/[^A-Za-z0-9-]/g, '');
      const files = glob.sync('**/*', { cwd: this.destinationPath(component.template), nodir: true, dot: true });
      const ignores = [
        // files to ignore
        '.DS_Store'
      ];
      const user = {
        name: '',
        email: ''
      };
      const gitConfig = gitconfig.sync();

      if (!_.isEmpty(gitConfig) && !_.isEmpty(gitConfig.user)) {
        user.name = gitConfig.user.name;
        user.email = gitConfig.user.email;
      }

      const replacements = {
        user: user,
        component: {
          name: this.name, // Component name, eg. Main Navigation
          folder: folder, // Component folder, eg. MainNavigation
          js: _.upperFirst(_.camelCase(this.name.replace(/^[0-9]+/, ''))), // Component name for use in JS files, eg. MainNavigation
          css: _.kebabCase(this.name), // Component name for use in CSS files, eg. main-navigation
          prefix: component.component_prefix || null, // CSS class prefix, eg. m
          type: this.options.type, // Component type, eg. atom, molecule etc.
          file: this.name.replace(/[^A-Za-z0-9-]/g, '').toLowerCase() // Component filename, eg. mainnavigation
        },
        modifier: {
          name: this.options.modifier, // Modifier name, eg. Highlight
          css: _.kebabCase(this.options.modifier), // Modifier name for use in CSS files, eg. highlight
          file: this.options.modifier.replace(/[^A-Za-z0-9-]/g, '').toLowerCase()  // Modifier filename, eg.highlight
        },
        decorator: {
          name: this.options.decorator, // Decorator name, eg. Highlight
          js: _.upperFirst(_.camelCase(this.options.decorator.replace(/^[0-9]+/, ''))), // Decorator name for use in JS files, eg. Highlight
          file: this.options.decorator.replace(/[^A-Za-z0-9-]/g, '').toLowerCase()  // Decorator filename, eg.highlight
        }
      };

      files.forEach(function (file) {
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
          component: replacements.component.file,
          modifier: replacements.modifier.file,
          decorator: replacements.decorator.file
        };

        let filename = file;
        _.forOwn(fileReplacements, function (value, key) {
          filename = path.join(path.dirname(filename), path.basename(filename).replace(key, value));
        });

        this.fs.copyTpl(
          this.destinationPath(`${component.template}/${file}`),
          this.destinationPath(`${component.path}/${folder}/${filename}`),
          replacements);
      }, this);
    }
  }
});
