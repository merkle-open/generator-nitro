'use strict';

const path = require('path');
const config = require('config');

function getServerPath() {
	return path.normalize(path.join(__dirname, '..', 'scripts', 'server'));
}

function getValidThemes() {
	return config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : false;
}

module.exports = {
	getServerPath,
	getValidThemes,
};
