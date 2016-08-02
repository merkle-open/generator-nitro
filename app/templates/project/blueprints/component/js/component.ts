/// <reference path="../../../../assets/vendor/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../typings/tsd.d.ts" />

module T {
	export module Module {
		export class <%= component.js %> extends Module {
			constructor(ctx:Node, sandbox:Sandbox){
				super(ctx, sandbox);
			}

			start(resolve: (value?: any) => void, reject: (error?: any) => void): void {
				console.log("start: <%= component.js %>");
				resolve();
			}
		}
	}
}
