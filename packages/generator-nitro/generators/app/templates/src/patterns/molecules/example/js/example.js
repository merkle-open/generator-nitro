'use strict';

import { Component, EventListener, GondelBaseComponent, startComponents } from '@gondel/core';
import $ from 'jquery';<% if (options.clientTpl) { %>
const templateExample = require('../template/example.hbs');
const templateExampleLinks = require('../template/example.links.hbs');<% } %>

const Selectors = {
	Add: '.js-m-example__add',
	More: '.js-m-example__more',
	List: '.js-m-example__list',
};

@Component('Example')
class Example extends GondelBaseComponent {
	start() {
		/* eslint-disable no-console */
		console.warn('Example #start(): remove or implement component');
		/* eslint-enable no-console */
	}

	sync() {
		/* eslint-disable no-console */
		console.warn('Example #sync(): remove or implement component');
		/* eslint-enable no-console */
	}<% if (options.clientTpl) { %>

	@EventListener('click', Selectors.Add)
	_handleAdd(e) {
		e.preventDefault();

		const $ctx = $(this._ctx);
		const tplData = {
			title: 'Client Side Rendered Example Module',
			links: [
				{
					uri: 'index',
					text: 'Link One',
				},
				{
					uri: 'index',
					text: 'Link Two',
				},
			],
		};

		const pattern = templateExample(tplData);
		const $pattern = $(pattern);

		startComponents($pattern);
		$ctx.after($pattern);

		/* eslint-disable no-console */
		console.warn('Client Side Template Example rendered');
		/* eslint-enable no-console */
	}

	@EventListener('click', Selectors.More)
	_handleMore(e) {
		e.preventDefault();

		const $ctx = $(this._ctx);
		const tplData = {
			links: [
				{
					uri: 'index',
					text: 'One more link',
				},
				{
					uri: 'index',
					text: 'Another link',
				},
			],
		};
		const links = templateExampleLinks(tplData);
		const $links = $(links);

		$ctx.find(Selectors.List).append($links);
	}<% } %>
}

export default Example;
