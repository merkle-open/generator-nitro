'use strict';

const fs = require('fs/promises');
const utils = require('../lib/utils.js');

module.exports = (config) =>
	async function clean() {
		await utils.each(config.exporter, async (entry) => {
			await fs.rm(entry.dest, {
				recursive: true,
				force: true,
			});
		});
	};
