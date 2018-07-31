'use strict';

const path = require('path');

function getServerPath() {
	return path.normalize(path.join(__dirname, '..', '..', 'server'));
}

module.exports = {
	getServerPath,
};
