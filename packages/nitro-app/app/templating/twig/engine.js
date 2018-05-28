/**
 * This is a wrapper for the Twig.js engine.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Twig = require('twig');
const config = require('config');

const files = {};
const coreHelpersDir = path.normalize(path.join(__dirname, 'helpers'));
const projectHelpersDir = `${config.get('nitro.basePath')}project/helpers`;
const coreFiles = fs.readdirSync(coreHelpersDir);
const projectFiles = fs.readdirSync(projectHelpersDir);

coreFiles.forEach((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = `${coreHelpersDir}/${file}`;
	}
});

projectFiles.forEach((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = `${projectHelpersDir}/${file}`;
	}
});

Object.keys(files).forEach((key) => {
	const helperTagFactory = require(files[key]);

	// expose helper as custom tag
	/* eslint-disable-next-line */
	Twig.extend(function(Twig) {
		Twig.exports.extendTag(helperTagFactory(Twig));
	});
});

// eslint-disable-next-line
Twig.renderWithLayout = (path, options, fn) => {
	const layoutPath = `${options.settings.views}/${options.layout}.${options.settings['view engine']}`;

	function layoutRendered(error, layout) {
		function bodyRendered(body) {
			layout = layout.replace('<!-- Replace With Body -->', body);
			return fn(null, layout);
		}
		return Twig.__express(path, options, bodyRendered);
	}
	return Twig.__express(layoutPath, options, layoutRendered);
};

module.exports = Twig;
