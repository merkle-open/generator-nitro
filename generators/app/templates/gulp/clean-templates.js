'use strict';

const del = require('del');

module.exports = (gulp, plugins) => {
	return () => {
		return del(['src/patterns/**/template/*.js', 'src/patterns/**/template/partial/*.js']);
	};
};
