/// <reference path="../../../../node_modules/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../typings/tsd.d.ts" />

module T {
	export module Module {
		export class <%= pattern.js %> extends Module {
			constructor(ctx:Node, sandbox:Sandbox){
				super(ctx, sandbox);
			}

			start(resolve: (value?: any) => void, reject: (error?: any) => void): void {
				console.log('start: <%= pattern.js %>');
				resolve();
			}
		}
	}
}
