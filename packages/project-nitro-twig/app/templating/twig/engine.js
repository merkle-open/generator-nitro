/**
 * This is a wrapper for the Twig.js engine.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Twig = require('twig');
const config = require('config');

const files = {};
const coreHelpersDir = `${config.get('nitro.basePath')}app/templating/twig/helpers/`;
const projectHelpersDir = `${config.get('nitro.basePath')}project/helpers/`;
const coreFiles = fs.readdirSync(coreHelpersDir);
const projectFiles = fs.readdirSync(projectHelpersDir);

coreFiles.map((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = coreHelpersDir + file;
	}
});

projectFiles.map((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = projectHelpersDir + file;
	}
});

Object.keys(files).forEach((key) => {
	const helperTagFactory = require(files[key]);

	// expose helper as custom tag
	Twig.extend(function(Twig) {
		Twig.exports.extendTag(helperTagFactory(Twig));
	});
});

Twig.renderWithLayout = function(path, options, fn) {
	const layoutPath = options.settings.views + '/' +  options.layout + '.' + options.settings['view engine'];

	function layoutRendered(error, layout) {
		function bodyRendered(error, body) {
			layout = layout.replace('<!-- Replace With Body -->', body);
			return fn(null, layout);
		}
		return Twig.__express(path, options, bodyRendered);
	}
	return Twig.__express(layoutPath, options, layoutRendered);
};

module.exports = Twig;
