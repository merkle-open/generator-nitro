/**
 * asset helper, can be used to change asset pathes depending on the environment
 * - prefix assets with the correct path of their environment
 * - use minified version only on production environment
 *
 * Usage:
 *
 * {{asset name='/css/ui.min.css'}}
 * (will load public/assets/css/ui.css on development environment)
 *
 * {{asset name='/img/icon/favicon-32x32.png'}}
 */

const hbs = require('hbs');
const path = require('path');

module.exports = function(context) {
	const contextDataRoot = context.data && context.data.root ? context.data.root : {};
	let name = context.hash.name;

	// remove .min from asset on development environment
	if (!contextDataRoot._nitro.production) {
		name = name.replace(/\.min\./, '.');
	}

	const assetPath = path.join('/assets/', name).replace(/\\/g, '/');
	return new hbs.SafeString(assetPath);
};
