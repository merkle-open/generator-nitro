/// <reference path="../../../../../assets/vendor/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../../typings/tsd.d.ts" />
/// <reference path="../<%= component.js%>.ts" />

module T {
	export module Module {
		function <%= component.js %><%= skin.js %>(mod: <%= component.js%>) {
			var start = mod.start.bind(mod);
			mod.start = function (resolve: (value?: any) => void, reject: (error?: any) => void) {
				console.log("start: <%= component.js %>.<%= skin.js %>");
				start(resolve, reject);
			};
		}
		Module['<%= component.js %>']['<%= skin.js %>'] = <%= component.js %><%= skin.js %>;
	}
}
