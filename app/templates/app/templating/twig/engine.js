/**
 * This is a wrapper for the Twig.js engine.
 */

'use strict';

var Twig = require('Twig');
var componentTagFactory = require('./tags/component');

Twig.extend(function(Twig) {
	Twig.exports.extendTag(componentTagFactory(Twig));
});

module.exports = Twig;
