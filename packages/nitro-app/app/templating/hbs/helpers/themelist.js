/**
 * themelist helper, can be used to display lists of themes based on the config theme array
 *
 * Usage:
 *
 * {{themelist current=theme.id}}
 *
 */

'use strict';

const hbs = require('hbs');
const config = require('config');
const themes = config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : false;

module.exports = function () {
	const context = arguments[arguments.length - 1];
	const defaultTheme = themes ? themes.find((theme) => theme.isDefault).id : false;
	const themeId = context.hash.current ? context.hash.current : process.env.THEME || defaultTheme;
	const markup = [];

	if (themes) {
		markup.push('<ul>');
		for (const theme of themes) {
			if (theme.id === themeId) {
				markup.push(`<li><span>${theme.name} (current)</span></li>`);
			} else {
				markup.push(`<li><a href="/theme/${theme.id}">${theme.name}</a></li>`);
			}
		}
		markup.push('</ul>');
	} else {
		markup.push('<p>no themes defined</p>');
	}

	return new hbs.handlebars.SafeString(markup.join(''));
};
