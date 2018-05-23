const Twig = require('twig');

function logAndRenderError(error) {
	console.warn(error.message);

	const template = Twig.twig({
		data: '<p class="nitro-msg nitro-msg--error">{{ message }}</p>',
	});

	return template.render({ message: error.message});
}

module.exports = {
	logAndRenderError: logAndRenderError,
};
