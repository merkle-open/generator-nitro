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
				var $ctx = $(this._ctx)<% if (!options.clientTpl) { %>;<% } else { %>,
                    data = {
                        'modifier': '',
                        'decorator': '',
                        'title': 'Client Side Template Example'+ $ctx.data('t-id') + ']',
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
		}
	}
}
