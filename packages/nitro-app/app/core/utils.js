'use strict';

const fs = require('fs');
const path = require('path');
const config = require('config');

function getServerBaseUrl(port) {
	port = port || config.get('server.port');
	const rawHost = (config.has('server.host')) ? config.get('server.host') : 'localhost';
	const host = ['0.0.0.0', '::', '::0'].includes(String(rawHost)) ? 'localhost' : rawHost;
	return `http://${host}:${port}`;
}

function getLayoutName(layoutPath) {
	const layoutPathWithoutViewPath = config
		.get('nitro.viewLayoutsDirectory')
		.replace(`${config.get('nitro.viewDirectory')}/`, '');
	return layoutPath.replace(`${layoutPathWithoutViewPath}/`, '');
}

function getLayoutPath(layoutName) {
	return `${config
		.get('nitro.viewLayoutsDirectory')
		.replace(`${config.get('nitro.viewDirectory')}/`, '')}/${layoutName}`;
}

function layoutExists(layoutName) {
	const layoutPath = path.join(
		config.get('nitro.basePath'),
		config.get('nitro.viewLayoutsDirectory'),
		`/${layoutName}.${config.get('nitro.viewFileExtension')}`
	);
	return fs.existsSync(layoutPath);
}

module.exports = {
	getServerBaseUrl,
	getLayoutName,
	getLayoutPath,
	layoutExists,
};
