/// <reference path="../../../../../node_modules/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../../typings/tsd.d.ts" />
/// <reference path="../<%= pattern.js%>.ts" />

module T {
	export module Module {
		function <%= pattern.js %><%= decorator.js %>(mod: <%= pattern.js%>) {
			const start = mod.start.bind(mod);
			mod.start = function (resolve: (value?: any) => void, reject: (error?: any) => void) {
				console.log('start: <%= pattern.js %>.<%= decorator.js %>');
				start(resolve, reject);
			};
		}
		Module['<%= pattern.js %>']['<%= decorator.js %>'] = <%= pattern.js %><%= decorator.js %>;
	}
}
