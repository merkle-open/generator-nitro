'use strict';

const hbs = require('hbs');

function logAndRenderError(e) {
	console.info(e.message);
	return new hbs.handlebars.SafeString(
		`<p class="nitro-msg nitro-msg--error">${e.message}</p>`
	);
}

module.exports = {
	logAndRenderError,
};
