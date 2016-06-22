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
		start: function (resolve) {
			var $ctx = $(this._ctx);

			$ctx.on('click', '.js-m-example__add', function() {
				if (T.tpl && T.tpl.example) {
					var data = {
						decorator: 'Template',
						title: 'Client Side Rendered Example Module',
						links: [
							{
								uri: 'index',
								text: 'Link One'
							},
							{
								uri: 'index',
								text: 'Link Two'
							}
						]
					};
					var component = T.tpl.example(data);
					var $component = $(component);

					this._sandbox.addModules($component.get(0));
					$ctx.after($component);
					console.log('Client Side Template Example rendered [id:' + $component.data('t-id') + ']');
				}
			}.bind(this));

			$ctx.on('click', '.js-m-example__more', function() {
				if (T.tpl && T.tpl.example && T.tpl.example.links) {
					var data = {
						links : [
							{
								uri: 'index',
								text: 'One more link'
							},
							{
								uri: 'index',
								text: 'Another link'
							}
						]
					};
					var links = T.tpl.example.links(data);
					var $links = $(links);

					$ctx.find('.js-m-example__list').append($links);
				}
			}.bind(this));

			console.log('Example Decorator Template - start id: [' + $ctx.data('t-id') + ']');

			this._parent.start(resolve); // calling original method
		}
	});
}(jQuery));
