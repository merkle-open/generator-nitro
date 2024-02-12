function getUser(req, res, next) {
	res.locals.user = { name: 'my name', email: 'me@test.com' };
	next();
}

exports = module.exports = function (app) {
	// all routes
	app.route('*').all(getUser);
};
