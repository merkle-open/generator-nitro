/// <reference path="../../../../../node_modules/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../../typings/tsd.d.ts" />
/// <reference path="../example.ts" />

module T {
	export module Module {
		function ExampleBlue(mod:Example) {
			const start = mod.start.bind(mod);
			mod.start = function (resolve:(value?:any) => void, reject:(error?:any) => void) {
				const $ctx = $(this._ctx);

				/* eslint-disable no-console */
				console.log(`Example Decorator Blue - start id: [${$ctx.data('t-id')}]`);
				/* eslint-enable no-console */

				start(resolve, reject); // calling original method
			};

			const sync = mod.sync.bind(mod);
			mod.sync = function () {
				const $ctx = $(this._ctx);

				/* eslint-disable no-console */
				console.log(`Example Decorator Blue - sync id: [${$ctx.data('t-id')}]`);
				/* eslint-enable no-console */

				sync(); // calling original method
			};
		}

		Module['Example']['Blue'] = ExampleBlue;
	}
}
