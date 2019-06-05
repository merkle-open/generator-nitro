'use strict';

const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

function logAndRenderError(e) {
	console.info(e.message);
	return new hbs.handlebars.SafeString(
		`<p class="nitro-msg nitro-msg--error">${e.message}</p>`
	);
}

function readdirSyncRecursive(dir, subpath, filelist) {
	subpath = subpath || '';
	filelist = filelist || [];

	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filepath = path.join(dir, file);

		if (fs.statSync(filepath).isDirectory()) {
			filelist = readdirSyncRecursive(filepath, `${subpath}${file}/`, filelist);
		} else {
			filelist.push(subpath + file);
		}
	});

	return filelist;
}

module.exports = {
	logAndRenderError,
	readdirSyncRecursive,
};
