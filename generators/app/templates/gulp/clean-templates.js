'use strict';

const del = require('del');

module.exports = (gulp, plugins) => {
	return () => {
		return del(['patterns/**/template/*.js', 'patterns/**/template/partial/*.js']);
	};
};
