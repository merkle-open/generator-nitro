'use strict';

const del = (...args) => import('del').then(mod => mod.deleteAsync(...args));
const utils = require('../lib/utils.js');

module.exports = (config) =>
	function () {
		const dest = [];
		utils.each(config.exporter, (entry) => {
			dest.push(`${entry.dest}/**/*`);
		});
		return del(dest);
	};
