'use strict';

const del = require('del');

module.exports = (gulp, plugins) => {
	return () => {
		return del('public/assets/*/**');
	};
};
