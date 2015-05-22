/// <reference path="../../../../assets/vendor/terrific/dist/Terrific.d.ts" />

module T {
    class Example extends Module {
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
            var $ctx = $(this._ctx);

            console.log('Example - sync [id:' + $ctx.data('t-id') + ']');
        }
    }

    Module['Example'] = Example;
}