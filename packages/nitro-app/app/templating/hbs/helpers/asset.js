/**
 * asset helper, can be used to change asset pathes depending on the environment
 * - prefix assets with the correct path of their environment
 * - use minified version only on production environment
 *
 * Usage:
 *
 * {{asset name='/css/ui.min.css'}}
 * (will load public/assets/css/ui.css on development environment)
 * (or public/assets/<theme>/css/ui.css if you use the theme feature)
 *
 * {{asset name='/img/icon/favicon-32x32.png'}}
 * (will load public/assets/img/icon/favicon-32x32.png)
 * (or public/assets/<theme>/css/ui.img/icon/favicon-32x32.png if you use the theme feature)
 */

const hbs = require('hbs');
const path = require('path');

module.exports = function (context) {
	const contextDataRoot = context.data && context.data.root ? context.data.root : {};
	let name = context.hash.name;

	// remove .min from asset on development environment
	if (!contextDataRoot._nitro.production) {
		name = name.replace(/\.min\./, '.');
	}

	const theme = contextDataRoot.theme ? `/${contextDataRoot.theme.id}` : '';

	const assetPath = path.join('/assets/', theme, name).replace(/\\/g, '/');
	return new hbs.SafeString(assetPath);
};
