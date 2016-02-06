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
			var $ctx = $(this._ctx)<% if (!options.clientTpl) { %>;<% } else { %>,
				data = {
					'modifier': '',
					'decorator': '',
					'title': 'Client Side Template Example [id: '+ $ctx.data('t-id') + ']',
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

				if (T.tpl && T.tpl.example) {
					var example = T.tpl.example(data),
						$example = $(example);

					// Don't use this._sandbox.addModules($example.get(0)); here,
					// it would generate an endless loop!
					$ctx.after($example);
					
					console.log('Client Side Template Example [id:' + $ctx.data('t-id') + ']');
				}
			<% } %>

			console.log('Example - sync [id:' + $ctx.data('t-id') + ']');
		}
	});
}(jQuery));
