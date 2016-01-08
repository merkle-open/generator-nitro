var del = require('del');

module.exports = function (gulp, plugins) {
	return function () {
		return del('public/assets/*/**');
	};
};
