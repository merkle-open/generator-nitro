module.exports = function (a, b, options) {
	if(a === b) {
		return options.fn(this);
	}

	return options.inverse(this);
};
