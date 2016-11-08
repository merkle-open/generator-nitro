(function ($) {
	'use strict';
	/**
	 * Template decorator implementation for the Example module.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace T.Module.Example
	 * @class Template
	 * @extends T.Module
	 * @constructor
	 */
	T.Module.Example.Template = T.createDecorator({
		start(resolve) {
			const $ctx = $(this._ctx);

			$ctx.on('click', '.js-m-example__add', () => {
				if (T.tpl && T.tpl.example) {
					const data = {
						decorator: 'Template',
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
					const component = T.tpl.example(data);
					const $component = $(component);

					this._sandbox.addModules($component.get(0));
					$ctx.after($component);
					console.log(`Client Side Template Example rendered [id:${$component.data('t-id')}]`);
				}
			});

			$ctx.on('click', '.js-m-example__more', () => {
				if (T.tpl && T.tpl.example && T.tpl.example.links) {
					const data = {
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
					const links = T.tpl.example.links(data);
					const $links = $(links);

					$ctx.find('.js-m-example__list').append($links);
				}
			});

			console.log(`Example Decorator Template - start id: [${$ctx.data('t-id')}]`);

			// calling original method
			this._parent.start(resolve);
		},
	});
}(jQuery));
