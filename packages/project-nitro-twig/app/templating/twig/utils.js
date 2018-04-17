const Twig = require('twig');

function logAndRenderError(e) {
	console.warn(e.message);

	const template = Twig.twig({
		id: "error",
		data: '<p class="nitro-msg nitro-msg--error">{{ message }}</p>',
	});

	return template.render({ message: e.message});
}

module.exports = {
	logAndRenderError: logAndRenderError,
};
