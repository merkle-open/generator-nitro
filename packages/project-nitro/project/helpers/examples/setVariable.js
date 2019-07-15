/**
 * setVariable helper allows you to set variables on view level and use them elsewhere
 *
 * Usage:
 *
 * set:
 * {{setVariable '_specialPage' true}}
 *
 * get:
 * {{#if _specialPage}}has variable `_specialPage`{{/if}}
 *
 * 	Arguments:
 *
 * 	a: The variable name
 * 	b: The variable value
 * 	options: the context to use for rendering
 *
 */

module.exports = function setVariable(name, value, options){
	options.data.root[name] = value;
};
