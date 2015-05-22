/// <reference path="../../../../assets/vendor/terrific/dist/Terrific.d.ts" />

module T {
    class <%= component.js %> extends Module {
        constructor(ctx:Node, sandbox:Sandbox){
            super(ctx, sandbox);
        }

        start(resolve: (value?: any) => void, reject: (error?: any) => void): void {
            console.log("start: <%= component.js %>");
            resolve();
        }
    }

    Module['<%= component.js %>'] = <%= component.js %>;
}