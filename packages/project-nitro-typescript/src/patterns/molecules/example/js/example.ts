import { Component, EventListener, GondelBaseComponent, startComponents } from '@gondel/core';
import $ from 'jquery';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import templateExample from '../template/example.hbs';
// @ts-ignore
import templateExampleLinks from '../template/example.links.hbs';
/* eslint-enable @typescript-eslint/ban-ts-ignore */

/**
 * Example module implementation.
 * @author Pre Name <pre.name@domain.com>
 */

enum Selectors {
	Add = '.js-m-example__add',
	More = '.js-m-example__more',
}

@Component('Example')
export class Example extends GondelBaseComponent {
	public start() {
		/* eslint-disable no-console */
		console.warn('Example #start(): remove or implement component');
		/* eslint-enable no-console */
	}

	public sync() {
		/* eslint-disable no-console */
		console.warn('Example #sync(): remove or implement component');
		/* eslint-enable no-console */
	}

	@EventListener('click', Selectors.Add)
	private _handleAdd(e: MouseEvent) {
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
	private _handleMore(e: MouseEvent) {
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

		$ctx.find('.js-m-example__list').append($links);
	}
}
