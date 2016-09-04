/// <reference path="../../../../../assets/vendor/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../../typings/tsd.d.ts" />
/// <reference path="../example.ts" />

module T {
	export module Module {
		function ExampleBlue(mod:Example) {
			var start = mod.start.bind(mod);
			mod.start = function (resolve:(value?:any) => void, reject:(error?:any) => void) {
				var $ctx = $(this._ctx);

				console.log('Example Decorator Blue - start id: [' + $ctx.data('t-id') + ']');

				start(resolve, reject); // calling original method
			};

			var sync = mod.sync.bind(mod);
			mod.sync = function () {
				var $ctx = $(this._ctx);

				console.log('Example Decorator Blue - sync id: [' + $ctx.data('t-id') + ']');

				sync(); // calling original method
			};
		}

		Module['Example']['Blue'] = ExampleBlue;
	}
}
