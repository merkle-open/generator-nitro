/**
 * This is a wrapper for the Twig.js engine.
 */

'use strict';

const Twig = require('twig');
const componentTagFactory = require('./tags/component');

Twig.extend(function(Twig) {
	Twig.exports.extendTag(componentTagFactory(Twig));
});

/**
 * Returns placeholder image url, appended with params
 */
Twig.extendFunction('placeholderImageUrl', function(src, width, height) {
	const params = {
		w: width,
		h: height,
		txt: width + '×' + height,
		fit: 'crop',
		crop: 'entropy',
		txtalign: 'center%2Cmiddle',
		txtsize: '30.0',
		txtclr: 'FFFFFF',
		txtshad: '10',
	};
	const separator = '&';

	// Convert params into query parts
	let queryParts = [];
	for (let key of Object.keys(params)) {
		let value = params[key];
		queryParts.push(`${key}=${value}`);
	}

	return src + '?' + queryParts.join(separator);
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
