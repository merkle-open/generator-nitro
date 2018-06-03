function getUser(req, res, next){
	res.locals.user = {name: "my name", email: "me@test.com"};
	next();
}

exports = module.exports = function(app){
	app.route('*') // all routes
		.get(getUser);
};
