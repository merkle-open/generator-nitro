const backstop = require('backstopjs');
const config = require('../backstop.config');

// Resolve project dependencies on the host; Backstop passes the config to Docker as JSON.
backstop(process.argv[2], { config, docker: true }).catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
