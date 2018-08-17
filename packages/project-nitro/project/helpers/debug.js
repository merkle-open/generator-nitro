module.exports = function(optionalValue) {
	console.log('Current Context');
	console.log('====================');
	console.log(this);

	if (optionalValue) {
		console.log('optionalValue');
		console.log('====================');
		console.log(optionalValue);
	}
};
