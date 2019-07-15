/**
 * ifCond helper, can be used to have an if statement which can compare more than just true / false
 *
 * Usage:
 *
 * {{#ifCond a '==' b}}
 * 		{{!-- your markup if condition evaluates to true --}}
 * {{else}}
 * 		{{!-- your markup if condition evaluates to false --}}
 * 	{{/ifCond}}
 *
 * 	Arguments:
 *
 * 	a: The first element to use for the comparison
 * 	b: The second element to use for the comparison
 * 	operator: the operator (string)
 * 	options: the context to use for rendering
 *
 */

module.exports = function(a, operator, b, options) {
	if (arguments.length < 4) {
		throw new Error('handlebars Helper {{#ifCond}} expects 3 arguments');
	}

	let result;

	switch (operator) {
		case '==':
			result = a == b;
			break;
		case '===':
			result = a === b;
			break;
		case '!=':
			result = a != b;
			break;
		case '!==':
			result = a !== b;
			break;
		case '<':
			result = a < b;
			break;
		case '>':
			result = a > b;
			break;
		case '<=':
			result = a <= b;
			break;
		case '>=':
			result = a >= b;
			break;
		case 'typeof':
			result = typeof a === b;
			break;
		default: {
			throw new Error('helper {{ifCond}}: invalid operator: `' + operator + '`');
		}
	}

	if (result === false) {
		return options.inverse(this);
	}
	return options.fn(this);
};
