'use strict';

const config = require('config');
const partialMatch = new RegExp(`\.${config.get('nitro.viewFileExtension')}$`);

module.exports = function (hbs) {
	const hbsutils = require('hbs-utils')(hbs);
	const registerPartial = config.get('server.production') || !config.get('nitro.watch.partials') ? 'registerPartials' : 'registerWatchedPartials';

	hbsutils[registerPartial](config.get('nitro.basePath') + config.get('nitro.viewPartialsDirectory'), {
		match: partialMatch,
		name: (template) => {
			// fix template path for subfolders on windows
			return template.replace(/\\/g, '/');
		},
	});
};
