(function ($) {
	'use strict';
	/**
	 * Example module implementation.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace T.Module
	 * @class Example
	 * @extends T.Module
	 */
	T.Module.Example = T.createModule({
		start: function (resolve) {
			var $ctx = $(this._ctx);
			this._events.on('t.sync', this.sync.bind(this));

			console.log('Example - start [id:' + $ctx.data('t-id') + ']');

			resolve();
		},
		sync: function () {
			var $ctx = $(this._ctx);<% if (options.clientTpl) { %>
			var data = {
				'links': [
					{
						'uri': 'index',
						'text': 'Client Side Template Example 1'
					},
					{
						'uri': 'index',
						'text': 'Client Side Template Example 2'
					}
				]
			};

			if (T.tpl && T.tpl.example && T.tpl.example.links) {
				var links = T.tpl.example.links(data);
				var $links = $(links);

				this._sandbox.addModules($links.get(0));
				$ctx.after($links);

				console.log('Client Side Template Example rendered [id:' + $ctx.data('t-id') + ']');
			}
			<% } %>
			console.log('Example - sync [id:' + $ctx.data('t-id') + ']');
		}
	});
}(jQuery));
