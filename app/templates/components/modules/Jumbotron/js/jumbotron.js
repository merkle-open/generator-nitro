(function($) {
    'use strict';
    /**
     * <%= component.name %> module implementation.
     *
     * @author <%= user.name %> <<%= user.email %>>
     * @namespace Tc.Module
     * @class <%= component.js %>
     * @extends Tc.Module
     */
    Tc.Module.Jumbotron = Tc.Module.extend({

        init: function($ctx, sandbox, modId) {
            this._super($ctx, sandbox, modId);


        },

        on: function(callback) {
            var mod = this,
                $ctx = mod.$ctx;

            callback();
        },

        after: function() {
            var mod = this,
                $ctx = mod.$ctx;


        }
    });
}(Tc.$));
