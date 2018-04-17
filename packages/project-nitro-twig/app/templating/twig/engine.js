/**
 * This is a wrapper for the Twig.js engine.
 */

'use strict';

const Twig = require('twig');
const patternTagFactory = require('./helpers/pattern');

// expose pattern function
Twig.extend(function(Twig) {
	Twig.exports.extendTag(patternTagFactory(Twig));
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
