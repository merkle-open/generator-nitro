const twig = require('twig');

function logAndRenderError(e) {
	console.info(e.message);
	return twig({
		data: '<p class="nitro-msg nitro-msg--error">' + e.message + '</p>',
	}).render();
}

module.exports = {
	logAndRenderError,
};
