/// <reference path="../../../../../assets/vendor/terrific/dist/terrific.d.ts" />
/// <reference path="../../../../../typings/tsd.d.ts" />
/// <reference path="../example.ts" />

module T {
    export module Module {
        export module Example {
            export function Blue(mod:Example) {
                var start = mod.start.bind(mod);
                mod.start = function (resolve:(value?:any) => void, reject:(error?:any) => void) {
                    var $ctx = $(mod._ctx);

                    console.log('Example Skin Blue - start id: [' + $ctx.data('t-id') + ']');

                    start(resolve, reject); // calling original method
                };

                var sync = mod.sync.bind(mod);
                mod.sync = function() {
                    var $ctx = $(mod._ctx);

                    console.log('Example Skin Blue - sync id: [' + $ctx.data('t-id') + ']');

                    sync(); // calling original method
                };
            }
        }
    }
}
