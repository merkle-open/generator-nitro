'use strict';

const path = require('path');

function getServerPath() {
	return path.normalize(path.join(__dirname, '..', 'scripts', 'server'));
}

module.exports = {
	getServerPath,
};
