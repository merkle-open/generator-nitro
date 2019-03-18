'use strict';

import * as T from 'terrific';
import $ from 'jquery';

const templateExample = require('../../template/ex.hbs');
const templateExampleLinks = require('../../template/ex.links.hbs');

/**
 * Template decorator implementation for the Ex module.
 *
 * @author Pre Name <pre.name@domain.com>
 */
T.Module.Ex.Template = T.createDecorator({
	start(resolve) {
		const $ctx = $(this._ctx);

		$ctx.on('click', '.js-t-ex__add', () => {
			const theData = {
				decorator: 'Template',
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
			const pattern = templateExample(theData);
			const $pattern = $(pattern);

			this._sandbox.addModules($pattern.get(0));
			$ctx.after($pattern);

			/* eslint-disable no-console */
			console.log(`Client Side Template Ex rendered [id:${$pattern.data('t-id')}]`);
			/* eslint-enable no-console */
		});

		$ctx.on('click', '.js-t-ex__more', () => {
			const theData = {
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
			const links = templateExampleLinks(theData);
			const $links = $(links);

			$ctx.find('.js-t-ex__list').append($links);
		});

		/* eslint-disable no-console */
		console.log(`Ex Decorator Template - start id: [${$ctx.data('t-id')}]`);
		/* eslint-enable no-console */

		// calling original method
		this._parent.start(resolve);
	},
});
