'use strict';

import { Component, EventListener, GondelBaseComponent, startComponents } from '@gondel/core';
import $ from 'jquery';
const templateExample = require('../template/ex.hbs');
const templateExampleLinks = require('../template/ex.links.hbs');

const Selectors = {
	Add: '.js-t-ex__add',
	More: '.js-t-ex__more',
	List: '.js-t-ex__list',
};

@Component('Ex')
class Ex extends GondelBaseComponent {
	start() {
		/* eslint-disable no-console */
		console.warn('Ex #start(): remove or implement component');
		console.log(
			'alles gut so?'.startsWith('alles') ? 'ES2015.startWith feature works' : 'broken ES2015.startWith feature'
		);
		/* eslint-enable no-console */
	}

	sync() {
		/* eslint-disable no-console */
		console.warn('Ex #sync(): remove or implement component');
		/* eslint-enable no-console */
	}

	@EventListener('click', Selectors.Add)
	_handleAdd(e) {
		e.preventDefault();

		const $ctx = $(this._ctx);
		const tplData = {
			title: 'Client Side Rendered Ex Module',
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
		console.warn('Client Side Template Ex rendered');
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
	}
}

export default Ex;
