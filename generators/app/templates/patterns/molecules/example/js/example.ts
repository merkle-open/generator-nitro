/// <reference path="../../../../node_modules/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../typings/tsd.d.ts" />

module T {
	export module Module {
		export class Example extends Module {
			constructor(ctx:Node, sandbox:Sandbox) {
				super(ctx, sandbox);
			}

			start(resolve:(value?:any) => void, reject:(error?:any) => void):void {
				const $ctx = $(this._ctx);
				this._events.on('t.sync', this.sync.bind(this));

				/* eslint-disable no-console */
				console.log(`Example - start [id:${$ctx.data('t-id')}]`);
				/* eslint-enable no-console */

				resolve();
			}

			sync() {
				const $ctx = $(this._ctx);
				/* eslint-disable no-console */
				console.log(`Example - sync [id:${$ctx.data('t-id')}]`);
				/* eslint-enable no-console */
			}
		}
	}
}
