/// <reference path="../../../../assets/vendor/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../typings/tsd.d.ts" />

module T {
	export module Module {
		export class Example extends Module {
			constructor(ctx:Node, sandbox:Sandbox) {
				super(ctx, sandbox);
			}

			start(resolve:(value?:any) => void, reject:(error?:any) => void):void {
				var $ctx = $(this._ctx);

				console.log('Example - start [id:' + $ctx.data('t-id') + ']');

				this._events.on('t.sync', this.sync.bind(this));
				resolve();
			}

			sync() {
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

					this._sandbox.addModules(links.get(0));
					$ctx.after($links);

					console.log('Client Side Template Example rendered [id:' + $ctx.data('t-id') + ']');
				}
				<% } %>
				console.log('Example - sync [id:' + $ctx.data('t-id') + ']');
			}
		}
	}
}
